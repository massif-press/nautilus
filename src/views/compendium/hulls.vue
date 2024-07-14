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
        :items="hulls"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.TruncatedName"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Tags="{ item }">
          <v-tooltip v-for="t in item.Tags" location="top" max-width="400px">
            <template #activator="{ props }">
              <v-chip
                size="x-small"
                variant="tonal"
                prepend-icon="mdi-tag"
                :text="t.Name"
                v-bind="props" />
            </template>
            <b>{{ t.Description }}</b>
          </v-tooltip>
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="px-0">
              <hull-card :hull="item" />
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
import HullCard from './cards/hullCard.vue';

export default {
  name: 'Hulls',
  components: { HullCard },
  data: () => ({
    expanded: [],
    sw_selections: [] as string[],
    cl_selections: [] as string[],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size.name' },
      { title: 'Shipwright', key: 'Shipwright' },
      { title: 'Tags', key: 'Tags' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  mounted() {
    this.sw_selections = this.shipwrights;
    this.cl_selections = this.classes;
  },
  computed: {
    filteredHulls() {
      return this.hulls.filter(
        (h) => this.sw_selections.includes(h.Shipwright) && this.cl_selections.includes(h.Class)
      );
    },
    hulls() {
      return useDataStore().hulls.filter((x) => x.isPublicVisible);
    },
    shipwrights() {
      return _.uniqBy(this.hulls.map((h) => h.Shipwright));
    },
    classes() {
      return _.uniq(this.hulls.map((h) => h.Class));
    },
    authors() {
      return _.uniqBy(this.hulls, 'Author.Name').map((hull) => hull.Author.Name);
    },
  },
  methods: {
    selectAllClass() {
      this.cl_selections = this.cl_selections.length === this.classes.length ? [] : this.classes;
    },
  },
};
</script>
