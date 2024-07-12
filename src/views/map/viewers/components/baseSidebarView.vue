<template>
  <v-list-item style="position: relative" class="pa-0">
    <v-row dense class="py-1">
      <v-col cols="auto"><v-icon icon="cc:gms" size="large" class="ml-1 mt-n1 mr-n1" /></v-col>
      <v-col>
        {{ item.Name }}
        <slot name="subtitle" />
      </v-col>
    </v-row>
    <v-btn
      size="x-small"
      icon
      color="accent"
      variant="plain"
      style="position: absolute; top: -4px; right: -8px"
      @click="$emit('deselect')">
      <v-icon size="large" icon="mdi-chevron-double-left" />
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
    <v-img v-if="item.ImageSrc" :src="item.ImageSrc" height="150px" />
    <v-img
      v-else-if="item.Submap && item.Submap.Img"
      :src="getImgPath(item.Submap.Img)"
      height="150px" />
    <div
      v-else
      style="position: absolute; top: 15%; left: 0; right: 0; opacity: 0.2"
      class="text-center text-h3 font-weight-light">
      NO IMAGE
    </div>
  </v-card>
  <slot />
</template>

<script lang="ts">
export default {
  name: 'BaseSidebarView',
  props: {
    item: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  methods: {
    getImgPath(img: string) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
  },
};
</script>
