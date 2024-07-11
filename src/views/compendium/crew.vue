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
        :items="crew"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-tooltip v-if="item.IsNhp" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-chip" start />
            </template>
            <b>NHP</b>
          </v-tooltip>
          <v-btn
            size="small"
            color="secondary"
            :text="item.Name"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Assignment="{ item }">
          <span v-if="!item.Assignment">
            <i class="text-caption text-disabled">Unassigned</i>
          </span>
          <v-btn v-else size="small" color="accent" variant="tonal" :to="`/main/map/${item.ID}`">
            {{ item.Assignment.Title || item.Assignment.Name }}
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
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
import CrewCard from './cards/crewCard.vue';

export default {
  name: 'Crew',
  components: { CrewCard },
  data: () => ({
    expanded: [],
    ct_selections: [],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Role', key: 'Role' },
      { title: 'Pronouns', key: 'Pronouns' },
      { title: 'Background', key: 'Background' },
      { title: 'Assignment', key: 'Assignment' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  computed: {
    crew() {
      return useDataStore().crew.filter((x) => x.isPublicVisible);
    },
    filteredCrew() {
      if (!this.search) return this.crew;
      return _.filter(this.crew, (c) => {
        return c.Name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    authors() {
      return _.uniqBy(this.crew, 'Author.Name').map((c) => c.Author.Name);
    },
  },
};
</script>
