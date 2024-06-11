<template>
  <compendium-item-editor :item="hull">
    <v-row>
      <v-col cols="6">
        <v-text-field hide-details v-model="hull.Name" label="Name" />
      </v-col>
      <v-col>
        <v-combobox hide-details v-model="hull.Class" :items="Classes" label="Class" />
      </v-col>
      <v-col cols="2">
        <v-text-field hide-details v-model="hull.Code" label="Code" />
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
          :hint="hull.Size.description"
          label="Size" />
      </v-col>
      <v-col>
        <v-combobox
          hide-details
          v-model="hull.Shipwright"
          :items="Shipwrights"
          label="Shipwright" />
      </v-col>
    </v-row>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Description</div>
      <v-textarea hide-details v-model="hull.Description" />
    </div>

    <fieldset
      class="pa-1 mt-2"
      style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
      <legend class="text-caption text-disabled ml-2 px-1">Additional Tags</legend>
      <tag-selector :selected="hull.Tags" type="ship" @select="hull.Tags.push($event)" />
    </fieldset>

    <fieldset
      class="pa-1 mt-2"
      style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
      <legend class="text-caption text-disabled ml-2 px-1">Submaps</legend>
      <submap-editor :item="hull" />
    </fieldset>
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Hull, HullSizes } from '../../models/compendium/hull';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';
import { useCompendiumStore } from '../../stores/compendiumStore';
import TagSelector from './components/tagSelector.vue';
import SubmapEditor from './components/submapEditor.vue';

export default {
  name: 'HullEditor',
  components: {
    CompendiumItemEditor,
    TagSelector,
    SubmapEditor,
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
          this.hull = useCompendiumStore().getHullById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.hull = new Hull();
    } else {
      this.hull = useCompendiumStore().getHullById(this.id);
    }
  },
  computed: {
    Classes() {
      return _.uniq(useCompendiumStore().hulls.map((h) => h.Class));
    },
    Shipwrights() {
      return _.uniq(useCompendiumStore().hulls.map((h) => h.Shipwright));
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
