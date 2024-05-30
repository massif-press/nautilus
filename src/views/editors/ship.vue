<template>
  <v-container>
    <div class="text-center">
      <div class="text-h3">{{ ship.Title }}</div>
      <div class="text-caption mb-n2">
        Review Status:
        <b class="text-success">{{ ship.Status }}</b>
      </div>
    </div>
    <v-divider class="my-4" />
    <v-row justify="center">
      <v-col xl="8" cols="12">
        <v-card border variant="tonal" class="pa-1 mb-4">
          <v-row>
            <v-col cols="6">
              <v-select density="compact" hide-details v-model="ship.Location.map" label="Map" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                hide-details
                v-model="ship.Location.coords[0]"
                label="Y Position"
                type="number" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                hide-details
                v-model="ship.Location.coords[1]"
                label="X Position"
                type="number" />
            </v-col>
          </v-row>
        </v-card>

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

        <div class="text-caption text-disabled mt-4">Vessel Particulars</div>
        <div class="mx-2">
          <div v-for="item in ship.Details" class="mt-4 border">
            <v-row dense>
              <v-col>
                <v-text-field
                  placeholder="Title (Optional)"
                  hide-details
                  density="compact"
                  v-model="item.title" />
              </v-col>
              <v-col cols="auto" class="text-right" align-self="center">
                <v-btn
                  variant="tonal"
                  size="x-small"
                  color="error"
                  class="py-5 ml-n2 rounded-0"
                  @click="ship.Details.splice(ship.Details.indexOf(item), 1)">
                  <v-icon size="x-large" class="mt-n2" icon="mdi-delete" />
                </v-btn>
              </v-col>
            </v-row>
            <v-textarea hide-details density="compact" auto-grow v-model="item.body" />
          </div>
          <div class="text-right">
            <v-menu offset-y>
              <template #activator="{ props }">
                <v-btn color="accent" variant="tonal" size="small" v-bind="props">Add Detail</v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="suggestion in detailSuggestions"
                  :title="suggestion.title"
                  @click="ship.Details.push(suggestion)" />
                <v-list-item title="Other" @click="ship.Details.push({ title: '', body: '' })" />
              </v-list>
            </v-menu>
          </div>
        </div>

        <div class="text-caption text-disabled">Crew</div>
        <!-- <div class="mx-2">crew editor</div> -->

        <br />

        <div class="text-caption text-disabled">Additional Tags</div>
        <!-- <div class="mx-2">tag selector</div> -->
      </v-col>
    </v-row>
    <v-footer app>
      <v-spacer />
      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="error"
            size="small"
            class="mx-4"
            @click="deleteShip">
            Submit Deletion
          </v-btn>
        </template>
        <span class="text-black">Flag this item for deletion</span>
      </v-tooltip>
      <v-tooltip location="top" open-delay="300" max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="success" size="small" @click="deleteShip">
            Submit Changes
          </v-btn>
        </template>
        <span class="text-black">
          Submit changes to the server. These changes will be reflected immediately and will flag
          this item as requiring review.
        </span>
      </v-tooltip>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { Ship } from '../../models/ships/ship';
import { useMapStore } from '../../mapStore';

import HullSelector from './components/hullselector.vue';

export default {
  name: 'Ship Editor',
  components: {
    HullSelector,
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
};
</script>
