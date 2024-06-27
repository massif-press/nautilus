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
      </v-row>
    </v-card>
    <v-card-text>
      <v-data-table
        v-model:expanded="expanded"
        :search="search"
        :headers="headers"
        :items="pois"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.Name"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Location="{ item }">
          <v-btn size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
            {{ item.Location.map }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'POIs',
  data: () => ({
    search: '',
    expanded: [],
    headers: [
      { title: 'Name', key: 'Name', width: '1px' },
      { title: 'Type', key: 'PoiType' },
      { title: 'Location', key: 'Location' },
      { title: 'Owner', key: 'Owner' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  computed: {
    pois() {
      return useDataStore().pois;
    },
    filteredPois() {
      if (!this.search) return this.pois;
      return _.filter(this.pois, (poi) => {
        return _.includes(poi.Name.toLowerCase(), this.search.toLowerCase());
      });
    },
    authors() {
      return _.uniqBy(this.pois, 'Author.Name').map((poi) => poi.Author.Name);
    },
  },
};
</script>
