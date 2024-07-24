import { defineStore } from 'pinia';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { getUser, updateUser } from '../api';
import { getItem, setItem } from 'localforage';

const reloadSession = async (cognito, username) => {
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
    is_mod: false,
    created_at: 0,
    updated_at: 0,
    loaded: false,
  }),
  actions: {
    async load() {
      if (this.loaded) return;
      const credentials = JSON.parse(localStorage.getItem('nautilus_credentials')!);
      if (credentials && credentials.cognito) {
        const exp = credentials.cognito.idToken.payload.exp * 1000;

        if (exp < Date.now()) {
          console.info('Token expired, refreshing...');
          await reloadSession(credentials.cognito, credentials.username);
        }

        this.setCognitoData(credentials.cognito, credentials.username);
      }

      if (!this.email) return;
      console.info('Loading user data...');

      if (localStorage.getItem('nautilus_user_data')) {
        const userData = JSON.parse(localStorage.getItem('nautilus_user_data')!);
        this.setUserData(userData);
      } else {
        await this.getUserNautilusData();
      }

      this.loaded = true;
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
    async setUserData(userData: any) {
      for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(userData, key)) {
          this[key] = userData[key];
        }
      }

      this.is_mod = await getItem('mod_flag');
      this.dev_access = await getItem('dev_flag');
      this.image_submission = await getItem('img_flag');
    },
    async getUserNautilusData(): Promise<void> {
      const userData = await getUser(this.user_id);

      const dKey = userData.dev_key;
      const mKey = userData.mod_key;
      const iKey = userData.img_key;
      delete userData.dev_key;
      delete userData.mod_key;
      delete userData.img_key;

      localStorage.setItem('nautilus_user_data', JSON.stringify(userData));

      if (mKey) setItem('mod_flag', mKey === (import.meta as any).env.VITE_APP_MOD_KEY);
      if (dKey)
        setItem('dev_flag', (this.dev_access = dKey === (import.meta as any).env.VITE_APP_DEV_KEY));
      if (iKey)
        setItem(
          'img_flag',
          (this.image_submission = iKey === (import.meta as any).env.VITE_APP_IMG_KEY)
        );

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
