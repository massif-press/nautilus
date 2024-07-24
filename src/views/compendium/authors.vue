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
      </v-row>
    </v-card>
    <v-card-text>
      <v-data-table
        v-model:expanded="expanded"
        :search="search"
        :headers="headers"
        :items="authors"
        item-value="ID"
        :items-per-page="-1"
        show-expand>
        <template #item.map="{ item }">{{ item.MapItems.length }}</template>
        <template #item.compendium="{ item }">{{ item.CompendiumItems.length }}</template>
        <template #item.LastUpdate="{ item }">{{ item.LastUpdate.toLocaleString() }}</template>
        <template #item.Discord="{ item }"><discord-chip :author="item" /></template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="px-0">
              <v-card variant="tonal">
                <v-tabs v-model="tab" density="compact" class="bg-primary">
                  <v-tab size="small">Map Items</v-tab>
                  <v-tab size="small">Compendium Items</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                  <v-window-item v-for="t in subTables">
                    <v-data-table
                      :items="item[t]"
                      :headers="subHeaders[t]"
                      hide-default-footer
                      density="compact"
                      :items-per-page="-1">
                      <template #item.Name="{ item }">
                        <v-btn
                          size="small"
                          color="secondary"
                          :text="item.TruncatedName"
                          :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
                      </template>
                      <template #item.ItemType="{ item }">
                        <v-chip size="small" class="text-uppercase" :text="item.ItemType" />
                      </template>
                      <template #item.Location="{ item }">
                        <v-btn
                          size="small"
                          color="accent"
                          variant="tonal"
                          :to="`/main/map/${item.ID}`">
                          {{ getMap(item.Location.map) }}
                        </v-btn>
                      </template>
                      <template #item.CreatedAt="{ item }">
                        {{ item.CreatedAt.toLocaleString() }}
                      </template>
                      <template #item.UpdatedAt="{ item }">
                        {{ item.UpdatedAt.toLocaleString() }}
                      </template>

                      <template #bottom></template>
                    </v-data-table>
                  </v-window-item>
                </v-window>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
import DiscordChip from '../../_components/discordChip.vue';

export default {
  name: 'Authors',
  components: {
    DiscordChip,
  },
  props: {
    preSearch: { type: String, default: '' },
  },
  data: () => ({
    tab: 0,
    subTables: ['MapItems', 'CompendiumItems'],
    search: '',
    expanded: [],
    headers: [
      { title: 'Name', value: 'Name' },
      { title: 'Discord', value: 'Discord' },
      { title: 'Map Items', key: 'map' },
      { title: 'Compendium Items', key: 'compendium' },
      { title: 'Last Update', value: 'LastUpdate' },
    ],
    subHeaders: {
      MapItems: [
        { title: 'Name', key: 'Name', width: '1px' },
        { title: 'Type', key: 'ItemType' },
        { title: 'Status', key: 'Status' },
        { title: 'Location', key: 'Location' },
        { title: 'Created', key: 'CreatedAt' },
        { title: 'Last Update', key: 'UpdatedAt' },
      ],
      CompendiumItems: [
        { title: 'Name', key: 'Name' },
        { title: 'Type', key: 'ItemType' },
        { title: 'Status', key: 'Status' },
        { title: 'Created', key: 'CreatedAt' },
        { title: 'Last Update', key: 'UpdatedAt' },
      ],
    },
  }),
  mounted() {
    if (this.preSearch) this.search = this.preSearch;
  },
  computed: {
    filteredAuthors() {
      return _.filter(this.authors, (author) => {
        return author.Name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    authors() {
      return useDataStore().authors.filter((x) => {
        return x.MapItems.length > 0 || x.CompendiumItems.length > 0;
      });
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
