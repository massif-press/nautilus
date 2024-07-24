<template>
  <div style="height: 750px">
    <l-map
      ref="lmap"
      v-model:zoom="zoom"
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

      <template v-for="label in labels">
        <l-marker :lat-lng="[label.Offset[0], label.Offset[1]]" :visible="zoom >= label.Show">
          <l-icon :icon-size="[100 + Number(label.Size * 2), 10]">
            <div
              class="text-center font-italic"
              :style="`color: ${label.Color}; font-size: ${label.Size}px`">
              {{ label.Name }}
            </div>
          </l-icon>
        </l-marker>
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
                  @click="$emit('add-terrain', { lat, lng })">
                  Add Terrain Item
                </v-btn>
                <v-btn
                  block
                  size="small"
                  variant="tonal"
                  color="accent"
                  class="mt-1"
                  @click="$emit('add-label', { lat, lng })">
                  Add Label
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
  props: {
    map: { type: Object, required: true },
  },
  emits: ['add-terrain', 'add-label'],
  data: () => ({
    zoom: 3,
    iconSize: [15, 15],
    loc: '',
    lat: 0,
    lng: 0,
    pickMode: false,
  }),
  computed: {
    terrain() {
      return this.map.Terrain;
    },
    labels() {
      return this.map.Labels;
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
