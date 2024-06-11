<template>
  <v-card v-if="!!crewedItem && !crewedItem.Crew.length" border variant="tonal" class="pa-2">
    <div class="text-center text-disabled text-caption font-italic">No Crew Registered</div>
  </v-card>
  <v-card v-else border variant="tonal" class="pa-2">
    <v-row dense v-for="c in crewedItem!.Crew" align="center">
      <v-col cols="auto">
        <v-avatar color="grey-darken-4" class="rounded"><v-icon icon="mdi-account" /></v-avatar>
      </v-col>
      <v-col cols="auto">
        {{ c.Name }}
        <span class="text-caption text-disabled">//</span>
        {{ c.Role }}
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-dialog width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" variant="plain" icon>
              <v-icon icon="mdi-magnify" color="accent" />
            </v-btn>
          </template>
          <v-card>
            <crew-card :crew="c" />
          </v-card>
        </v-dialog>
        <v-btn
          size="x-small"
          variant="plain"
          color="secondary"
          icon
          :to="`/main/editor/edit/crew/${c.ID}`">
          <v-icon icon="mdi-pencil" />
        </v-btn>
        <v-btn size="x-small" variant="plain" color="error" icon @click="c.ClearAssignment()">
          <v-icon icon="mdi-account-remove" />
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
  <div class="text-right">
    <v-dialog v-model="dialog" width="80vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" variant="tonal" size="small">Assign Crew</v-btn>
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
          v-model:expanded="expanded"
          :search="search"
          :headers="headers"
          :items="allCrew"
          item-value="ID"
          :items-per-page="100"
          class="rounded-0"
          density="compact"
          show-expand>
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
            <i v-if="!crewedItem" class="text-caption text-disabled">-</i>
            <i
              v-else-if="item.Assignment && crewedItem.ID === item.Assignment.ID"
              class="text-caption text-disabled">
              Assigned to {{ crewedItem.Title || crewedItem.Name }}
            </i>
            <v-btn v-else size="small" color="secondary" @click="assignCrew(item)">
              {{ item.Assignment ? 'Reassign' : 'Assign' }} to
              {{ crewedItem.Title || crewedItem.Name }}
            </v-btn>
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="px-0">
                <crew-card :crew="item" />
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useMapStore } from '../../../stores/mapStore';
import CrewCard from '../../compendium/cards/crewCard.vue';

export default {
  name: 'CrewSelector',
  components: { CrewCard },
  props: {
    crewedItem: { type: Object, required: false },
  },
  emits: ['select'],
  data: () => ({
    expanded: [],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Role', key: 'Role' },
      { title: 'Background', key: 'Background' },
      { title: 'Assignment', key: 'Assignment' },
      { title: '', key: 'Reassign' },
    ],
    dialog: false,
  }),
  computed: {
    allCrew() {
      return useMapStore().crew;
    },
  },
  methods: {
    assignCrew(crew) {
      crew.Assignment = this.crewedItem;
      this.dialog = false;
    },
  },
};
</script>
