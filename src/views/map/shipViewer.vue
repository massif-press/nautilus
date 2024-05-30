<template>
  <v-list-item style="position: relative" class="pa-0">
    <v-row dense class="py-1">
      <v-col cols="auto"><v-icon icon="cc:gms" size="large" class="ml-1 mt-n1 mr-n1" /></v-col>
      <v-col>
        {{ item.Title }}
        <div class="text-caption text-disabled">{{ `${item.Owner} ${item.Hull.Class}` }}</div>
      </v-col>
    </v-row>
    <v-btn
      size="x-small"
      icon
      color="accent"
      variant="plain"
      style="position: absolute; top: -4px; right: -8px"
      @click="$emit('deselect')">
      <v-icon size="large" icon="mdi-close" />
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
    <div
      style="position: absolute; top: 15%; left: 0; right: 0; opacity: 0.2"
      class="text-center text-h3 font-weight-light">
      NO IMAGE
    </div>
  </v-card>
  <div class="px-2 text-caption">
    <div>
      <div>
        {{ item.Mission.Mission }}
      </div>
      <b>Status:</b>
      {{ item.Mission.Status }}
    </div>
    <div>
      <b>Destination:</b>

      {{ item.Mission.Destination ? item.Mission.Destination.Name : '' }}
    </div>
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
      @click="openDetailTab(1)"
      disabled>
      View Personnel
    </v-btn>
    <v-btn
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(2)"
      disabled>
      View Cargo
    </v-btn>
  </div>

  <v-dialog v-model="dialog" width="75vw">
    <v-card>
      <v-toolbar density="compact" color="primary" extended>
        <v-toolbar-title>Ship Details</v-toolbar-title>
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
            <div class="text-h6">{{ item.Owner }} {{ item.Hull }}-class {{ item.Hull.Class }}</div>
            <v-row>
              <v-col cols="auto">
                <div class="text-caption text-disabled">Shipwright</div>
                <div>{{ item.Hull.Shipwright }}</div>
              </v-col>
              <v-col cols="auto">
                <div class="text-caption text-disabled">Home Port</div>
                <div>{{ item.HomePort }}</div>
              </v-col>
              <v-col cols="auto">
                <div class="text-caption text-disabled">Current Location</div>
                <div>{{ map.title }} ({{ map.subtitle }})</div>
              </v-col>
            </v-row>
            <v-card flat border class="pa-1 my-2">
              <v-row justify="space-around">
                <v-col cols="auto">
                  <div class="text-caption text-disabled">Mission</div>
                  <div>{{ item.Mission.Mission }}</div>
                </v-col>
                <v-col cols="auto">
                  <div class="text-caption text-disabled">Mission Status</div>
                  <div>{{ item.Mission.Status }}</div>
                </v-col>
                <v-col cols="auto">
                  <div class="text-caption text-disabled">Destination</div>
                  <div>
                    {{ item.Mission.Destination.Name }}
                    <v-btn
                      icon
                      variant="plain"
                      color="accent"
                      size="x-small"
                      @click="findDestination()">
                      <v-icon size="large" icon="mdi-magnify" />
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
            <div class="text-caption text-disabled">Vessel Particulars</div>
            <div v-if="item.Details" v-for="(value, key) in item.Details" :key="key">
              <div>{{ key }}: {{ value }}</div>
            </div>
            <div class="text-caption text-center"><i>No Data Available</i></div>
            <div class="text-caption text-disabled">Vessel History</div>
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
import { useMapStore } from '../../mapStore';

export default {
  name: 'ShipViewer',
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  data: () => ({
    dialog: false,
    tab: 0,
  }),
  methods: {
    openDetailTab(tab: number) {
      this.dialog = true;
      this.tab = tab;
    },
    findDestination() {
      this.dialog = false;
      this.$emit('select', this.item.Mission.Destination);
    },
  },
};
</script>
