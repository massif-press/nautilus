<template>
  <v-container>
    <v-footer border>
      <div>
        <span>{{ user.username }}</span>
        <i v-if="user.discord && user.showDiscord" class="text-caption text-accent pl-2">
          {{ user.discord }}
        </i>
        <br />
        <span class="text-caption">
          {{ user.user_id }}
          <v-btn icon size="x-small" variant="plain" class="ma-n1">
            <v-icon icon="mdi-content-copy" @click="copyID" />
          </v-btn>
        </span>
      </div>
      <v-spacer />
      <user-control-panel />
      <!-- <v-btn size="x-small" variant="tonal">request dev access</v-btn> -->
    </v-footer>

    <v-divider class="my-4" />

    <v-card class="mb-4">
      <v-toolbar density="compact" color="primary" extended>
        <v-toolbar-title>User Items</v-toolbar-title>
        <v-spacer />
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
        <template #extension>
          <v-tabs v-model="tab">
            <v-tab>Ships</v-tab>
            <v-tab>Points of Interest</v-tab>
            <v-tab disabled>Personnel</v-tab>
            <v-tab disabled>Cargo</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-data-table :headers="headers" :items="items" :items-per-page="-1">
        <template #item.Title="{ item }">
          <v-btn
            color="secondary"
            size="small"
            :to="`/main/editor/edit/${tab === 0 ? 'ship' : 'poi'}/${item.ID}`">
            {{ item.Title }}
          </v-btn>
        </template>
        <template #item.Tags="{ item }">
          <v-menu open-on-hover width="600px">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="small" icon="mdi-tag-outline" />
            </template>
            <v-card>
              <v-toolbar height="50px" color="primary">
                <v-toolbar-title>Item Tags</v-toolbar-title>
              </v-toolbar>
              <v-card-text v-if="!item.Tags.length">
                <i class="text-disabled">No tags</i>
              </v-card-text>
              <v-list>
                <v-list-item v-for="tag in item.Tags" :key="tag">
                  <v-list-item-title>{{ tag }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
        <template #item.Status="{ item }">
          <v-chip :color="item.Status === 'Approved' ? 'success' : 'error'" size="x-small">
            {{ item.Status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useMapStore } from '../../stores/mapStore';
import { useUserStore } from '../../stores/userStore';
import UserControlPanel from './components/userControlPanel.vue';

export default {
  name: 'Overview',
  components: { UserControlPanel },
  data: () => ({
    tab: 0,
    search: '',
    shipHeaders: [
      { title: 'Vessel', value: 'Title', sortable: true },
      { title: 'Faction', value: 'Faction', sortable: true },
      { title: 'Owner', value: 'Owner', sortable: true },
      { title: 'Class', value: 'Hull.Class', sortable: true },
      { title: 'Hull', value: 'Hull.Name', sortable: true },
      { title: 'Tags', value: 'Tags', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    poiHeaders: [
      { title: 'Item', value: 'Title', sortable: true },
      { title: 'Faction', value: 'Faction', sortable: true },
      { title: 'Owner', value: 'Owner', sortable: true },
      { title: 'Type', value: 'PoiType', sortable: true },
      { title: 'Tags', value: 'Tags', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
  }),
  computed: {
    items() {
      let c = this.ships;
      if (this.tab === 1) c = this.pois;

      return this.search
        ? c.filter((i) => i.Title.toLowerCase().includes(this.search.toLowerCase()))
        : c;
    },
    user() {
      return useUserStore();
    },
    headers() {
      let c = this.shipHeaders;
      if (this.tab === 1) c = this.poiHeaders;

      return c;
    },
    ships() {
      return useMapStore().ships;
    },
    pois() {
      return useMapStore().pois;
    },
  },
  methods: {
    copyID() {
      navigator.clipboard.writeText(this.user.user_id);
    },
  },
};
</script>
