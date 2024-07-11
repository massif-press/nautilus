<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" to="/main/compendium/" />
    <v-divider />

    <v-list density="compact">
      <div class="text-caption text-disabled pl-1">Database Items</div>
      <v-list-item to="/main/compendium/hulls">
        <div>Hulls</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ hulls.length }} Items</div>
      </v-list-item>
      <v-list-item to="/main/compendium/cargo">
        <div>Cargo</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ cargo.length }} Items</div>
      </v-list-item>
      <!-- <v-list-item to="/main/compendium/submaps">
        <div>Submaps</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ submaps.length }} Items</div>
      </v-list-item> -->
      <v-list-item to="/main/compendium/tags">
        <div>Tags</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ tags.length }} Items</div>
      </v-list-item>
      <v-list-item to="/main/compendium/deployables">
        <div>Deployables</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ deployables.length }} Items</div>
      </v-list-item>
      <v-divider />
      <div class="text-caption text-disabled pl-1">Map Items</div>
      <!-- <v-list-item to="/main/compendium/terrain">
        <div>Terrain</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ terrain.length }} Items</div>
      </v-list-item> -->
      <v-list-item to="/main/compendium/ships">
        <div>Ships</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ ships.length }} Items</div>
      </v-list-item>
      <v-list-item to="/main/compendium/poi">
        <div>POI</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ poi.length }} Items</div>
      </v-list-item>
      <v-list-item to="/main/compendium/crew">
        <div>Crew</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ crew.length }} Items</div>
      </v-list-item>
      <v-divider />
      <div class="text-caption text-disabled pl-1">Other</div>
      <v-list-item to="/main/compendium/authors">
        <div>Authors</div>
        <div class="pl-3 mt-n1 text-caption text-disabled">{{ authors.length }} Contributors</div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'Compendium',
  computed: {
    hulls() {
      return useDataStore().hulls.filter((x) => x.isPublicVisible);
    },
    cargo() {
      return useDataStore().cargo.filter((x) => x.isPublicVisible);
    },
    submaps() {
      return useDataStore().submaps.filter((x) => x.isPublicVisible);
    },
    tags() {
      return useDataStore().tags.filter((x) => x.isPublicVisible);
    },
    terrain() {
      return useDataStore().terrain.filter((x) => x.isPublicVisible);
    },
    ships() {
      return useDataStore().ships.filter((x) => x.isPublicVisible);
    },
    poi() {
      return useDataStore().pois.filter((x) => x.isPublicVisible);
    },
    crew() {
      return useDataStore().crew.filter((x) => x.isPublicVisible);
    },
    authors() {
      return useDataStore().authors;
    },
    deployables() {
      return useDataStore().deployables.filter((x) => x.isPublicVisible);
    },
  },
};
</script>
