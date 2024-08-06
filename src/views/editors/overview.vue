<template>
  <v-container>
    <v-footer border>
      <div>
        <span class="pr-2">{{ user.username }}</span>
        <discord-chip
          v-if="user.discord && user.show_discord"
          :author="{ Discord: user.discord }" />
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
    </v-footer>
    <div class="text-right mt-1">
      <v-btn
        to="/main/editor/add-image/0"
        color="accent"
        variant="tonal"
        size="small"
        class="mx-3"
        prepend-icon="mdi-image-plus">
        Add Image
      </v-btn>
      <v-btn
        to="/main/editor/add-image/1"
        color="accent"
        variant="tonal"
        size="small"
        prepend-icon="mdi-svg">
        Add Submap
      </v-btn>
    </div>

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
            <v-tab>
              <v-badge v-if="ships.length" :content="ships.length" color="secondary" inline />
              Ships
            </v-tab>
            <v-tab>
              <v-badge v-if="pois.length" :content="pois.length" color="secondary" inline />
              Points of Interest
            </v-tab>
            <v-tab>
              <v-badge v-if="crew.length" :content="crew.length" color="secondary" inline />
              Crew
            </v-tab>
            <v-tab>
              <v-badge v-if="hulls.length" :content="hulls.length" color="secondary" inline />
              Hulls
            </v-tab>
            <v-tab>
              <v-badge
                v-if="deployables.length"
                :content="deployables.length"
                color="secondary"
                inline />
              Deployables
            </v-tab>
            <v-tab>
              <v-badge v-if="cargo.length" :content="cargo.length" color="secondary" inline />
              Cargo
            </v-tab>
            <v-tab>
              <v-badge v-if="tags.length" :content="tags.length" color="secondary" inline />
              Tags
            </v-tab>
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
                :icon="!item.Tags || item.Tags.length === 0 ? 'mdi-tag-outline' : 'mdi-tag'"
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
        <template #item.Map="{ item }">
          <i v-if="!item.Map" class="text-caption text-disabled">Unknown</i>
          <v-btn
            v-else
            size="small"
            color="accent"
            variant="tonal"
            :to="`/main/map/${item.Location.map}`">
            {{ item.Map.Name }}
          </v-btn>
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
import DiscordChip from '../../_components/discordChip.vue';
import { useDataStore } from '../../stores/dataStore';
import { useUserStore } from '../../stores/userStore';
import UserControlPanel from './components/userControlPanel.vue';

export default {
  name: 'Overview',
  components: { UserControlPanel, DiscordChip },
  data: () => ({
    tab: 0,
    search: '',
    shipHeaders: [
      { title: 'Vessel', value: 'Name' },
      { title: 'Map', key: 'Map', value: 'Location.map', sortable: true },
      { title: 'Faction', value: 'Faction', sortable: true },
      { title: 'Owner', value: 'Owner', sortable: true },
      { title: 'Class', value: 'Hull.Class', sortable: true },
      { title: 'Hull', value: 'Hull.Name', sortable: true },
      { title: 'Tags', value: 'Tags' },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    poiHeaders: [
      { title: 'Item', value: 'Name', sortable: true },
      { title: 'Map', key: 'Map', value: 'Location.map', sortable: true },
      { title: 'Faction', value: 'Faction', sortable: true },
      { title: 'Owner', value: 'Owner', sortable: true },
      { title: 'Type', value: 'PoiType', sortable: true },
      { title: 'Tags', value: 'Tags' },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    crewHeaders: [
      { title: 'Name', value: 'Name', sortable: true },
      { title: 'Role', key: 'Role', sortable: true },
      { title: 'Pronouns', key: 'Pronouns', sortable: true },
      { title: 'Background', key: 'Background', sortable: true },
      { title: 'Assignment', key: 'Assignment', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    hullHeaders: [
      { title: 'Name', key: 'Name', sortable: true },
      { title: 'Size', key: 'Size.name', sortable: true },
      { title: 'Shipwright', key: 'Shipwright', sortable: true },
      { title: 'Tags', key: 'Tags' },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    cargoHeaders: [
      { title: 'Name', key: 'Name', sortable: true },
      { title: 'Type', key: 'CargoType', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    deployableHeaders: [
      { title: 'Name', key: 'Name', sortable: true },
      { title: 'Type', key: 'DeployableType', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
    tagHeaders: [
      { title: 'Name', key: 'Name', sortable: true },
      { title: 'Type', key: 'AppliesTo', sortable: true },
      { title: 'Status', value: 'Status', sortable: true },
    ],
  }),
  computed: {
    items() {
      let c = this.ships;
      if (this.tab === 1) c = this.pois;
      if (this.tab === 2) c = this.crew;
      if (this.tab === 3) c = this.hulls;
      if (this.tab === 4) c = this.deployables;
      if (this.tab === 5) c = this.cargo;
      if (this.tab === 6) c = this.tags;

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
      if (this.tab === 4) c = this.deployableHeaders;
      if (this.tab === 5) c = this.cargoHeaders;
      if (this.tab === 6) c = this.tagHeaders;

      return c;
    },
    ships() {
      return useDataStore().ships.filter((x) => x.isUserOwned);
    },
    pois() {
      return useDataStore().pois.filter((x) => x.isUserOwned);
    },
    crew() {
      return useDataStore().crew.filter((x) => x.isUserOwned);
    },
    hulls() {
      return useDataStore().hulls.filter((x) => x.isUserOwned);
    },
    cargo() {
      return useDataStore().cargo.filter((x) => x.isUserOwned);
    },
    tags() {
      return useDataStore().tags.filter((x) => x.isUserOwned);
    },
    deployables() {
      return useDataStore().deployables.filter((x) => x.isUserOwned);
    },
  },
  methods: {
    copyID() {
      navigator.clipboard.writeText(this.user.user_id);
    },
    statusColor(item: any) {
      if (item.Status === 'Submitted') return 'accent';
      if (item.Status === 'Approved') return 'success';
      if (item.Status === 'Rejected') return 'pink';
      if (item.Status === 'Flagged for Deletion') return 'error';
      if (item.Status === 'Changes Requested') return 'warning';
      return 'grey';
    },
  },
};
</script>
