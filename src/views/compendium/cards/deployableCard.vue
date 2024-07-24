<template>
  <v-card border variant="tonal">
    <v-card-text class="pt-2">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon :icon="deployable.Icon" />
        </v-col>
        <v-col cols="auto">
          <div class="text-h5">{{ deployable.Name }}</div>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-chip size="x-small">{{ deployable.DeployableType }}</v-chip>
        </v-col>
      </v-row>
      <blockquote class="my-1 border-s-lg rounded pl-2" style="white-space: pre-wrap">
        {{ deployable.Description }}
      </blockquote>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'DeployableCard',
  props: {
    deployable: { type: Object, required: true },
  },
};
</script>
