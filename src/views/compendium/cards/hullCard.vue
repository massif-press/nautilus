<template>
  <v-card border variant="tonal">
    <v-card-text>
      <div class="text-h5">{{ hull.Name }}</div>
      <v-row dense justify="space-between">
        <v-col cols="auto">
          {{ hull.Shipwright.Name }} {{ hull.Class }}
          <span class="text-caption text-disabled">({{ hull.Code }})</span>
        </v-col>
        <v-col cols="auto">
          <v-chip size="x-small">{{ hull.Size.name }}</v-chip>
        </v-col>
      </v-row>
      <blockquote class="my-1 border-s-lg rounded pl-2">
        {{ hull.Description }}
      </blockquote>
      <v-row dense>
        <v-col v-for="tag in hull.Tags" style="min-width: 300px">
          <tag-card :tag="tag" small hide-applies />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import TagCard from './tagCard.vue';

export default {
  name: 'HullCard',
  components: { TagCard },
  props: {
    hull: { type: Object, required: false },
  },
};
</script>
