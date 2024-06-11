<template>
  <map-item-editor :item="ship">
    <v-row>
      <v-col>
        <v-autocomplete
          density="compact"
          hide-details
          v-model="ship.Faction"
          :items="affiliations"
          label="Affiliation" />
      </v-col>
      <v-col>
        <v-autocomplete
          density="compact"
          hide-details
          v-model="ship.Owner"
          label="Owner"
          :items="owners" />
      </v-col>
      <v-col>
        <v-autocomplete
          density="compact"
          hide-details
          v-model="ship.HomePort"
          :items="homePorts"
          label="Home Port" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="2">
        <v-text-field hide-details v-model="ship.Prefix" label="Prefix" />
      </v-col>
      <v-col>
        <v-text-field hide-details v-model="ship.Name" label="Name" />
      </v-col>
    </v-row>

    <div class="mx-2 mt-6">
      <div class="text-caption text-disabled ml-n2">Hull</div>
      <hull-selector :selected="ship.Hull" @select="ship.Hull = $event" />
    </div>

    <div class="mx-2 mt-6">
      <div class="text-caption text-disabled ml-n2">Crew</div>
      <crew-selector :crewed-item="ship" />
    </div>
  </map-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { useMapStore } from '../../stores/mapStore';

import HullSelector from './components/hullSelector.vue';
import CrewSelector from './components/crewAssignment.vue';
import MapItemEditor from './components/mapItemEditor.vue';
import { Ship } from '../../models/maps/ship';

export default {
  name: 'ShipEditor',
  components: {
    HullSelector,
    MapItemEditor,
    CrewSelector,
  },
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    ship: {} as Ship,
    detailSuggestions: [
      { title: 'Description', body: '' },
      { title: 'History', body: '' },
      { title: 'Technical Information', body: '' },
    ],
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.ship = new Ship();
        } else {
          this.ship = useMapStore().getShipById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.ship = new Ship();

      if (this.lat && this.lon) {
        this.ship.Location.coords = [Number(this.lat), Number(this.lon)];
      }
    } else {
      this.ship = useMapStore().getShipById(this.id);
    }
  },
  computed: {
    homePorts() {
      return _.uniq(
        useMapStore()
          .ships.filter((s) => s.HomePort)
          .map((s) => s.HomePort)
      );
    },
    owners() {
      return _.uniq(
        useMapStore()
          .ships.filter((s) => s.Owner)
          .map((s) => s.Owner)
      );
    },
    affiliations() {
      return _.uniq(
        useMapStore()
          .ships.filter((s) => s.Faction)
          .map((s) => s.Faction)
      );
    },
  },
  methods: {
    deleteShip() {
      console.log('nyi');
    },
    submitChanges() {
      console.log('nyi');
    },
  },
};
</script>
