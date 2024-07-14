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
  </map-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
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
