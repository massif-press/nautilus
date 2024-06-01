<template>
  <v-container>
    <div class="text-center">
      <div class="text-h3">{{ poi.Title }}</div>
      <div class="text-caption mb-n2">
        Review Status:
        <b class="text-success">{{ poi.Status }}</b>
      </div>
    </div>
    <v-divider class="my-4" />
    <v-card border variant="tonal" class="pa-1 mb-4">
      <v-row>
        <v-col cols="6">
          <v-select density="compact" hide-details v-model="poi.Location.map" label="Map" />
        </v-col>
        <v-col>
          <v-text-field
            density="compact"
            hide-details
            v-model="poi.Location.coords[0]"
            label="Y Position"
            type="number" />
        </v-col>
        <v-col>
          <v-text-field
            density="compact"
            hide-details
            v-model="poi.Location.coords[1]"
            label="X Position"
            type="number" />
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="3">
        <v-select density="compact" hide-details v-model="poi.Faction" label="Faction" />
      </v-col>
      <v-col cols="3">
        <v-text-field density="compact" hide-details v-model="poi.Owner" label="Owner" />
      </v-col>
      <v-col>
        <v-text-field density="compact" hide-details v-model="poi.Name" label="Name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-select density="compact" hide-details v-model="poi.Size" label="Size" />
      </v-col>
      <v-col cols="3">
        <v-select density="compact" hide-details v-model="poi.Role" label="Role" />
      </v-col>
      <v-col>
        <v-combobox density="compact" hide-details v-model="poi.PoiType" label="Type" />
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
import { Poi, poiSizeClasses } from '../../models/poi';
import { useMapStore } from '../../stores/mapStore';

export default {
  name: 'PoiEditor',
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
    poiSizeClasses() {
      return poiSizeClasses;
    },
  },
};
</script>
