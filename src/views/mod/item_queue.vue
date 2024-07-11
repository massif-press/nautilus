<template>
  <v-btn-toggle v-model="statusType" density="compact" color="primary">
    <v-btn value="pending">Pending Approval</v-btn>
    <v-btn value="changes">Changes Requested</v-btn>
    <v-btn value="rejected">Rejected</v-btn>
  </v-btn-toggle>

  <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="-1">
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
      <discord-chip :author="item.Author" />
    </template>
    <template #item.btn="{ item }">
      <mod-item-buttons :item="item" />
    </template>
    <template #item.note="{ item }">
      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-icon v-bind="props">mdi-comment</v-icon>
        </template>
        <v-card variant="outlined">
          <v-card-text>
            {{ item.ModComment }}
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <template #item.review="{ item }">
      {{ item.Reviewer }} @ {{ item.LastModTouch.toLocaleString() }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import DiscordChip from '../../_components/discordChip.vue';
import { useDataStore } from '../../stores/dataStore';
import ModItemButtons from './modItemButtons.vue';

export default {
  name: 'ItemQueue',
  components: { ModItemButtons, DiscordChip },
  data: () => ({
    search: '',
    statusType: 'pending',
    base_headers: [
      { title: 'Item', value: 'Name', sortable: true },
      { title: 'Type', value: 'ItemType', sortable: true },
      { title: 'Author', value: 'Author', sortable: true },
      { title: '', value: 'btn' },
    ],
  }),
  computed: {
    headers() {
      let h = [...this.base_headers];
      if (this.statusType !== 'pending') {
        h.push({ title: 'Note', value: 'note', sortable: true });
        h.push({ title: 'Review', value: 'review', sortable: true });
      }
      return h;
    },
    items() {
      switch (this.statusType) {
        case 'pending':
          return useDataStore().items.filter((x) => x.Status === 'Submitted');
        case 'changes':
          return useDataStore().items.filter((x) => x.Status === 'Changes Requested');
        case 'rejected':
          return useDataStore().items.filter((x) => x.Status === 'Rejected');
      }
    },
  },
};
</script>
