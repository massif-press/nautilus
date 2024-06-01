<template>
  <hull-card v-if="selected" :hull="selected" />
  <v-card v-else border variant="tonal">
    <v-card-text>
      <div v-if="!selected">No Hull Selected</div>
    </v-card-text>
  </v-card>
  <div class="text-right">
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
            <v-text-field v-model="search" label="Search" />
          </template>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="headers" :items="hulls" :items-per-page="-1">
            <template #item.Name="{ item }">
              <v-btn color="secondary" size="small" @click="select(item)">
                {{ item.Name }}
              </v-btn>
            </template>
            <template #item.Tags="{ item }">
              <v-tooltip v-for="tag in item.Tags" location="top">
                <template #activator="{ props }">
                  <v-chip v-bind="props" prepend-icon="mdi-tag">
                    {{ tag.Name }}
                  </v-chip>
                </template>
                <b>{{ tag.Description }}</b>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useCompendiumStore } from '../../../stores/compendiumStore';
import HullCard from '../../compendium/cards/hullCard.vue';

export default {
  name: 'HullSelector',
  components: { HullCard },
  props: {
    selected: { type: Object, required: false },
  },
  emits: ['select'],
  data: () => ({
    search: '',
    headers: [
      { title: 'Hull', value: 'Name', sortable: true },
      { title: 'Size', value: 'Size.name', sortable: true },
      { title: 'Class', value: 'Class', sortable: true },
      { title: 'Shipwright', value: 'Shipwright.Name', sortable: true },
      { title: 'Tags', value: 'Tags', sortable: true },
    ],
    dialog: false,
  }),
  computed: {
    hulls() {
      return useCompendiumStore().hulls;
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
