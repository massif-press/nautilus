<template>
  <map-item-editor :item="poi">
    <v-row>
      <v-col>
        <v-combobox
          density="compact"
          maxlength="80"
          counter
          v-model="poi.Faction"
          :readonly="!poi.isUserOwned"
          label="Faction" />
      </v-col>
      <v-col>
        <v-text-field
          density="compact"
          maxlength="80"
          counter
          v-model="poi.Owner"
          :readonly="!poi.isUserOwned"
          label="Owner" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          maxlength="80"
          counter
          v-model="poi.Name"
          :readonly="!poi.isUserOwned"
          label="Name" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="poi.PoiType"
          :readonly="!poi.isUserOwned"
          :items="poiTypes"
          label="Type" />
      </v-col>
    </v-row>

    <template #right>
      <div class="mx-2 mt-6">
        <div class="text-caption text-disabled ml-n2">Crew</div>
        <crew-selector :crewed-item="poi" />
      </div>
    </template>

    <template #bottom>
      <fieldset
        class="pa-1 mt-2"
        style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
        <legend class="text-caption text-disabled ml-2 px-1 mb-n3">Submaps</legend>
        <submap-editor :item="poi" />
      </fieldset>
    </template>
  </map-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
import MapItemEditor from './components/mapItemEditor.vue';
import CrewSelector from './components/crewAssignment.vue';
import { Poi } from '../../models/maps/poi';
import SubmapEditor from './components/submapEditor.vue';

export default {
  name: 'PoiEditor',
  components: {
    MapItemEditor,
    CrewSelector,
    SubmapEditor,
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
          this.poi = useDataStore().getPoiById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.poi = new Poi();

      if (this.lat && this.lon) {
        this.poi.Location.coords = [Number(this.lat), Number(this.lon)];
      }
    } else {
      this.poi = useDataStore().getPoiById(this.id);
    }
  },
  computed: {
    poiTypes() {
      return _.uniq(useDataStore().pois.map((poi) => poi.PoiType));
    },
  },
};
</script>
