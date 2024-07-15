<template>
  <div class="px-2 text-caption">
    <v-divider class="my-2" />
    <v-btn color="primary" size="x-small" flat class="my-2" block @click="openDetailTab(0)">
      Details
    </v-btn>
    <v-btn
      v-if="item.Crew && item.Crew.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(1)">
      Crew
    </v-btn>
    <v-btn
      v-if="item.CargoManifest && item.CargoManifest.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(2)">
      Cargo
    </v-btn>
    <v-btn
      v-if="item.Deployables && item.Deployables.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(3)">
      Hangar
    </v-btn>
  </div>

  <v-dialog v-model="dialog" width="75vw">
    <detail-menu-content
      v-if="dialog"
      v-model="tab"
      :item="item"
      :map="map"
      @close="dialog = false" />
  </v-dialog>
</template>

<script lang="ts">
import CrewCard from '../../../compendium/cards/crewCard.vue';
import DeployableCard from '../../../compendium/cards/deployableCard.vue';
import CargoCard from '../../../compendium/cards/cargoCard.vue';
import DetailMenuContent from './detailMenuContent.vue';

export default {
  name: 'DetailMenu',
  components: {
    CrewCard,
    DeployableCard,
    CargoCard,
    DetailMenuContent,
  },
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
