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
            <v-tab>Personnel</v-tab>
            <v-tab>Hull</v-tab>
            <v-tab>Cargo</v-tab>
            <v-tab>Tags</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-data-table :headers="headers" :items="<any[]>items" :items-per-page="-1" class="rounded-0">
        <template #item.Name="{ item }">
          <v-btn
            color="secondary"
            size="small"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`">
            {{ item.Title || item.Name }}
          </v-btn>
        </template>
        <template #item.Tags="{ item }">
          <v-menu open-on-hover width="600px">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="small"
                :icon="!item.Tags || item.Tags.length === 0 ? 'mdi-tag' : 'mdi-tag-outline'"
                :disabled="!item.Tags || item.Tags.length === 0" />
            </template>
            <v-card>
              <v-toolbar height="50px" color="primary">
                <v-toolbar-title>Item Tags</v-toolbar-title>
              </v-toolbar>
              <v-card-text v-if="!item.Tags || item.Tags.length === 0">
                <i class="text-disabled">No tags</i>
              </v-card-text>
              <v-list border>
                <v-list-item
                  v-for="tag in item.Tags"
                  :title="tag.Name"
                  prepend-icon="mdi-tag"
                  :subtitle="tag.Description" />
              </v-list>
            </v-card>
          </v-menu>
        </template>
        <template #item.Status="{ item }">
          <v-chip :color="statusColor(item)" size="x-small">
            {{ item.Status }}
          </v-chip>
        </template>
        <template #item.Assignment="{ item }">
          <span v-if="!item.Assignment">
            <i class="text-caption text-disabled">Unassigned</i>
          </span>
          <v-btn v-else size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
            {{ item.Assignment.Title || item.Assignment.Name }}
          </v-btn>
        </template>
        <template #item.AppliesTo="{ item }">
          <v-chip
            v-for="a in item.AppliesTo"
            label
            size="small"
            :text="a.toUpperCase()"
            class="mx-1" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useCompendiumStore } from '../../stores/compendiumStore';
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
      { title: 'Vessel', value: 'Name' },
      { title: 'Faction', value: 'Faction' },
      { title: 'Owner', value: 'Owner' },
      { title: 'Class', value: 'Hull.Class' },
      { title: 'Hull', value: 'Hull.Name' },
      { title: 'Tags', value: 'Tags' },
      { title: 'Status', value: 'Status' },
    ],
    poiHeaders: [
      { title: 'Item', value: 'Name' },
      { title: 'Faction', value: 'Faction' },
      { title: 'Owner', value: 'Owner' },
      { title: 'Type', value: 'PoiType' },
      { title: 'Tags', value: 'Tags' },
      { title: 'Status', value: 'Status' },
    ],
    crewHeaders: [
      { title: 'Name', value: 'Name' },
      { title: 'Role', key: 'Role' },
      { title: 'Pronouns', key: 'Pronouns' },
      { title: 'Background', key: 'Background' },
      { title: 'Assignment', key: 'Assignment' },
      { title: 'Status', value: 'Status' },
    ],
    hullHeaders: [
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size.name' },
      { title: 'Shipwright', key: 'Shipwright' },
      { title: 'Tags', key: 'Tags' },
      { title: 'Status', value: 'Status' },
    ],
    cargoHeaders: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'CargoType' },
      { title: 'Status', value: 'Status' },
    ],
    tagHeaders: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'AppliesTo' },
      { title: 'Status', value: 'Status' },
    ],
  }),
  computed: {
    items() {
      let c = this.ships;
      if (this.tab === 1) c = this.pois;
      if (this.tab === 2) c = this.crew;
      if (this.tab === 3) c = this.hulls;
      if (this.tab === 4) c = this.cargo;
      if (this.tab === 5) c = this.tags;

      if (!this.search) return c;

      return this.search
        ? c.filter((i) => i.Name.toLowerCase().includes(this.search.toLowerCase()))
        : c;
    },
    user() {
      return useUserStore();
    },
    headers() {
      let c = this.shipHeaders;
      if (this.tab === 1) c = this.poiHeaders;
      if (this.tab === 2) c = this.crewHeaders;
      if (this.tab === 3) c = this.hullHeaders;
      if (this.tab === 4) c = this.cargoHeaders;
      if (this.tab === 5) c = this.tagHeaders;

      return c;
    },
    ships() {
      return useMapStore().ships;
    },
    pois() {
      return useMapStore().pois;
    },
    crew() {
      return useMapStore().crew;
    },
    hulls() {
      return useCompendiumStore().hulls;
    },
    cargo() {
      return useCompendiumStore().cargo;
    },
    tags() {
      return useCompendiumStore().tags;
    },
  },
  methods: {
    copyID() {
      navigator.clipboard.writeText(this.user.user_id);
    },
    statusColor(item: any) {
      if (item.Status === 'Submitted') return 'accent';
      if (item.Status === 'Approved') return 'success';
      if (item.Status === 'Rejected') return 'error';
      if (item.Status === 'Changes Requested') return 'warning';
      return 'grey';
    },
  },
};
</script>
