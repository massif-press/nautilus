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
import crewFilter from './crewFilter.vue';

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
      if (this.filterType.toLowerCase() === 'crew') return crewFilter;
    },
  },
  methods: {
    clearAll() {
      this.$refs.filter.clearAll();
    },
  },
};
</script>
