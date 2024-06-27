<template>
  <fieldset
    v-if="item.Details.length > 0 || item.isUserOwned"
    class="pa-1 mt-2"
    style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
    <legend class="text-caption text-disabled ml-2 px-1 mb-n3">Item Detail</legend>
    <div v-for="detail in item.Details" class="mt-4 border">
      <v-row dense>
        <v-col>
          <v-text-field
            placeholder="Title (Optional)"
            hide-details
            density="compact"
            v-model="detail.title" />
        </v-col>
        <v-col cols="auto" class="text-right" align-self="center">
          <v-btn
            variant="tonal"
            size="x-small"
            color="error"
            class="py-5 ml-n2 rounded-0"
            @click="item.Details.splice(item.Details.indexOf(detail), 1)">
            <v-icon size="x-large" class="mt-n2" icon="mdi-delete" />
          </v-btn>
        </v-col>
      </v-row>
      <v-textarea hide-details density="compact" auto-grow v-model="detail.body" />
    </div>
    <div v-if="item.isUserOwned" class="text-right">
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            color="accent"
            variant="tonal"
            size="x-small"
            prepend-icon="mdi-plus"
            v-bind="props">
            Add Detail
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="suggestion in detailSuggestions"
            :title="(suggestion as any).title"
            @click="item.Details.push(suggestion)" />
          <v-list-item title="Other" @click="item.Details.push({ title: '', body: '' })" />
        </v-list>
      </v-menu>
    </div>
  </fieldset>
</template>

<script lang="ts">
export default {
  name: 'CompendiumItemEditor',
  props: {
    item: { type: Object, required: true },
    detailSuggestions: { type: Array, required: true },
  },
};
</script>
