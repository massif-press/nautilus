<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" />
    <v-divider />

    <v-list density="compact">
      <div class="text-caption text-disabled pl-1">Database Items</div>
      <v-list-item title="Hulls" to="/main/compendium/hulls" />
      <v-list-item title="Cargo" to="/main/compendium/cargo" />
      <v-list-item title="Submaps" to="/main/compendium/submaps" />
      <v-list-item title="Tags" to="/main/compendium/tags" />
      <v-divider />
      <div class="text-caption text-disabled pl-1">Map Items</div>
      <v-list-item title="Terrain" to="/main/compendium/terrain" />
      <v-list-item title="Ships" to="/main/compendium/ships" />
      <v-list-item title="POI" to="/main/compendium/poi" />
      <v-list-item title="Crew" to="/main/compendium/crew" />
      <v-divider />
      <div class="text-caption text-disabled pl-1">Other</div>
      <v-list-item title="Authors" to="/main/compendium/authors" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
export default {
  name: 'Compendium',
};
</script>
