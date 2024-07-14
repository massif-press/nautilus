<template>
  <div class="text-right">
    <v-dialog v-model="dialog" width="80vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" size="x-small" color="accent" variant="tonal" block>
          {{ crew.Assignment ? 'reassign' : 'assign' }}
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" extended>
          <v-toolbar-title>Assign Crew</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template #extension>
            <v-text-field v-model="search" label="Search" />
          </template>
        </v-toolbar>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="allShips"
          item-value="ID"
          :items-per-page="100"
          class="rounded-0"
          density="compact">
          <template #item.Assignment="{ item }">
            <span v-if="!item.Assignment">
              <i class="text-caption text-disabled">Unassigned</i>
            </span>
            <v-btn
              v-else
              size="small"
              color="accent"
              variant="tonal"
              :to="`/main/map/${item.Assignment.ID}`">
              {{ item.Assignment.Title || item.Assignment.Name }}
            </v-btn>
          </template>
          <template #item.Reassign="{ item }">
            <v-btn
              v-if="!crew.Assignment || crew.Assignment.ID !== item.ID"
              size="small"
              color="secondary"
              @click="assignCrew(item)">
              {{ crew.Assignment ? 'Reassign' : 'Assign' }}
            </v-btn>
            <v-chip v-else size="x-small" color="accent" text-color="white">
              Current Assignment
            </v-chip>
          </template>
          <template #item.Location="{ item }">
            <v-btn size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
              {{ getMap(item.Location.map) }}
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Ship } from '../../../models/maps/ship';
import { useDataStore } from '../../../stores/dataStore';
import { useUserStore } from '../../../stores/userStore';
import CrewCard from '../../compendium/cards/crewCard.vue';

export default {
  name: 'CrewSelector',
  components: { CrewCard },
  props: {
    crew: { type: Object, required: true },
  },
  emits: ['select'],
  data: () => ({
    expanded: [],
    search: '',
    headers: [
      { title: 'Name', key: 'TruncatedName' },
      { title: 'Hull', key: 'Hull.Name' },
      { title: 'Class', key: 'Hull.Class' },
      { title: 'Location', key: 'Location' },
      { title: 'Faction', key: 'Faction' },
      { title: 'Owner', key: 'Owner' },
      { title: '', key: 'Reassign' },
    ],
    dialog: false,
  }),
  computed: {
    allShips() {
      let s = useDataStore().ships as Ship[];
      if (this.crew.IsNhp) s = s.filter((ship) => ship.IsSolidState);
      return s.filter((ship: Ship) => ship.Status === 'Approved' || ship.Status === 'Submitted');
    },
    user(): string {
      return useUserStore().user_id;
    },
  },
  methods: {
    assignCrew(ship) {
      this.crew.Assignment = ship;
      this.dialog = false;
    },
    getMap(id: string) {
      const map = useDataStore().maps.find((x) => x.ID === id);
      return map ? map.Name : 'Unknown';
    },
  },
};
</script>
