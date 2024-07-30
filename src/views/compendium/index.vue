<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" to="/main/compendium/" />
    <v-divider />

    <v-list density="compact">
      <div class="text-caption text-disabled pl-1">Database Items</div>
      <v-list-item to="/main/compendium/hulls">
        <div>Hulls</div>
      </v-list-item>
      <v-list-item to="/main/compendium/cargo">
        <div>Cargo</div>
      </v-list-item>
      <!-- <v-list-item to="/main/compendium/submaps">
        <div>Submaps</div>
        
      </v-list-item> -->
      <v-list-item to="/main/compendium/tags">
        <div>Tags</div>
      </v-list-item>
      <v-list-item to="/main/compendium/deployables">
        <div>Deployables</div>
      </v-list-item>
      <v-divider />
      <div class="text-caption text-disabled pl-1">Map Items</div>
      <!-- <v-list-item to="/main/compendium/terrain">
        <div>Terrain</div>
        
      </v-list-item> -->
      <v-list-item to="/main/compendium/ships">
        <div>Ships</div>
      </v-list-item>
      <v-list-item to="/main/compendium/poi">
        <div>POI</div>
      </v-list-item>
      <v-list-item to="/main/compendium/crew">
        <div>Crew</div>
      </v-list-item>
      <v-divider />
      <div class="text-caption text-disabled pl-1">Other</div>
      <v-list-item to="/main/compendium/authors">
        <div>Authors</div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
export default {
  name: 'Compendium',
  computed: {},
};
</script>
