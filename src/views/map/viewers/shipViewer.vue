<template>
  <base-sidebar-view :item="item" @deselect="$emit('deselect')" @select="$emit('select', $event)">
    <template #subtitle>
      <div class="text-caption text-disabled">{{ `${item.Owner} ${item.Hull.Class}` }}</div>
    </template>

    <div class="px-2 text-caption">
      <div>
        <div>
          {{ item.Mission.Mission }}
        </div>
        <div class="text-caption text-disabled mb-n1">Status</div>
        {{ item.Mission.Status }}
      </div>
      <div class="text-caption text-disabled mb-n1">Destination</div>

      <div>
        {{ item.Mission.Destination ? item.Mission.Destination.Name : '' }}
      </div>
    </div>

    <detail-menu
      :item="item"
      :map="map"
      @deselect="$emit('deselect')"
      @select="$emit('select', $event)">
      <template #details>
        <div class="text-h6">{{ item.Owner }} {{ item.Hull.Name }}-class {{ item.Hull.Class }}</div>
        <v-row>
          <v-col cols="auto">
            <div class="text-caption text-disabled">Shipwright</div>
            <div>{{ item.Hull.Shipwright.Name }}</div>
          </v-col>
          <v-col cols="auto">
            <div class="text-caption text-disabled">Home Port</div>
            <div>{{ item.HomePort }}</div>
          </v-col>
          <v-col cols="auto">
            <div class="text-caption text-disabled">Current Location</div>
            <div>{{ map.Title }} ({{ map.Subtitle }})</div>
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
            <v-col cols="auto" v-if="item.Mission.Destination && item.Mission.Destination.Name">
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
      </template>
    </detail-menu>
  </base-sidebar-view>
</template>

<script lang="ts">
import BaseSidebarView from './components/baseSidebarView.vue';
import DetailMenu from './components/detailMenu.vue';

export default {
  name: 'ShipViewer',
  components: {
    BaseSidebarView,
    DetailMenu,
  },
  props: {
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  emits: ['select', 'deselect'],
  methods: {
    findDestination() {
      this.dialog = false;
      this.$emit('select', this.item.Mission.Destination);
    },
  },
};
</script>
