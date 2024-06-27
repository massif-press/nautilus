<template>
  <v-app>
    <div style="margin-bottom: 60px">
      <router-view />
    </div>
    <v-footer app class="border-t-sm" style="position: fixed">
      <v-select
        v-model="selectedMap"
        :items="maps"
        item-title="Name"
        item-value="ID"
        label="Map"
        variant="outlined"
        hide-details
        density="compact"
        style="width: 300px"
        @update:modelValue="setMap" />
      <v-btn
        size="small"
        variant="tonal"
        color="accent"
        class="ml-3"
        to="/main/map/#"
        :disabled="!selectedMap">
        OPEN
      </v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/editor/overview">EDITOR</v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/compendium">COMPENDIUM</v-btn>
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/about">ABOUT</v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn
        v-if="isMod"
        size="small"
        variant="elevated"
        color="purple"
        class="mr-8"
        to="/main/mod">
        MOD TOOLS
      </v-btn>
      <v-btn size="small" variant="tonal" color="secondary" to="/">LOG OUT</v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { useDataStore } from '../stores/dataStore';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'main-view',
  data: () => ({
    selectedMap: null as any,
  }),
  mounted() {
    const store = useDataStore();
    if (!store.map) {
      if (!store.maps.length) store.load();
      const preload = localStorage.getItem('cc-n-mapid');
      if (preload) store.setMap(store.maps.find((m) => m.ID === preload));
      else store.setMap(store.maps[0]);
    }
    this.selectedMap = store.map?.ID;
  },
  computed: {
    maps() {
      return useDataStore().maps;
    },
    isMod() {
      return useUserStore().is_mod;
    },
  },
  methods: {
    setMap(map: string) {
      localStorage.setItem('cc-n-mapid', map);
      useDataStore().setMap(this.maps.find((m) => m.ID === map));
    },
  },
};
</script>
