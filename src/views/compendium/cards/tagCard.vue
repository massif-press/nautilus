<template>
  <v-card border variant="tonal" class="pa-2">
    <v-row dense>
      <v-col cols="auto" align-self="center">
        <v-icon icon="mdi-tag" :size="small ? 30 : 45" />
      </v-col>
      <v-col>
        <v-row dense>
          <v-col>
            <div :class="small ? 'font-weight-bold' : 'text-h5'">{{ tag.Name }}</div>
          </v-col>
          <v-col v-if="!hideApplies" cols="auto" class="mt-n3">
            <div class="text-caption text-right text-disabled">Applies to</div>
            <div class="text-caption text-right">
              <v-chip
                v-for="a in tag.AppliesTo"
                :key="a"
                label
                size="x-small"
                class="text-capitalize ml-2">
                {{ a === 'poi' ? 'Point of Interest' : a }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <div style="white-space: pre-wrap">
          {{ tag.Description }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'TagCard',
  props: {
    tag: { type: Object, required: true },
    small: { type: Boolean },
    hideApplies: { type: Boolean },
  },
};
</script>
