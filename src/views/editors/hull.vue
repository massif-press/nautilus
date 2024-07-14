<template>
  <compendium-item-editor :item="hull">
    <v-row>
      <v-col cols="6">
        <v-text-field
          maxlength="80"
          counter
          v-model="hull.Name"
          :readonly="!hull.isUserOwned"
          label="Name" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="hull.Class"
          :readonly="!hull.isUserOwned"
          :items="Classes"
          label="Class" />
      </v-col>
      <v-col cols="2">
        <v-text-field
          maxlength="6"
          counter
          v-model="hull.Code"
          :readonly="!hull.isUserOwned"
          label="Code" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="hull.Size"
          :items="Sizes"
          return-object
          item-title="name"
          persistent-hint
          :readonly="!hull.isUserOwned"
          :hint="(hull.Size as any).description"
          label="Size" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="hull.Shipwright"
          :readonly="!hull.isUserOwned"
          :items="Shipwrights"
          label="Shipwright" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"><image-selector :item="hull" /></v-col>
      <v-col>
        <div class="mx-2 mt-3">
          <div class="text-caption text-disabled ml-n2">Description</div>
          <v-textarea
            maxlength="5500"
            auto-grow
            counter
            :readonly="!hull.isUserOwned"
            v-model="hull.Description" />
        </div>
      </v-col>
    </v-row>

    <fieldset
      v-if="hull.Tags.length > 0 || hull.isUserOwned"
      class="pa-1 mt-2"
      style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
      <legend class="text-caption text-disabled ml-2 px-1 mb-n3">Additional Tags</legend>
      <tag-selector
        :readonly="!hull.isUserOwned"
        :selected="hull.Tags"
        type="ship"
        @select="hull.Tags.push($event)" />
    </fieldset>

    <fieldset
      v-if="hull.Submaps.length > 0 || hull.isUserOwned"
      class="pa-1 mt-2"
      style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
      <legend class="text-caption text-disabled ml-2 px-1 mb-n3">Submaps</legend>
      <submap-editor :item="hull" />
    </fieldset>
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Hull, HullSizes } from '../../models/compendium/hull';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';
import { useDataStore } from '../../stores/dataStore';
import TagSelector from './components/tagSelector.vue';
import SubmapEditor from './components/submapEditor.vue';
import ImageSelector from './components/imageSelector.vue';

export default {
  name: 'HullEditor',
  components: {
    CompendiumItemEditor,
    TagSelector,
    SubmapEditor,
    ImageSelector,
  },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    hull: {} as Hull,
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.hull = new Hull();
        } else {
          this.hull = useDataStore().getHullById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.hull = new Hull();
    } else {
      this.hull = useDataStore().getHullById(this.id);
    }
  },
  computed: {
    Classes() {
      return _.uniq(useDataStore().hulls.map((h) => h.Class));
    },
    Shipwrights() {
      return _.uniq(useDataStore().hulls.map((h) => h.Shipwright));
    },
    Sizes() {
      return HullSizes;
    },
    detailSuggestions() {
      return [
        { title: 'Appearance', body: '' },
        { title: 'Biography', body: '' },
        { title: 'Recognition', body: '' },
      ];
    },
  },
};
</script>
