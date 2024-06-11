<template>
  <map-item-editor :item="poi">
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

    <div class="mx-2 mt-6">
      <div class="text-caption text-disabled ml-n2">Crew</div>
      <crew-selector :crewed-item="poi" />
    </div>
  </map-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { useMapStore } from '../../stores/mapStore';
import MapItemEditor from './components/mapItemEditor.vue';
import CrewSelector from './components/crewAssignment.vue';
import { Poi } from '../../models/maps/poi';

export default {
  name: 'PoiEditor',
  components: {
    MapItemEditor,
    CrewSelector,
  },
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    poi: {} as Poi,
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
