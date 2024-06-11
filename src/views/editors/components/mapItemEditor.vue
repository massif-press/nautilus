<template>
  <editor-base :item="item">
    <v-row justify="center">
      <v-col xl="8" cols="12">
        <v-card border variant="tonal" class="pa-1 mb-4">
          <v-row>
            <v-col cols="6">
              <v-select
                density="compact"
                hide-details
                v-model="item.Location.map"
                item-title="Name"
                item-value="id"
                :items="maps"
                label="Map" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                hide-details
                v-model="item.Location.coords[0]"
                label="Y Position"
                type="number" />
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                hide-details
                v-model="item.Location.coords[1]"
                label="X Position"
                type="number" />
            </v-col>
          </v-row>
        </v-card>

        <slot />

        <fieldset
          class="pa-1 mt-2"
          style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
          <legend class="text-caption text-disabled ml-2 px-1">Item Detail</legend>
          <div v-for="item in item.Details" class="mt-4 border">
            <v-row dense>
              <v-col>
                <v-text-field
                  placeholder="Title (Optional)"
                  hide-details
                  density="compact"
                  v-model="item.title" />
              </v-col>
              <v-col cols="auto" class="text-right" align-self="center">
                <v-btn
                  variant="tonal"
                  size="x-small"
                  color="error"
                  class="py-5 ml-n2 rounded-0"
                  @click="item.Details.splice(item.Details.indexOf(item), 1)">
                  <v-icon size="x-large" class="mt-n2" icon="mdi-delete" />
                </v-btn>
              </v-col>
            </v-row>
            <v-textarea hide-details density="compact" auto-grow v-model="item.body" />
          </div>
          <div class="text-right">
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
                  :title="suggestion.title"
                  @click="item.Details.push(suggestion)" />
                <v-list-item title="Other" @click="item.Details.push({ title: '', body: '' })" />
              </v-list>
            </v-menu>
          </div>
        </fieldset>

        <fieldset
          class="pa-1 mt-2"
          style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
          <legend class="text-caption text-disabled ml-2 px-1">Additional Tags</legend>
          <tag-selector
            :selected="item.ItemTags"
            :type="item.ItemType"
            @select="item.ItemTags.push($event)" />
        </fieldset>

        <fieldset
          class="pa-1 mt-2"
          style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
          <legend class="text-caption text-disabled ml-2 px-1">Submaps</legend>
          <submap-editor :item="item" :no-add="item.ItemType === 'ship'" />
        </fieldset>
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import _ from 'lodash';
import TagSelector from './tagSelector.vue';
import { useMapStore } from '../../../stores/mapStore';
import SubmapEditor from './submapEditor.vue';
import EditorBase from './editorBase.vue';

export default {
  name: 'MapItemEditor',
  components: { EditorBase, TagSelector, SubmapEditor },
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
      return useMapStore().maps;
    },
  },
  methods: {
    deleteItem() {
      console.log('nyi');
    },
    save() {
      console.log('nyi');
    },
    publish() {
      console.log('nyi');
    },
  },
};
</script>
