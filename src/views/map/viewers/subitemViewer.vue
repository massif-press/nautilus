<template>
  <base-sidebar-view :item="item" @deselect="$emit('deselect')" @select="$emit('select', $event)">
    <div class="px-2 text-caption">
      {{ item.Description }}
    </div>
  </base-sidebar-view>
</template>

<script lang="ts">
import BaseSidebarView from './components/baseSidebarView.vue';

export default {
  name: 'SubitemViewer',
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
