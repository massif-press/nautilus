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
      <v-col cols="6">
        <v-select density="compact" hide-details v-model="ship.Faction" label="Faction" />
      </v-col>
      <v-col>
        <v-select
          density="compact"
          hide-details
          v-model="ship.Size"
          :items="shipSizeClasses"
          item-title="name"
          label="Size" />
      </v-col>
      <v-col>
        <v-combobox
          density="compact"
          hide-details
          v-model="ship.Role"
          :items="shipRoles"
          item-title="name"
          label="Role" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-text-field density="compact" hide-details v-model="ship.Prefix" label="Prefix" />
      </v-col>
      <v-col cols="7">
        <v-text-field density="compact" hide-details v-model="ship.Name" label="Name" />
      </v-col>
      <v-col>
        <v-text-field density="compact" hide-details v-model="ship.Owner" label="Owner" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-combobox
          density="compact"
          hide-details
          v-model="ship.Manufacturer"
          label="Manufacturer" />
      </v-col>
      <v-col cols="5">
        <v-combobox density="compact" hide-details v-model="ship.HullType" label="Hull Type" />
      </v-col>
      <v-col>
        <v-combobox density="compact" hide-details v-model="ship.Hull" label="Hull" />
      </v-col>
    </v-row>
    <!-- <v-card>selected hull type info</v-card>
    <v-card>selected hull info</v-card>
    <v-row>
      <v-col>selected tags</v-col>
      <v-col>available tags</v-col>
    </v-row>
    <div>Details</div> -->
  </v-container>
</template>

<script lang="ts">
import { Ship, shipSizeClasses, shipRoles } from '../../models/ship';
import { useMapStore } from '../../mapStore';

export default {
  name: 'Ship Editor',
  props: {
    id: { type: String, required: true },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  data: () => ({
    ship: {},
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
    shipSizeClasses() {
      return shipSizeClasses;
    },
    shipRoles() {
      return shipRoles;
    },
  },
};
</script>
