<template>
  <component
    v-if="component"
    ref="filter"
    :is="component"
    :filters="filters"
    :map="map"
    @set-filter="$emit('set-filter', $event)" />
</template>

<script lang="ts">
import _ from 'lodash';
import shipFilter from './shipFilter.vue';
import poiFilter from './poiFilter.vue';

export default {
  name: 'FilterComponent',
  props: {
    filterType: String,
    filters: Object,
    map: Object,
  },
  computed: {
    component() {
      if (this.filterType.toLowerCase() === 'ship') return shipFilter;
      if (this.filterType.toLowerCase() === 'poi') return poiFilter;
    },
  },
  methods: {
    clearAll() {
      this.$refs.filter.clearAll();
    },
  },
};
</script>
