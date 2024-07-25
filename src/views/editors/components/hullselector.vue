<template>
  <hull-card v-if="selected" :hull="selected" />
  <v-card v-else border variant="tonal">
    <v-card-text>
      <div v-if="!selected">No Hull Selected</div>
    </v-card-text>
  </v-card>
  <div v-if="!readonly" class="text-right">
    <v-dialog v-model="dialog">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" variant="tonal" size="small">Select Hull</v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" extended>
          <v-toolbar-title>Select Hull</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template #extension>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" />
          </template>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="hulls"
          :items-per-page="-1"
          class="rounded-0"
          item-value="ID"
          show-expand
          v-model:expanded="expanded">
          <template #item.Name="{ item }">
            <v-tooltip v-if="!item.CanAdd" location="top" max-width="400px">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  color="accent"
                  size="small"
                  icon="mdi-lock-alert"
                  class="mx-1" />
              </template>
              <b v-if="item.Status !== 'Submitted'">
                This item cannot be selected until it has been published.
              </b>
              <b v-else>This item cannot be selected.</b>
            </v-tooltip>
            <v-btn color="secondary" size="small" :disabled="!item.CanAdd" @click="select(item)">
              {{ item.TruncatedName }}
            </v-btn>
          </template>
          <template #item.Tags="{ item }">
            <v-tooltip v-for="tag in item.Tags" location="top" max-width="400px">
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  prepend-icon="mdi-tag"
                  size="small"
                  style="margin: 2px 2px 2px 2px">
                  {{ tag.TruncatedName }}
                </v-chip>
              </template>
              <b>{{ tag.Description }}</b>
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
        <div class="text-right font-italic text-caption px-3 pb-1">
          Showing {{ filteredHulls.length }} of {{ hulls.length }} hulls. Hulls must be
          <b>Approved</b>
          or
          <b>Submitted</b>
          to be selected.
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useDataStore } from '../../../stores/dataStore';
import HullCard from '../../compendium/cards/hullCard.vue';

export default {
  name: 'HullSelector',
  components: { HullCard },
  props: {
    selected: { type: Object, required: false },
    readonly: { type: Boolean, default: false },
  },
  emits: ['select'],
  data: () => ({
    search: '',
    headers: [
      { title: 'Hull', value: 'Name', sortable: true },
      { title: 'Size', value: 'Size.name', sortable: true },
      { title: 'Class', value: 'Class', sortable: true },
      { title: 'Shipwright', value: 'Shipwright', sortable: true },
      { title: 'Tags', value: 'Tags', sortable: true },
    ],
    dialog: false,
    expanded: [],
  }),
  computed: {
    hulls() {
      return useDataStore().hulls.filter(
        (h) => h.Status === 'Approved' || h.Status === 'Submitted'
      );
    },
    filteredHulls() {
      return this.hulls.filter((h) => h.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    select(hull) {
      this.$emit('select', hull);
      this.dialog = false;
    },
  },
};
</script>
