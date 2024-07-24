<template>
  <base-sidebar-view :item="item" @deselect="$emit('deselect')" @select="$emit('select', $event)">
    <template #subtitle>
      <div class="text-caption text-disabled">{{ `${item.Owner} ${item.PoiType}` }}</div>
    </template>
    <div class="px-3 text-caption" style="white-space: pre-wrap">
      {{ item.Description }}
    </div>
    <detail-menu
      :item="item"
      :map="map"
      @deselect="$emit('deselect')"
      @select="$emit('select', $event)">
      <template #details>
        <div class="text-h6">
          {{ item.Owner }} {{ item.PoiType }} &mdash; {{ map.Title }} ({{ map.Subtitle }})
        </div>
      </template>
    </detail-menu>
  </base-sidebar-view>
</template>

<script lang="ts">
import BaseSidebarView from './components/baseSidebarView.vue';
import DetailMenu from './components/detailMenu.vue';

export default {
  name: 'PoiViewer',
  components: {
    BaseSidebarView,
    DetailMenu,
  },
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
};
</script>
