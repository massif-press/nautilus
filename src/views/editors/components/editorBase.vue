<template>
  <v-container class="px-12">
    <div class="text-center">
      <div class="text-h3">{{ item.Title }}</div>
      <div class="text-caption mb-n2">
        Review Status:
        <b class="text-success">{{ item.Status }}</b>
      </div>
    </div>
    <v-divider class="my-4" />
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

        <!-- <div class="text-caption text-disabled">Crew</div> -->
        <!-- <div class="mx-2">crew editor</div> -->

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
          <submap-editor :item="item" />
        </fieldset>
      </v-col>
    </v-row>
    <v-footer app style="position: fixed">
      <v-spacer />

      <v-tooltip location="top" open-delay="300" width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="error" size="small" @click="deleteItem">
            Delete Item
          </v-btn>
        </template>
        <b class="text-black">
          Removes this item from local data and flags this item for deletion. Deletion will occur on
          next update if you are the only contributing author.
        </b>
      </v-tooltip>
      <v-tooltip location="top" open-delay="300" max-width="300px">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="success"
            size="small"
            class="mx-4"
            @click="save">
            Save Changes
          </v-btn>
        </template>
        <b class="text-black">
          Saves changes to local data. This will not be reflected on the server until you publish.
        </b>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300" max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="accent" size="small" @click="publish">
            Publish Changes
          </v-btn>
        </template>
        <b class="text-black">
          Submit all changes to the server. These changes will be reflected in the live map on the
          next update and this item will be flagged for review.
        </b>
      </v-tooltip>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import TagSelector from './tagSelector.vue';
import { useMapStore } from '../../../stores/mapStore';
import SubmapEditor from './submapEditor.vue';

export default {
  name: 'EditorBase',
  components: { TagSelector, SubmapEditor },
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
