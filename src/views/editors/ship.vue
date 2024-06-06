<template>
  <editor-base :item="ship">
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
  </editor-base>
</template>

<script lang="ts">
import _ from 'lodash';
import { Ship } from '../../models/ships/ship';
import { useMapStore } from '../../stores/mapStore';

import HullSelector from './components/hullSelector.vue';
import EditorBase from './components/editorBase.vue';

export default {
  name: 'ShipEditor',
  components: {
    HullSelector,
    EditorBase,
  },
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    ship: {},
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
      console.log('creating new ship');
      this.ship = new Ship();

      if (this.lat && this.lon) {
        this.ship.Location.coords = [Number(this.lat), Number(this.lon)];
      }
    } else {
      console.log('loading ship');
      console.log(useMapStore().getShipById(this.id));
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
