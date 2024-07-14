<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="text" size="small" :disabled="readonly">
        <v-icon size="large" :color="item.color" icon="mdi-square" />
      </v-btn>
    </template>
    <v-color-picker v-model="item.color" hide-details />
    <v-footer border="t" class="py-0 px-1">
      <v-tooltip>
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" icon flat @click="copyColor">
            <v-icon icon="mdi-content-copy" />
          </v-btn>
        </template>
        <b>Copy color</b>
      </v-tooltip>
      <v-spacer />
      <v-tooltip>
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" icon flat @click="pasteColor">
            <v-icon icon="mdi-content-paste" />
          </v-btn>
        </template>
        <b>Paste color</b>
      </v-tooltip>
    </v-footer>
  </v-menu>
</template>

<script lang="ts">
export default {
  props: {
    item: { type: Object, required: true },
    readonly: Boolean,
  },
  methods: {
    copyColor() {
      navigator.clipboard.writeText(this.item.color);
    },
    async pasteColor() {
      const color = await navigator.clipboard.readText();
      this.item.color = color;
    },
  },
};
</script>
