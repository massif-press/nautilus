<template>
  <component
    :is="getViewer"
    :item="item"
    :map="map"
    @deselect="$emit('deselect')"
    @select="$emit('select', $event)" />
</template>

<script lang="ts">
import shipViewer from './shipViewer.vue';
import poiViewer from './poiViewer.vue';
import TerrainViewer from './terrainViewer.vue';

export default {
  name: 'Viewer',
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  computed: {
    getViewer() {
      if (this.item.ItemType === 'ship') {
        return shipViewer;
      }
      if (this.item.ItemType === 'poi') {
        return poiViewer;
      }
      return TerrainViewer;
    },
  },
};
</script>
