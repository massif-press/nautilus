<template>
  <div class="px-2 text-caption">
    <v-divider class="my-2" />
    <v-btn color="primary" size="x-small" flat class="my-2" block @click="openDetailTab(0)">
      View Details
    </v-btn>
    <v-btn
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      disabled
      @click="openDetailTab(1)">
      View Personnel
    </v-btn>
    <v-btn
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      disabled
      @click="openDetailTab(2)">
      View Cargo
    </v-btn>
  </div>

  <v-dialog v-model="dialog" width="75vw">
    <v-card>
      <v-toolbar density="compact" color="primary" extended>
        <v-toolbar-title>Object Details</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template #extension>
          <v-tabs v-model="tab">
            <v-tab>Details</v-tab>
            <v-tab disabled>Personnel</v-tab>
            <v-tab disabled>Cargo</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <div class="px-2 pt-4 mb-n2 text-h4 text-uppercase">
        <v-icon icon="cc:gms" class="mt-n1" />
        {{ item.Title }}
      </div>
      <v-card-text class="pt-0">
        <v-window v-model="tab">
          <v-window-item>
            <slot name="details" />

            <div class="text-caption text-disabled">Item Particulars</div>
            <div v-if="item.Details" v-for="(value, key) in item.Details" :key="key">
              <div>{{ key }}: {{ value }}</div>
            </div>
            <div class="text-caption text-center"><i>No Data Available</i></div>
            <div class="text-caption text-disabled">Item History</div>
            <div v-if="item.History" v-for="(value, key) in item.History" :key="key">
              <div>{{ key }}: {{ value }}</div>
            </div>
            <div class="text-caption text-center"><i>No Data Available</i></div>
          </v-window-item>
          <v-window-item>personnel</v-window-item>
          <v-window-item>cargo</v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'BaseSidebarView',
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  data() {
    return {
      dialog: false,
      tab: 0,
    };
  },
  emits: ['select', 'deselect'],
  methods: {
    openDetailTab(tab: number) {
      this.tab = tab;
      this.dialog = true;
    },
  },
};
</script>
