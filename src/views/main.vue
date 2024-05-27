<template>
  <v-app>
    <div style="margin-bottom: 60px">
      <router-view />
    </div>
    <v-footer app class="border-t-sm" style="position: fixed">
      <v-select
        v-model="selectedMap"
        :items="maps"
        item-text="name"
        item-value="id"
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
        to="/main/map"
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
      <v-btn size="small" variant="tonal" color="accent" to="/main/compendium" disabled>
        COMPENDIUM
      </v-btn>
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/about" disabled>ABOUT</v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn size="small" variant="tonal" color="secondary" to="/">LOG OUT</v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { useMapStore } from '../mapStore';

export default {
  name: 'main-view',
  data: () => ({
    selectedMap: null,
  }),
  mounted() {
    const store = useMapStore();
    if (!store.map) {
      if (!store.maps.length) store.load();
      store.setMap(store.maps[0]);
    }
    this.selectedMap = store.map?.id;
  },
  computed: {
    maps() {
      return useMapStore().maps;
    },
  },
  methods: {
    setMap(map: string) {
      useMapStore().setMap(this.maps.find((m) => m.id === map));
    },
  },
};
</script>
