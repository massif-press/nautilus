<template>
  <div style="height: 600px">
    <l-map
      ref="smap"
      v-model:zoom="zoom"
      :center="[0, 0]"
      :maxBounds="[
        [200, 200],
        [-200, -200],
      ]"
      :use-global-leaflet="false"
      :options="{
        attributionControl: false,
        zoomControl: false,
        minZoom: 1,
        maxZoom: 8,
        preferCanvas: true,
        trackResize: true,
      }"
      style="background-color: black"
      @click="setClickLocation($event)">
      <l-marker v-if="pickMode && lat && lng" :lat-lng="[lat, lng]">
        <l-icon :icon-size="iconSize">
          <v-icon :size="iconSize[0]" color="yellow" icon="mdi-crosshairs" />
        </l-icon>
      </l-marker>

      <template>
        <l-image-overlay :url="getImgPath(submap.Img)" :crossOrigin="true" :bounds="rBounds" />

        <template v-for="subitem in submap.Subitems">
          <l-marker :ref="subitem.ID" :lat-lng="subitem.Offset" @click="select(subitem)">
            <l-icon>
              <v-icon
                :style="`${
                  subitem.Location.heading
                    ? `transform: rotate(${subitem.Location.heading}rad)`
                    : ''
                }`"
                class="mt-n1"
                :size="getIconSize(subitem)[0] + (selected && subitem.ID === selected.ID ? 6 : 0)"
                :color="selected && subitem.ID === selected.ID ? 'accent' : subitem.Icon.color"
                :icon="subitem.Icon.icon" />
            </l-icon>
            <l-tooltip :options="{ sticky: true, direction: 'bottom', offset: [0, 30] }">
              {{ subitem.Name }}
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
                  class="mt-1"
                  prepend-icon="mdi-plus"
                  @click="addSubitem">
                  Add Subitem
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
import { Subitem, SubitemData } from '../../../models/maps/submap';
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
  name: 'SubmapRenderer',
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
    baseSize: 18,
    selected: null,
    loc: ``,
    lat: 0,
    lng: 0,
    pickMode: false,
  }),
  props: {
    submap: Object,
  },
  computed: {
    iconSize() {
      return [this.baseSize, this.baseSize];
    },
    rBounds() {
      return [
        [50, 50],
        [-50, -50],
      ];
    },
  },
  methods: {
    getImgPath(img) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    getIconSize(item) {
      let base = this.baseSize;

      return [base, base];
    },
    setSelected(item) {
      this.selected = item;
      this.loc = `${item.Location.coords[0]}, ${item.Location.coords[1]}`;

      this.$refs.smap.leafletObject.flyTo(item.Location.coords, 8, {
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
    rerender() {
      this.$refs.smap.leafletObject.invalidateSize();
      this.submap.Subitems.forEach((x) => {
        this.$refs[x.ID][0].leafletObject.setLatLng(x.Offset);
      });
    },
    addSubitem() {
      if (!this.submap.Subitems) this.submap.Subitems = [];
      this.submap.Subitems.push(
        new Subitem(this.submap, {
          id: `${this.submap.Name}_item_${this.submap.Subitems.length + 1}`,
          name: 'New Subitem',
          offset: [this.lat, this.lng],
        } as SubitemData)
      );
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
