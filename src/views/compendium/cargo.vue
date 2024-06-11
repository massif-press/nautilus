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
        <v-col cols="auto">
          <v-chip-group v-model="ct_selections" multiple column>
            <v-chip
              v-for="t in cargoTypes"
              :color="ct_selections.includes(t) ? 'accent' : ''"
              label
              :text="t"
              size="small" />
          </v-chip-group>
        </v-col>
      </v-row>
      <div class="text-caption text-disabled text-right">
        <i>
          Showing {{ filteredCargo.length }} of {{ cargo.length }} cargo from
          {{ authors.length }} authors
        </i>
      </div>
    </v-card>

    <v-card-text>
      <v-data-table
        v-model:expanded="expanded"
        :search="search"
        :headers="headers"
        :items="cargo"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.Name"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="px-0">
              <cargo-card :cargo="item" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useCompendiumStore } from '../../stores/compendiumStore';
import CargoCard from './cards/cargoCard.vue';
import { filter } from 'lodash';

export default {
  name: 'Cargo',
  components: { CargoCard },
  data: () => ({
    expanded: [],
    ct_selections: [] as string[],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'CargoType' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  computed: {
    cargo() {
      return useCompendiumStore().cargo;
    },
    filteredCargo() {
      if (!this.search) return this.cargo;
      return _.filter(this.cargo, (cargo) => {
        return _.includes(cargo.Name.toLowerCase(), this.search.toLowerCase());
      });
    },
    cargoTypes() {
      return _.uniq(this.cargo).map((c) => c.CargoType);
    },
    authors() {
      return _.uniqBy(this.cargo, 'Author.Name').map((c) => c.Author.Name);
    },
  },
};
</script>