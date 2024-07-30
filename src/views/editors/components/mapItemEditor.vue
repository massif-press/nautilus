<template>
  <editor-base :item="item">
    <v-row justify="center">
      <v-col xl="8" cols="12">
        <v-card border variant="tonal" class="pa-2 mb-4">
          <v-row>
            <v-col cols="6">
              <v-select
                density="compact"
                hide-details
                variant="outlined"
                v-model="item.Location.map"
                item-title="Name"
                item-value="ID"
                :items="maps"
                :readonly="!item.isUserOwned"
                label="Map" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                variant="outlined"
                v-model="item.Location.coords[0]"
                :readonly="!item.isUserOwned"
                @update:modelValue="handleYCheck()"
                hide-details
                label="Y Position"
                type="number" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                variant="outlined"
                hide-details
                v-model="item.Location.coords[1]"
                :readonly="!item.isUserOwned"
                @update:modelValue="handleXCheck()"
                label="X Position"
                type="number" />
            </v-col>
            <v-col cols="auto">
              <v-menu width="300px">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="plain"
                    size="small"
                    :disabled="!item.IsUserOwned">
                    <v-icon size="large" :icon="item.Icon.icon" />
                  </v-btn>
                </template>
                <v-card variant="outlined">
                  <v-card-text>
                    <v-row dense>
                      <v-col v-for="icon in icons" :key="icon">
                        <v-btn size="small" icon variant="text" @click="item.Icon.icon = icon">
                          <v-icon size="x-large" :icon="icon" />
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
            <v-col cols="auto">
              <color-picker :item="item.Icon" :readonly="!item.isUserOwned" />
            </v-col>
          </v-row>
        </v-card>

        <slot />

        <v-row>
          <v-col cols="4"><image-selector :item="item" /></v-col>
          <v-col>
            <slot name="right" />
          </v-col>
        </v-row>

        <slot name="mid" />

        <detail-editor :item="item" :detailSuggestions="detailSuggestions" />

        <fieldset
          v-if="(item.Tags && item.Tags.length > 0) || item.isUserOwned"
          class="pa-1 mt-2"
          style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
          <legend class="text-caption text-disabled ml-2 px-1 mb-n3">Additional Tags</legend>
          <tag-selector
            :selected="item.ItemTags"
            :readonly="!item.isUserOwned"
            :type="item.ItemType"
            @select="item.ItemTags.push($event)" />
        </fieldset>

        <slot name="bottom" />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import _ from 'lodash';
import TagSelector from './tagSelector.vue';
import { useDataStore } from '../../../stores/dataStore';
import SubmapEditor from './submapEditor.vue';
import EditorBase from './editorBase.vue';
import DetailEditor from './detailEditor.vue';
import ImageSelector from './imageSelector.vue';
import ColorPicker from './colorPicker.vue';
import { useUserStore } from '../../../stores/userStore';

export default {
  name: 'MapItemEditor',
  components: { EditorBase, TagSelector, SubmapEditor, DetailEditor, ImageSelector, ColorPicker },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    detailSuggestions: [
      { title: 'Description', body: '' },
      { title: 'History', body: '' },
      { title: 'Technical Information', body: '' },
    ],
  }),
  computed: {
    maps() {
      if (useUserStore().dev_access) return useDataStore().maps;
      return useDataStore().maps.filter((x) => x.IsPublic);
    },
    icons() {
      if (this.item.ItemType === 'ship') return ['cc:ship', 'mdi-delta', 'mdi-triangle'];
      else
        return [
          'mdi-circle',
          'mdi-circle-outline',
          'mdi-circle-double',
          'mdi-square',
          'mdi-square-outline',
          'mdi-triangle',
          'mdi-triangle-outline',
          'mdi-star',
          'mdi-star-outline',
          'mdi-star-four-points',
          'mdi-star-four-points-outline',
          'mdi-star-three-points',
          'mdi-star-three-points-outline',
          'mdi-hexagon',
          'mdi-hexagon-outline',
          'mdi-pentagon',
          'mdi-pentagon-outline',
          'mdi-octagon',
          'mdi-octagon-outline',
          'mdi-octagram',
          'mdi-octagram-outline',
          'mdi-rhombus',
          'mdi-rhombus-outline',
          'mdi-rhombus-medium',
          'mdi-rhombus-medium-outline',
          'mdi-rhombus-split',
          'mdi-rhombus-split-outline',
          'mdi-arrow-up-bold',
          'mdi-arrow-down-bold',
          'mdi-arrow-left-bold',
          'mdi-arrow-right-bold',
        ];
    },
  },
  methods: {
    handleXCheck() {
      const cache = Number(this.item.Location.coords[1]);
      if (Math.abs(cache) > 800) this.item.Location.coords[1] = cache > 0 ? 800 : -800;
    },
    handleYCheck() {
      const cache = Number(this.item.Location.coords[0]);
      if (Math.abs(cache) > 800) this.item.Location.coords[0] = cache > 0 ? 800 : -800;
    },
  },
};
</script>
