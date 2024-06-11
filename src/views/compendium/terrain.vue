<template>
  <v-container>
    <v-card border flat variant="text" class="pa-2">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="ma-1"
            item-text="name"
            density="compact"
            variant="outlined"
            rounded
            hide-details
            clearable />
        </v-col>
        <v-spacer />
        <v-spacer />
        <v-col cols="auto">
          <div class="text-caption text-disabled text-right">
            <i>Showing {{ filteredTerrain.length }} of {{ terrain.length }} terrain items</i>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-card-text>
      <v-data-table
        v-model:expanded="expanded"
        :search="search"
        :headers="headers"
        :items="terrain"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.Name"
            :to="`/main/editor/edit/terrain/${item.ID}`" />
        </template>
        <template #item.Location="{ item }">
          <v-btn size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
            {{ getMap(item.Location.map).Name }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>
<script lang="ts">
import _ from 'lodash';
import { useMapStore } from '../../stores/mapStore';
import { Terrain } from '../../models/maps/terrain';

export default {
  name: 'Terrain',
  data: () => ({
    search: '',
    expanded: [],
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'TerrainType' },
      { title: 'Location', key: 'Location' },
    ],
  }),
  computed: {
    terrain(): Terrain[] {
      return useMapStore().terrain;
    },
    filteredTerrain(): Terrain[] {
      if (!this.search) return this.terrain;
      return _.filter(this.terrain, (x) => {
        return _.includes(x.Name.toLowerCase(), this.search.toLowerCase());
      });
    },
  },
  methods: {
    getMap(mapId: string) {
      return useMapStore().maps.find((x) => x.ID === mapId);
    },
  },
};
</script>
