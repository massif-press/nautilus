<template>
  <v-list-item :subtitle="`${map.title}`" style="position: relative">
    <template #title>
      <v-icon icon="cc:gms" class="mt-n1" />
      {{ item.name }}
    </template>
    <v-btn
      size="x-small"
      icon
      color="accent"
      variant="plain"
      style="position: absolute; top: -4px; right: -8px"
      @click="$emit('deselect')">
      <v-icon size="large" icon="mdi-close" />
    </v-btn>
  </v-list-item>
  <v-divider />
  <v-card variant="outlined" height="150px" class="ma-2" style="position: relative">
    <v-btn
      size="x-small"
      icon
      color="accent"
      variant="plain"
      style="position: absolute; top: 0; right: 0"
      @click="$emit('select', item)">
      <v-icon size="large" icon="mdi-loupe" />
    </v-btn>
    <div
      style="position: absolute; top: 15%; left: 0; right: 0; opacity: 0.2"
      class="text-center text-h3 font-weight-light">
      NO IMAGE
    </div>
  </v-card>
  <div class="px-2 text-caption">
    {{ item.description }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'TerrainViewer',
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
