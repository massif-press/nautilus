<template>
  <base-sidebar-view :item="item" @deselect="$emit('deselect')" @select="select($event)">
    <template #subtitle>
      <div class="text-caption text-disabled">{{ `${item.Subtitle}` }}</div>
    </template>
    <div class="text-caption text-disabled ml-1">Current Assignment</div>
    <div v-if="!item.Assignment" class="text-caption text-disabled ml-2"><i>None</i></div>
    <v-btn
      v-else
      size="x-small"
      color="accent"
      variant="tonal"
      class="ml-2"
      @click="select(item.Assignment)">
      {{ item.Assignment.Title || item.Assignment.Name }}
    </v-btn>

    <div class="px-2 text-caption">
      <v-divider class="my-2" />
      <v-dialog width="75vw">
        <template #activator="{ props }">
          <v-btn color="primary" size="x-small" flat class="my-2" block v-bind="props">
            View Details
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card>
            <v-toolbar density="compact" color="primary" class="rounded-0">
              <v-toolbar-title>Item Details</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="isActive.value = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <crew-card :crew="item" class="rounded-0" />
          </v-card>
        </template>
      </v-dialog>
    </div>
  </base-sidebar-view>
</template>

<script lang="ts">
import CrewCard from '../../compendium/cards/crewCard.vue';
import BaseSidebarView from './components/baseSidebarView.vue';
import DetailMenu from './components/detailMenu.vue';

export default {
  name: 'CrewViewer',
  components: {
    BaseSidebarView,
    DetailMenu,
    CrewCard,
  },
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  methods: {
    select(assignment) {
      if (assignment) this.$emit('select', assignment);
    },
  },
};
</script>
