<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" />
    <v-divider />

    <v-list density="compact">
      <div class="text-caption text-disabled ml-1">Ships</div>
      <v-list-item title="Hulls" to="/main/compendium/hulls" />
      <v-list-item title="Tags" to="/main/compendium/tags/ship" />
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
