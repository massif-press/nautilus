<template>
  <v-container class="text-center pb-12">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <div class="main-title">NAUTILUS</div>
        <v-icon icon="cc:logo" size="260" class="mt-n10 ml-1" />
      </v-col>
    </v-row>
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
      <v-btn to="/main/landing" block class="rounded-0" color="primary">LOG IN</v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
  }),
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
