<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" />
    <v-divider />

    <v-list density="compact">
      <v-list-item title="Ship Hulls" to="/main/compendium/hulls" />
      <v-list-item title="Submaps" to="/main/compendium/submaps" />
      <v-list-item title="Tags" to="/main/compendium/tags" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import Hulls from './compendium/hulls.vue';

export default {
  name: 'Compendium',
  components: { Hulls },
  data: () => ({}),
};
</script>
