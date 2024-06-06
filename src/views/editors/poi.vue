<template>
  <editor-base :item="poi">
    <v-row>
      <v-col>
        <v-select density="compact" hide-details v-model="poi.Faction" label="Faction" />
      </v-col>
      <v-col>
        <v-text-field density="compact" hide-details v-model="poi.Owner" label="Owner" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field hide-details v-model="poi.Name" label="Name" />
      </v-col>
      <v-col>
        <v-combobox hide-details v-model="poi.PoiType" :items="poiTypes" label="Type" />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import _ from 'lodash';
import { Poi } from '../../models/poi';
import { useMapStore } from '../../stores/mapStore';
import EditorBase from './components/editorBase.vue';

export default {
  name: 'PoiEditor',
  components: {
    EditorBase,
  },
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    poi: {},
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.poi = new Poi();
        } else {
          this.poi = useMapStore().getPoiById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      console.log('creating new poi');
      this.poi = new Poi();

      if (this.lat && this.lon) {
        this.poi.Location.coords = [Number(this.lat), Number(this.lon)];
      }
    } else {
      console.log('loading poi');
      console.log(useMapStore().getPoiById(this.id));
      this.poi = useMapStore().getPoiById(this.id);
    }
  },
  computed: {
    poiTypes() {
      return _.uniq(useMapStore().pois.map((poi) => poi.PoiType));
    },
  },
};
</script>
