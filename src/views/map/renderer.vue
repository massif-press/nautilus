<template>
  <div style="position: absolute; top: 0; left: 56px; right: 0; bottom: 56px; z-index: 0">
    <l-map
      ref="lmap"
      :zoom="zoom"
      :center="[0, 0]"
      :maxBounds="[
        [900, 800],
        [-900, -800],
      ]"
      :use-global-leaflet="false"
      :options="{
        attributionControl: false,
        zoomControl: false,
        minZoom: 1,
        maxZoom: 12,
        preferCanvas: true,
        trackResize: true,
      }"
      style="background-color: rgb(var(--v-background))"
      @click="setClickLocation($event)"
      @moveend="redraw">
      <l-marker v-if="pickMode && lat && lng" :lat-lng="[lat, lng]">
        <l-icon :icon-size="<any>iconSize">
          <v-icon :size="iconSize[0]" color="deep-orange" icon="mdi-crosshairs" />
        </l-icon>
      </l-marker>

      <l-image-overlay
        v-for="t in terrain"
        :url="getImgPath(t.Svg)"
        :crossOrigin="true"
        :bounds="t.Bounds" />

      <template v-for="item in items">
        <template v-for="submap in item.Submaps">
          <l-image-overlay
            v-if="submapVisible(submap)"
            :url="getImgPath(submap.Img)"
            :crossOrigin="true"
            :bounds="submap.Bounds" />
          <template v-for="subitem in submap.Subitems">
            <l-marker
              :visible="subitem.Icon.show && zoom >= subitem.Icon.show"
              :lat-lng="subitem.Location.coords"
              @click="select(subitem)">
              <l-icon>
                <v-icon
                  class="mt-n1"
                  :size="getIconSize(subitem)[0]"
                  :color="selected && subitem.ID === selected.ID ? 'warning' : subitem.Icon.color"
                  :icon="subitem.Icon.icon" />
              </l-icon>
              <l-tooltip :options="{ sticky: true, direction: 'bottom', offset: [0, 30] }">
                {{ subitem.Name }}
              </l-tooltip>
            </l-marker>
          </template>
          <template v-for="label in submap.Labels">
            <l-marker :lat-lng="label.Offset">
              <l-icon :icon-size="[100 + Number(label.Size * 2), 10]">
                <div
                  class="text-center"
                  :style="`color: ${label.Color}; font-size: ${label.Size}px`">
                  {{ label.Name }}
                </div>
              </l-icon>
            </l-marker>
          </template>
        </template>

        <l-marker
          v-if="!itemSubmapsVisible(item)"
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
import { useDataStore } from '../../stores/dataStore';
import { fa } from 'vuetify/locale';

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
    selected: null as any,
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
      return useDataStore().map;
    },
    terrain() {
      return useDataStore().map.Terrain;
    },
    ships() {
      return useDataStore().ships.filter(
        (s) => s.Location.map === this.map.ID && s.isPublicVisible
      );
    },
    pois() {
      return useDataStore().pois.filter((p) => p.Location.map === this.map.ID && p.isPublicVisible);
    },
    crew() {
      return useDataStore().crew.filter((c) => c.location.map === this.map.ID && c.isPublicVisible);
    },
    items() {
      return [...this.ships, ...this.pois].filter((i) => i.isPublicVisible);
    },
  },
  methods: {
    getImgPath(img) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    redraw() {
      this.$refs.lmap.leafletObject.invalidateSize();

      // this.$refs.lmap[0].rerender();
    },
    submapVisible(item) {
      if (item.Show > this.zoom) return;

      const bounds = this.$refs.lmap.leafletObject.getBounds();
      const mapBounds = {
        lowerLeft: { x: bounds._southWest.lng, y: bounds._southWest.lat },
        upperRight: { x: bounds._northEast.lng, y: bounds._northEast.lat },
      };

      return (
        mapBounds.lowerLeft.x <= item.BoundsObject.upperRight.x &&
        mapBounds.upperRight.x >= item.BoundsObject.lowerLeft.x &&
        mapBounds.lowerLeft.y <= item.BoundsObject.upperRight.y &&
        mapBounds.upperRight.y >= item.BoundsObject.lowerLeft.y
      );
    },
    itemSubmapsVisible(item) {
      return item.Submaps.some((s) => s.Show <= this.zoom);
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
        easeLinearity: 0.5,
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
