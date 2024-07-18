<template>
  <v-container id="container" class="text-center pb-12">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <div class="main-title">NAUTILUS</div>
        <v-icon icon="cc:logo" size="260" class="mt-n10 ml-1" />
      </v-col>
    </v-row>
    <v-alert color="orange" variant="outlined" border max-width="850px" class="mx-auto my-3">
      <div class="text-h6">DOWN FOR MAINTENANCE</div>
      <p>
        The app is currently closed while I prepare the official release. Thank you for your
        patience!
      </p>
    </v-alert>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Login',
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
