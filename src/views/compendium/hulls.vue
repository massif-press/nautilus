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
          <v-chip-group v-model="sw_selections" multiple column>
            <v-chip
              v-for="s in shipwrights"
              :color="sw_selections.includes(s) ? 'accent' : ''"
              label
              :text="s"
              size="small" />
          </v-chip-group>
        </v-col>
      </v-row>
      <v-select
        v-model="cl_selections"
        :items="classes"
        density="compact"
        multiple
        hide-details
        prepend-icon="mdi-filter">
        <template #selection="{ item, index }">
          <v-chip v-if="index < 7" size="small">
            {{ item.title }}
          </v-chip>
          <span v-if="index === 7" class="text-grey text-caption align-self-center">
            (+{{ cl_selections.length - 7 }} others)
          </span>
        </template>
        <template #prepend-item>
          <v-list-item title="Select All" @click="selectAllClass">
            <template #prepend>
              <v-icon
                :icon="
                  cl_selections.length === 0
                    ? 'mdi-checkbox-blank-outline'
                    : cl_selections.length === classes.length
                    ? 'mdi-checkbox-marked'
                    : 'mdi-minus-box-outline'
                " />
            </template>
          </v-list-item>
        </template>
      </v-select>
      <div class="text-caption text-disabled text-right">
        <i>
          Showing {{ filteredHulls.length }} of {{ hulls.length }} hulls from
          {{ authors.length }} authors
        </i>
      </div>
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
            :text="item.Name"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #item.Tags="{ item }">
          <v-tooltip v-for="t in item.Tags" location="top">
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
import { useCompendiumStore } from '../../stores/compendiumStore';
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
      return useCompendiumStore().hulls;
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
