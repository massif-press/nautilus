<template>
  <base-sidebar-view :item="item" @deselect="$emit('deselect')" @select="$emit('select', $event)">
    <!-- <template #subtitle>
      <div class="text-caption">
        {{ map.Control }}
        <span v-if="map.Control !== 'Independent'" class="text-disabled pl-1">
          Controlled Space
        </span>
      </div>
    </template> -->
    <div class="px-3 text-caption" style="white-space: pre-wrap">
      {{ item.Description }}
    </div>
  </base-sidebar-view>
</template>

<script lang="ts">
import BaseSidebarView from './components/baseSidebarView.vue';

export default {
  name: 'TerrainViewer',
  components: {
    BaseSidebarView,
  },
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  data: () => ({
    tab: 0,
  }),
};
</script>
