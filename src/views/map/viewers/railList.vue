<template>
  <v-window-item transition="fade">
    <div v-if="!selected">
      <div class="text-caption text-disabled text-uppercase pl-1"><slot name="title" /></div>
      <v-row dense align="center">
        <v-col>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="ma-1"
            item-text="name"
            density="compact"
            variant="outlined"
            hide-details
            clearable />
        </v-col>
        <v-col cols="auto" class="ml-n3 mr-3">
          <v-badge
            :color="filters.length ? 'primary' : 'transparent'"
            :content="filters.length > 0 ? filters.length : ''">
            <v-btn icon variant="plain" size="x-small" @click="filterDialog = true">
              <v-icon size="x-large" icon="mdi-filter" />
            </v-btn>
          </v-badge>
        </v-col>
      </v-row>
      <v-list dense>
        <v-list-item v-for="item in filteredItems" @click="select(item)">
          <v-icon :icon="item.Icon.icon" size="x-small" class="mt-n1" />
          {{ item.Title || item.Name }}
          <div class="text-caption text-disabled" style="line-height: 14px">
            {{ item.Subtitle }}
          </div>
        </v-list-item>
      </v-list>
    </div>
    <div v-else>
      <viewer :item="selected" :map="map" @deselect="deselect()" @select="select($event)" />
    </div>
  </v-window-item>
  <v-dialog v-model="filterDialog" persistent max-width="600px">
    <v-card>
      <v-toolbar density="compact" color="primary" flat>
        <v-toolbar-title>Filter Items</v-toolbar-title>
        <v-btn icon @click="filterDialog = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card-text>filters</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="filters = []">Clear Filters</v-btn>
        <v-btn text @click="filterDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Viewer from '../viewer.vue';

export default {
  name: 'rail-list',
  props: {
    items: Array,
    map: Object,
    selected: Object,
  },
  components: {
    Viewer,
  },
  data: () => ({
    search: '',
    filters: [],
    filterDialog: false,
  }),
  emits: ['setSelected', 'clearSelection'],
  computed: {
    filteredItems() {
      return this.items.filter((i) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    select(item) {
      this.$emit('setSelected', item);
    },
    deselect() {
      this.$emit('clearSelection');
    },
  },
};
</script>
