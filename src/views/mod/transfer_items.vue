<template>
  <v-text-field v-model="search" label="Search" />
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="50"
    :items-per-page-options="perPage"
    :search="search">
    <template #item.Name="{ item }">
      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-btn color="secondary" size="small" v-bind="props">
            {{ (item as any).Title || (item as any).Name }}
          </v-btn>
        </template>
        <v-card width="60vw" border>
          <v-toolbar density="compact" color="primary">
            <v-toolbar-title>{{ (item as any).Title || (item as any).Name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div v-for="key in Object.keys(item)" :key="key">
              <v-row>
                <v-col cols="3">
                  <b>{{ key }}</b>
                </v-col>
                <v-col v-if="key === 'Size'">
                  {{ item[key].name }}
                </v-col>
                <v-col v-else-if="key === 'Icon'">
                  <v-icon :icon="item[key].icon" :color="item[key].color" />
                  size {{ item[key].size }} / lod={{ item[key].show }}
                </v-col>
                <v-col v-else-if="key === 'Location'">
                  {{ item[key].map }} :: {{ item[key].coords }}
                </v-col>
                <v-col v-else-if="key === 'Hull'">
                  {{ item[key].Name }}
                </v-col>
                <v-col v-else>
                  {{ item[key] }}
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <template #item.Author="{ item }">
      {{ item.Author.Name }}
      <v-chip
        v-if="item.Author.Discord"
        color="purple"
        prepend-icon="cc:discord"
        size="small"
        variant="elevated">
        {{ item.Author.Discord }}
      </v-chip>
    </template>
    <template #item.sel="{ item }">
      <v-select
        v-model="item.Author"
        :items="authors"
        item-title="Name"
        return-object
        density="compact"
        hide-details />
    </template>
    <template #item.btn="{ item }">
      <v-btn size="small" variant="tonal" color="accent" @click="transfer(item)">Transfer</v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'TransferItems',
  data: () => ({
    search: '',
    headers: [
      { title: 'Item', value: 'Name', sortable: true },
      { title: 'Type', value: 'ItemType', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
      { title: 'Current Author', value: 'Author', sortable: true },
      { title: 'Transfer to', value: 'sel' },
      { title: '', value: 'btn' },
    ],
    perPage: [
      { value: 50, title: '50' },
      { value: 100, title: '100' },
      { value: 200, title: '200' },
      { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
    ],
  }),
  computed: {
    items() {
      return useDataStore().items;
      // .filter((x) => x.Status !== 'Unpublished');
    },
    authors() {
      return useDataStore().authors;
    },
  },
  methods: {
    transfer(item) {
      console.log('Transfer', item);
      console.log('nyi');
    },
  },
};
</script>
