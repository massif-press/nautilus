<template>
  <map-item-editor :item="ship">
    <v-row>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="ship.Faction"
          :readonly="!ship.isUserOwned"
          :items="affiliations"
          label="Affiliation" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="ship.Owner"
          :readonly="!ship.isUserOwned"
          label="Owner"
          :items="owners" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="ship.HomePort"
          :readonly="!ship.isUserOwned"
          :items="homePorts"
          label="Home Port" />
      </v-col>
    </v-row>

    <v-row density="compact">
      <v-col cols="2">
        <v-text-field
          maxlength="8"
          counter
          v-model="ship.Prefix"
          :readonly="!ship.isUserOwned"
          label="Prefix" />
      </v-col>
      <v-col>
        <v-text-field
          maxlength="80"
          counter
          v-model="ship.Name"
          :readonly="!ship.isUserOwned"
          label="Name" />
      </v-col>
    </v-row>

    <v-card class="px-3 pt-1 pb-2 my-3">
      <v-row>
        <v-col>
          <div class="text-caption text-disabled">Mission</div>
          <v-text-field
            density="compact"
            maxlength="80"
            counter
            :readonly="!ship.isUserOwned"
            v-model="ship.Mission.Mission" />
          <div class="text-caption text-disabled">Mission Status</div>
          <v-text-field
            density="compact"
            maxlength="80"
            counter
            :readonly="!ship.isUserOwned"
            v-model="ship.Mission.Status" />
        </v-col>
        <v-col cols="4">
          <div class="text-caption text-disabled">Destination</div>
          <div class="pb-2">
            <span v-if="ship.Mission.Destination">{{ ship.Mission.Destination.Name }}</span>
            <i v-else class="text-disabled">None</i>
          </div>
          <v-row dense v-if="ship.isUserOwned">
            <v-col>
              <v-dialog width="50vw">
                <template #activator="{ props }">
                  <v-btn block variant="tonal" color="accent" size="x-small" v-bind="props">
                    Set
                  </v-btn>
                </template>
                <template #default="{ isActive }">
                  <v-card>
                    <v-toolbar density="compact" color="primary">
                      <v-toolbar-title>Set Destination &mdash; {{ ship.Title }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <v-autocomplete
                            hide-details
                            v-model="mainDest"
                            :items="mapItems"
                            item-title="Title"
                            return-object
                            label="Destination" />
                        </v-col>
                        <v-col cols="auto">
                          <v-switch v-model="allowShipDest" color="accent" label="Include Ships" />
                        </v-col>
                      </v-row>
                      <v-expand-transition>
                        <v-autocomplete
                          v-if="destSubitems.length"
                          hide-details
                          v-model="subDest"
                          :items="destSubitems"
                          item-title="Name"
                          label="Subitem destination (optional)"
                          return-object
                          clearable />
                      </v-expand-transition>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-btn @click="isActive.value = false">Cancel</v-btn>
                      <v-spacer />
                      <v-btn color="accent" @click="setDestination(isActive)">Set</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-col>
              <v-btn
                block
                variant="tonal"
                color="error"
                size="x-small"
                :disabled="!ship.Mission.Destination"
                @click="clearDest()">
                Clear
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <template #right>
      <div class="mx-2">
        <div class="text-caption text-disabled ml-n2">Hull</div>
        <hull-selector
          :readonly="!ship.isUserOwned"
          :selected="ship.Hull"
          @select="ship.Hull = $event" />
      </div>

      <div class="mx-2 my-1">
        <div class="text-caption text-disabled ml-n2">Crew</div>
        <crew-selector :crewed-item="ship" />
      </div>
    </template>

    <template #mid>
      <div v-if="ship.HasDeployableCapacity" class="my-3">
        <div class="text-caption text-disabled ml-n2">Deployable Units</div>
        <hangar-assignment :parent="ship" />
      </div>
    </template>
  </map-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';

import HullSelector from './components/hullselector.vue';
import CrewSelector from './components/crewAssignment.vue';
import HangarAssignment from './components/hangarAssignment.vue';
import MapItemEditor from './components/mapItemEditor.vue';
import { Ship } from '../../models/maps/ship';
import { MapItem } from '../../models/maps/mapitem';
import { Poi } from '../../models/maps/poi';

export default {
  name: 'ShipEditor',
  components: {
    HullSelector,
    MapItemEditor,
    CrewSelector,
    HangarAssignment,
  },
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    ship: {} as Ship,
    allowShipDest: false,
    mainDest: null as any,
    subDest: null as any,
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
          this.ship = useDataStore().getShipById(this.id);
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
      this.ship = useDataStore().getShipById(this.id);
    }
  },
  computed: {
    homePorts() {
      return _.uniq(
        useDataStore()
          .ships.filter((s) => s.HomePort)
          .map((s) => s.HomePort)
      );
    },
    owners() {
      return _.uniq(
        useDataStore()
          .ships.filter((s) => s.Owner)
          .map((s) => s.Owner)
      );
    },
    affiliations() {
      return _.uniq(
        useDataStore()
          .ships.filter((s) => s.Faction)
          .map((s) => s.Faction)
      );
    },
    mapItems() {
      let out = useDataStore().pois;

      if (!this.ship.IsLander) out = out.filter((i: Poi) => !i.IsDownwell);

      out = this.allowShipDest
        ? out.concat(useDataStore().ships.filter((x) => x.ID !== this.ship.ID))
        : out;

      out = out.filter((i: MapItem) => i.Location.map === this.ship.Location.map);

      return out;
    },
    destSubitems() {
      if (!this.mainDest) return [];

      return this.mainDest.Submaps.flatMap((x) => x.Subitems);
    },
  },
  methods: {
    setDestination(isActive: any) {
      if (this.subDest) {
        this.ship.Mission.Destination = this.subDest;
      } else {
        this.ship.Mission.Destination = this.mainDest;
      }
      this.subDest = null;
      this.mainDest = null;
      isActive.value = false;
    },
    clearDest() {
      this.ship.Mission.Destination = null;
    },
  },
};
</script>
