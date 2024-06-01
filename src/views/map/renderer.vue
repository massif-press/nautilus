<template>
  <div style="position: absolute; top: 0; left: 56px; right: 0; bottom: 56px; z-index: 0">
    <l-map
      ref="lmap"
      v-model:zoom="zoom"
      :center="[0, 0]"
      :maxBounds="[
        [900, 1000],
        [-900, -1000],
      ]"
      :use-global-leaflet="false"
      :options="{
        attributionControl: false,
        zoomControl: false,
        minZoom: 1,
        maxZoom: 12,
        preferCanvas: true,
      }"
      style="background-color: rgb(var(--v-background))"
      @click="setClickLocation($event)">
      <l-marker v-if="pickMode && lat && lng" :lat-lng="[lat, lng]">
        <l-icon :icon-size="iconSize">
          <v-icon :size="iconSize[0]" color="yellow" icon="mdi-crosshairs" />
        </l-icon>
      </l-marker>

      <l-image-overlay
        v-for="t in terrain"
        :url="getImgPath(t.Submap.Img)"
        :crossOrigin="true"
        :visible="t.Submap.Show <= zoom"
        :bounds="t.Submap.Bounds" />

      <template v-for="item in items">
        <l-image-overlay
          v-if="item.Submap && item.Submap.Show <= zoom"
          :url="getImgPath(item.Submap.Img)"
          :crossOrigin="true"
          :visible="item.Submap.Show <= zoom"
          :bounds="item.Submap.Bounds" />

        <l-marker
          v-else
          :visible="item.Icon.show && zoom >= item.Icon.show"
          :lat-lng="item.Location.coords"
          @click="select(item)">
          <l-icon>
            <v-icon
              :style="`${
                item.Location.heading ? `transform: rotate(${item.Location.heading}rad)` : ''
              }`"
              class="mt-n1"
              :size="getIconSize(item)[0]"
              :color="selected && item.ID === selected.ID ? 'warning' : item.Icon.color"
              :icon="item.Icon.icon" />
            <!-- :icon="item.Icon.icon" /> -->
          </l-icon>
          <l-tooltip :options="{ sticky: true, direction: 'bottom', offset: [0, 30] }">
            {{ item.Title }}
          </l-tooltip>
        </l-marker>

        <l-polyline
          v-if="selected && item.ID === selected.ID && item.Location.line"
          :lat-lngs="item.Location.line"
          color="cyan"
          :opacity="0.1" />

        <template v-for="subitem in item.Subitems">
          <l-marker
            :visible="subitem.Icon.show && zoom >= subitem.Icon.show"
            :lat-lng="subitem.Location.coords"
            @click="select(subitem)">
            <l-icon>
              <v-icon
                :style="`${
                  subitem.Location.heading
                    ? `transform: rotate(${subitem.Location.heading}rad)`
                    : ''
                }`"
                class="mt-n1"
                :size="getIconSize(subitem)[0]"
                :color="selected && subitem.ID === selected.ID ? 'warning' : subitem.Icon.color"
                :icon="subitem.Icon.icon" />
              <!-- :icon="subitem.Icon.icon" /> -->
            </l-icon>
            <l-tooltip :options="{ sticky: true, direction: 'bottom', offset: [0, 30] }">
              {{ subitem.Title }}
            </l-tooltip>
          </l-marker>
        </template>
      </template>

      <l-control position="bottomright">
        <div class="text-caption ma-n1">
          <v-btn
            v-if="!pickMode"
            icon
            size="x-small"
            variant="tonal"
            color="secondary"
            @click.stop="pickMode = true">
            <v-icon size="30" icon="mdi-plus-circle-outline" />
          </v-btn>
          <v-card v-if="pickMode">
            <v-card-text class="text-caption text-center">
              <div v-if="!lat && !lng">Click to set marker</div>
              <div v-else>
                Selected: {{ lat.toFixed(6) }}, {{ lng.toFixed(6) }}
                <br />
                <div class="text-disabled mt-n1">(click to change)</div>
                <v-btn
                  block
                  size="small"
                  variant="tonal"
                  color="accent"
                  prepend-icon="mdi-delta"
                  :to="`/main/editor/edit/ship/new/${lat}/${lng}`">
                  Add Ship Here
                </v-btn>
                <v-btn
                  block
                  size="small"
                  variant="tonal"
                  color="accent"
                  class="mt-1"
                  prepend-icon="mdi-space-station"
                  :to="`/main/editor/edit/poi/new/${lat}/${lng}`">
                  Add POI Here
                </v-btn>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions class="my-n3 px-1">
              <v-btn variant="text" size="small" @click="copyCurrentLocation">
                <v-icon icon="mdi-content-copy" />
              </v-btn>
              <v-spacer />
              <v-btn variant="text" size="small" @click="pickMode = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </l-control>
    </l-map>
  </div>
</template>

<script lang="ts">
import {
  LMap,
  LIcon,
  LMarker,
  LTooltip,
  LCircle,
  LControl,
  LPolyline,
  LImageOverlay,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '../../stores/mapStore';

export default {
  name: 'MapRenderer',
  components: {
    LMap,
    LIcon,
    LMarker,
    LTooltip,
    LCircle,
    LControl,
    LPolyline,
    LImageOverlay,
  },
  data: () => ({
    zoom: 3,
    baseSize: 15,
    selected: null,
    loc: ``,
    lat: 0,
    lng: 0,
    pickMode: false,
  }),
  computed: {
    iconSize() {
      return [this.baseSize, this.baseSize];
    },
    map() {
      return useMapStore().map;
    },
    terrain() {
      return useMapStore().map.Terrain;
    },
    ships() {
      return useMapStore().ships.filter((s) => s.Location.map === this.map.ID);
    },
    pois() {
      return useMapStore().pois.filter((p) => p.Location.map === this.map.ID);
    },
    crew() {
      return useMapStore().crew.filter((c) => c.location.map === this.map.ID);
    },
    items() {
      return [...this.ships, ...this.pois];
    },
  },
  methods: {
    getImgPath(img) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    getIconSize(item) {
      let base = this.baseSize;
      if (item.ItemType === 'ship') {
        if (this.zoom > 4 && this.zoom < 8) base -= Math.floor(this.zoom / 2);
      }
      let total = item.SizeValue + base;
      if (this.zoom === 2) total -= 5;
      if (this.zoom === 1) total -= 8;
      return [total, total];
    },
    setSelected(item) {
      this.selected = item;
      this.loc = `${item.Location.coords[0]}, ${item.Location.coords[1]}`;

      this.$refs.lmap.leafletObject.flyTo(item.Location.coords, 8, {
        animate: true,
        duration: 0.8,
        noMoveStart: true,
      });
    },
    select(item) {
      this.selected = item;
      this.loc = `${item.Location.coords[0]}, ${item.Location.coords[1]}`;
      this.$emit('select', item);
    },
    changeIcon() {
      this.iconWidth += 2;
      if (this.iconWidth > this.iconHeight) {
        this.iconWidth = Math.floor(this.iconHeight / 2);
      }
    },
    clearSelection() {
      this.selected = null;
    },
    setClickLocation(e) {
      if (!this.pickMode) return;
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      this.loc = `${e.latlng.lat}, ${e.latlng.lng}`;
      this.copyCurrentLocation();
    },
    copyCurrentLocation() {
      navigator.clipboard.writeText(this.loc);
    },
  },
};
</script>

<style>
.leaflet-div-icon {
  background: transparent !important;
  border: none !important;
}
</style>
