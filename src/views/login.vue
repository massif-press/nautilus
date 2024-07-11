<template>
  <v-container id="container" class="text-center pb-12">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <div class="main-title">NAUTILUS</div>
        <v-icon icon="cc:logo" size="260" class="mt-n10 ml-1" />
      </v-col>
    </v-row>
    <v-alert color="pink" variant="outlined" border max-width="850px" class="mx-auto my-3">
      <div class="text-h6">STRESS TEST MODE</div>
      <p>
        The Nautilus app is currently in STRESS TEST MODE.
        <br />
        <b class="text-error">All data will be erased at the end of the test</b>
        .
      </p>
    </v-alert>
    <v-card variant="tonal" max-width="850px" class="mx-auto">
      <v-card-text class="text-h6 font-weight-light">
        <p>
          You are a
          <b class="text-accent">LOGISTICS SPECIALIST</b>
          working for the galaxy-spanning interstellar freight and transportation enterprise
          <b class="text-accent">IPS-NORTHSTAR.</b>
        </p>
        <p class="mt-2">
          You are responsible for managing the
          <b class="text-accent">NAUTILUS System,</b>
          IPS-N proprietary omninet software that tracks and manages the flow of cargo across the
          galaxy.
        </p>
      </v-card-text>
      <v-row align="center">
        <v-col><v-divider /></v-col>
        <v-col cols="auto"><v-icon size="small" icon="mdi-ship-wheel" /></v-col>
        <v-col><v-divider /></v-col>
      </v-row>
      <v-card-text class="text-left">
        <div class="text-h6">OPERATIONAL GUIDELINES</div>
        <ul class="ml-3">
          <li>You may not grant NAUTILUS System Access to other users.</li>
          <li>You may not share NAUTILUS System Access Credentials with other IPS-N personnel.</li>
          <li>Do not submit falsified data to the NAUTILUS System.</li>
          <li>
            All submitted information is subject to review by the IPS-NORTHSTAR Compliance Office.
          </li>
          <li>
            Do not attempt to access the NAUTILUS System from unauthorized Omninet nodes or relays.
          </li>
          <li>
            Do not attempt to access the NAUTILUS System while in a state of ontological distress.
          </li>
          <li>The reproduction of unfiltered NHP output is strictly prohibited.</li>
          <li>The transmission of NAUTILUS data to unauthorized parties is strictly prohibited.</li>
        </ul>
      </v-card-text>
      <v-row align="center">
        <v-col><v-divider /></v-col>
        <v-col cols="auto"><v-icon size="small" icon="mdi-account-circle-outline" /></v-col>
        <v-col><v-divider /></v-col>
      </v-row>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="Username"
          clearable
          prepend-inner-icon="mdi-account" />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          clearable
          prepend-inner-icon="mdi-lock" />
      </v-card-text>
      <v-btn block class="rounded-0" color="primary" @click="login" :loading="loading">
        LOG IN
      </v-btn>
      <v-fade-transition>
        <div v-if="loading" class="text-center text-caption my-2">
          <i>
            Logging in. This may take a moment if this is your first time logging in, or if you have
            not logged in recently.
          </i>
          <div v-if="progressMessage" class="px-12">
            <v-progress-linear
              v-if="loading"
              v-model="progress"
              color="accent"
              class="rounded-xl my-1"
              height="20" />
          </div>
          <i>
            {{ progressMessage }}
          </i>
        </div>
      </v-fade-transition>
      <div ref="message" />
    </v-card>
    <v-snackbar v-model="snackbar" color="error" vertical rounded="md">
      <div>Unable to log in</div>
      <p>
        <i>{{ errorMessage }}</i>
      </p>
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { getUser } from '../api';
import { useDataStore } from '../stores/dataStore';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    snackbar: false,
    errorMessage: '',
    loading: false,
    progress: 0,
    progressMessage: 'Authenticating...',
    preAuth: false,
  }),
  async created() {
    await useUserStore().load();
    if (useUserStore().loaded) this.$router.push('/main/landing');
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        await useUserStore().login(this.username, this.password);
        this.progress = 10;
        this.progressMessage = 'Updating Nautilus user data...';
        this.$refs.message?.scrollIntoView({ behavior: 'smooth' });
        await useUserStore().getUserNautilusData();

        this.progress = 40;
        this.progressMessage = 'Retrieving map data...';
        await useDataStore().load();

        this.progress = 98;
        this.progressMessage = 'Resolving local data...';

        this.$router.push('/main/landing');
      } catch (err) {
        console.error(err);
        this.loading = false;
        this.progressMessage = '';
        this.errorMessage = err?.message || 'Unknown error';
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.main-title {
  font-family: 'Montserrat', monospace;
  font-weight: 400;
  font-style: normal;
  font-size: 5rem;
  text-transform: uppercase;
  letter-spacing: 40px;
}
</style>
