<template>
  <v-card border variant="tonal">
    <v-card-text class="pt-2">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon icon="mdi-cube" />
        </v-col>
        <v-col cols="auto">
          <div class="text-h5">{{ cargo.Name }}</div>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-chip size="x-small">{{ cargo.CargoType }} Cargo</v-chip>
        </v-col>
      </v-row>
      <blockquote class="my-1 border-s-lg rounded pl-2" style="white-space: pre-wrap">
        {{ cargo.Description }}
      </blockquote>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'CargoCard',
  props: {
    cargo: { type: Object, required: false },
  },
};
</script>
