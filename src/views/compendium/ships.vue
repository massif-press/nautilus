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
        :items="ships"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.Title"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Hull="{ item }">
          <span v-if="!item.Hull || !item.Hull.Name">-</span>
          <v-btn
            v-else
            size="small"
            variant="tonal"
            :text="item.Hull.Name"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Location="{ item }">
          <v-btn size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
            {{ getMap(item.Location.map) }}
          </v-btn>
        </template>
        <template #item.UpdatedAt="{ item }">
          {{ item.UpdatedAt.toLocaleString() }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'Ships',
  data: () => ({
    tab: 0,
    search: '',
    expanded: [],
    headers: [
      { title: 'Name', key: 'Name', width: '1px' },
      { title: 'Hull', key: 'Hull' },
      { title: 'Class', key: 'Hull.Class' },
      { title: 'Location', key: 'Location' },
      { title: 'Owner', key: 'Owner' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  computed: {
    ships() {
      return useDataStore().ships.filter((x) => x.isPublicVisible);
    },
    filteredShips() {
      if (!this.search) return this.ships;
      return _.filter(this.ships, (ship) => {
        return _.includes(ship.Name.toLowerCase(), this.search.toLowerCase());
      });
    },
    authors() {
      return _.uniqBy(this.ships, 'Author.Name').map((ship) => ship.Author.Name);
    },
  },
  methods: {
    getMap(id: string) {
      const map = useDataStore().maps.find((x) => x.ID === id);
      return map ? map.Name : 'Unknown';
    },
  },
};
</script>
