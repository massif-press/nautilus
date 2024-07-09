import { defineStore } from 'pinia';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { getUser, updateUser } from '../api';

const reloadSession = async (cognito, username) => {
  console.log(cognito, username);

  return new Promise((resolve, reject) => {
    const rt = new AmazonCognitoIdentity.CognitoRefreshToken({
      RefreshToken: cognito.refreshToken.token,
    });

    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: (import.meta as any).env.VITE_APP_USER_POOL_ID,
      ClientId: (import.meta as any).env.VITE_APP_CLIENT_ID,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(rt, (err, session) => {
      if (err) reject(err);
      else resolve(session);
    });
  });
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user_id: '',
    email: '',
    username: '',
    discord: '',
    attribution: '',
    dev_access: false,
    image_submission: false,
    show_discord: false,
    loaded: false,
    is_mod: false,
    created_at: 0,
    updated_at: 0,
  }),
  actions: {
    async load() {
      console.log('Loading user data...');

      this.loaded = false;
      const credentials = JSON.parse(localStorage.getItem('nautilus_credentials')!);
      console.log(credentials);
      if (credentials && credentials.cognito) {
        const exp = credentials.cognito.idToken.payload.exp * 1000;
        console.log('Token expires at:', new Date(exp).toISOString());

        if (exp < Date.now()) {
          console.info('Token expired, refreshing...');
          await reloadSession(credentials.cognito, credentials.username);
        }

        this.setCognitoData(credentials.cognito, credentials.username);

        if (localStorage.getItem('nautilus_user_data')) {
          const userData = JSON.parse(localStorage.getItem('nautilus_user_data')!);
          this.setUserData(userData);
        } else {
          await this.getUserNautilusData();
        }

        this.loaded = true;
      }
    },
    logout() {
      localStorage.removeItem('nautilus_credentials');
      this.user_id = '';
      this.email = '';
      this.username = '';
      this.discord = '';
      this.attribution = '';
      this.dev_access = false;
      this.image_submission = false;
      this.show_discord = false;
      this.is_mod = false;
      this.loaded = false;
    },
    async login(username: string, password: string) {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: (import.meta as any).env.VITE_APP_USER_POOL_ID,
        ClientId: (import.meta as any).env.VITE_APP_CLIENT_ID,
      });

      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
      });
      await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            this.setCognitoData(result, username);
            resolve(result);
          },
          onFailure: (err) => {
            console.info('Login failed!');
            console.error(err);
            reject(err);
          },
        });
      });
    },
    async refresh() {
      console.info('Refreshing user access token...');
      const credentials = JSON.parse(localStorage.getItem('nautilus_credentials')!);
      if (credentials && credentials.cognito) {
        reloadSession(credentials.cognito, credentials.username)
          .then((newTokens) => {
            this.setCognitoData(newTokens, credentials.username);
          })
          .catch((err) => {
            console.error('Session refresh failed:', err);
          });
      }
    },
    setCognitoData(cognito: any, username: string) {
      localStorage.setItem('nautilus_credentials', JSON.stringify({ cognito, username }));
      this.email = username;
      this.user_id = cognito.idToken.payload.sub;
    },
    setUserData(userData: any) {
      for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(userData, key)) {
          this[key] = userData[key];
        }
      }
    },
    async getUserNautilusData(): Promise<void> {
      const userData = await getUser(this.user_id);
      localStorage.setItem('nautilus_user_data', JSON.stringify(userData));
      this.setUserData(userData);
    },
    async updateUser(): Promise<void> {
      const userData = {};
      const inc = ['username', 'discord', 'attribution', 'show_discord'];
      for (const key in this) {
        if (inc.includes(key)) userData[key] = this[key];
      }
      try {
        await updateUser(this.user_id, userData);
        localStorage.setItem('nautilus_user_data', JSON.stringify(userData));
      } catch (err) {
        throw new Error('Failed to update user data');
      }
    },
  },
});
