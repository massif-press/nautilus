<template>
  <v-navigation-drawer permanent rail>
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, i) in railItems"
        :active="railValue === i && drawer"
        color="accent"
        :prepend-icon="item.icon"
        @click="setRail(i)" />
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer v-model="drawer">
    <v-window v-model="railValue">
      <v-window-item transition="fade">
        <v-list-item>
          {{ map.Name }}
          <template #append>
            <v-btn size="x-small" icon color="accent" variant="plain" @click="drawer = !drawer">
              <v-icon size="large" icon="mdi-chevron-double-left" />
            </v-btn>
          </template>
          <v-list-item-subtitle v-text="map.Subtitle" />
        </v-list-item>
        <v-divider />
        <div class="text-center">
          <v-chip size="small" color="#991E2A" class="ma-2" variant="elevated">
            <b>{{ map.Control }}</b>
            <span class="text-disabled pl-1">Controlled Space</span>
          </v-chip>
        </div>
        <div class="px-2">
          <div class="text-caption">
            <b class="text-accent">{{ ships.length }}</b>
            REGISTERED VESSELS
          </div>
          <div class="text-caption">
            <b class="text-accent">{{ pois.length }}</b>
            REGISTERED LOCATIONS
          </div>
          <!-- <div class="text-caption">
            <b class="text-accent">{{ poi.length }}</b>
            TRACKED PERSONNEL
          </div> -->
          <v-divider class="my-2" />
          <div class="text-caption text-disabled">INFORMATION</div>

          <p class="text-caption" v-html="map.Description" />
        </div>
      </v-window-item>
      <v-window-item transition="fade">
        <div v-if="!selected">
          <div class="text-caption text-disabled">SYSTEM</div>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="ma-1"
            item-text="name"
            density="compact"
            variant="outlined"
            hide-details
            clearable />
          <v-list dense>
            <v-list-item v-for="t in map.Terrain" :title="t.Name" @click="select(t)" />
          </v-list>
        </div>
        <div v-else>
          <viewer :item="selected" :map="map" @deselect="deselect()" @select="select($event)" />
        </div>
      </v-window-item>
      <rail-list
        :items="pois"
        :map="map"
        :selected="selected"
        @setSelected="select($event)"
        @clearSelection="deselect">
        <template #title>Points of Interest</template>
      </rail-list>
      <rail-list
        :items="ships"
        :map="map"
        :selected="selected"
        @setSelected="select($event)"
        @clearSelection="deselect">
        <template #title>Vessels</template>
      </rail-list>
      <v-window-item transition="fade">
        <div class="text-caption text-disabled">PERSONNEL</div>
        <v-divider />
        <v-card variant="tonal" class="ma-3 pa-6" style="position: relative">
          <v-icon icon="cc:logo" size="100%" style="opacity: 0.1" />
          <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0">
            <div class="text-center mt-8">
              <v-icon size="100" icon="mdi-lock" />
              <div><b>RESTRICTED</b></div>
            </div>
          </div>
        </v-card>
      </v-window-item>
    </v-window>
  </v-navigation-drawer>

  <v-main>
    <map-renderer ref="renderer" @select="openFromMap($event)" />
  </v-main>
</template>

<script lang="ts">
import { useMapStore } from '../stores/mapStore';
import MapRenderer from './map/renderer.vue';
import Viewer from './map/viewer.vue';
import RailList from './map/viewers/railList.vue';

export default {
  name: 'Map',
  components: {
    MapRenderer,
    Viewer,
    RailList,
  },
  data: () => ({
    search: '',
    drawer: true,
    railValue: 0,
    railItems: [
      { icon: 'mdi-information-slab-box-outline' },
      { icon: 'mdi-earth' },
      { icon: 'mdi-space-station' },
      { icon: 'mdi-delta' },
      { icon: 'mdi-account' },
    ],
    selected: null,
  }),
  computed: {
    map() {
      return useMapStore().map;
    },
    ships() {
      const s = useMapStore().ships.filter((s) => s.Location.map === this.map.ID);
      if (this.search) {
        return s.filter((s) => s.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return s;
    },
    pois() {
      const p = useMapStore().pois.filter((p) => p.Location.map === this.map.ID);
      if (this.search) {
        return p.filter((p) => p.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return p;
    },
    crew() {
      return useMapStore().crew.filter((c) => c.location.map === this.map.ID);
    },
  },
  methods: {
    setRail(i) {
      if (this.railValue === i) {
        this.drawer = !this.drawer;
      } else {
        this.drawer = true;
      }
      this.railValue = i;
      this.deselect();
    },
    select(item) {
      this.selected = item;
      this.$refs.renderer.setSelected(item);
    },
    deselect() {
      this.selected = null;
      this.$refs.renderer.clearSelection();
    },
    openFromMap(item) {
      if (this.selected && item.ID === this.selected.ID) {
        this.drawer = !this.drawer;
        this.selected = null;
        this.$refs.renderer.clearSelection();
        return;
      }
      this.selected = item;
      this.drawer = true;
      if (item.ItemType === 'ship') {
        this.railValue = 3;
      } else if (item.ItemType === 'poi') {
        this.railValue = 2;
      }
    },
  },
};
</script>
