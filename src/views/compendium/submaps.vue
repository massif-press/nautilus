<template>
  <v-container>
    <v-select v-model="selectedMap" :items="maps" item-title="Name" return-object label="Map" />
    <v-autocomplete
      :items="submaps"
      v-model="selectedSubmap"
      item-title="Img"
      return-object
      label="Submap" />

    <v-card-text>
      <v-row justify="center">
        <v-col cols="8">
          <v-img v-if="selectedMap && selectedSubmap" :src="getImgPath(selectedSubmap.Img)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useMapStore } from '../../stores/mapStore';
import HullCard from './cards/hullCard.vue';

export default {
  name: 'Hulls',
  components: { HullCard },
  data: () => ({
    selectedMap: null,
    selectedSubmap: null,
  }),
  computed: {
    maps() {
      return useMapStore().maps;
    },
    submaps() {
      if (!this.selectedMap) return [];
      return _.uniq(useMapStore().getSubmaps(this.selectedMap.ID));
    },
  },
  methods: {
    getImgPath(img) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
  },
};
</script>
