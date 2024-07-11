<template>
  <v-chip
    v-if="author.Discord"
    color="purple"
    prepend-icon="cc:discord"
    size="small"
    style="height: 18px"
    variant="elevated"
    @click="copyText">
    {{ author.Discord }}
  </v-chip>
</template>

<script lang="ts">
export default {
  props: {
    author: { type: Object, required: true },
  },
  methods: {
    copyText() {
      navigator.clipboard.writeText(this.author.Discord);
    },
  },
};
</script>
