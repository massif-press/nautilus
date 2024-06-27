<template>
  <component
    :is="getViewer"
    :item="item"
    :map="map"
    @deselect="$emit('deselect')"
    @select="$emit('select', $event)" />
</template>

<script lang="ts">
import shipViewer from './viewers/shipViewer.vue';
import poiViewer from './viewers/poiViewer.vue';
import TerrainViewer from './viewers/terrainViewer.vue';
import SubitemViewer from './viewers/subitemViewer.vue';
import CrewViewer from './viewers/crewViewer.vue';

export default {
  name: 'Viewer',
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  computed: {
    getViewer() {
      if (this.item.ItemType === 'ship') return shipViewer;
      if (this.item.ItemType === 'poi') return poiViewer;
      if (this.item.ItemType === 'subitem') return SubitemViewer;
      if (this.item.ItemType === 'crew') return CrewViewer;
      return TerrainViewer;
    },
  },
};
</script>
