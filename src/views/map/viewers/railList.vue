<template>
  <v-window-item transition="fade">
    <div v-if="!items.length" class="text-center mt-2">
      <i class="text-caption text-disabled">No Items</i>
    </div>
    <div v-else-if="!selected">
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
            :color="filterLength ? 'primary' : 'transparent'"
            :content="filterLength > 0 ? filterLength : ''">
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
  <v-dialog v-model="filterDialog" max-width="60vw">
    <v-card>
      <v-toolbar density="compact" color="primary" flat>
        <v-toolbar-title>Filter Items</v-toolbar-title>
        <v-btn icon @click="filterDialog = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <itemFilter
        ref="filter"
        :filter-type="items[0].ItemType"
        :filters="filters"
        :map="map"
        @set-filter="filters = $event" />
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" size="small" @click="$refs.filter.clearAll()">Clear Filters</v-btn>
        <v-btn variant="text" size="small" @click="filterDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Viewer from '../viewer.vue';
import itemFilter from '../../../_components/filters/filter.vue';
import f from '../../../_components/filters/itemFilter';

export default {
  name: 'rail-list',
  props: {
    items: Array,
    map: Object,
    selected: Object,
  },
  components: {
    Viewer,
    itemFilter,
  },
  data: () => ({
    search: '',
    filters: {},
    filterDialog: false,
  }),
  emits: ['setSelected', 'clearSelection'],
  computed: {
    filteredItems() {
      let out = this.items;
      if (this.search) {
        out = out.filter((i) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      if (this.filterLength) {
        out = f(out, this.filters);
      }
      return out;
    },
    filterLength() {
      console.log(this.filters);
      let count = 0;
      Object.keys(this.filters).forEach((key) => {
        count += this.filters[key]?.length || 0;
      });
      return count;
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
