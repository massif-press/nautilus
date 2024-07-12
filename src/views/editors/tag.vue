<template>
  <compendium-item-editor :item="tag">
    <div class="text-center mt-2 mb-4">
      <i v-if="!tag.Implemented" class="text-disabled">Not Yet Implemented</i>
      <b v-else class="text-success">Implemented</b>
    </div>
    <v-row>
      <v-col cols="8">
        <v-text-field
          maxlength="150"
          counter
          v-model="tag.Name"
          :readonly="!tag.isUserOwned"
          label="Name" />
      </v-col>
      <v-col>
        <v-select
          multiple
          chips
          hide-details
          :readonly="!tag.isUserOwned"
          v-model="tag.AppliesTo"
          :items="AppliesTo"
          label="Applicable To" />
      </v-col>
    </v-row>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Description</div>
      <v-textarea
        maxlength="5500"
        auto-grow
        counter
        v-model="tag.Description"
        :readonly="!tag.isUserOwned" />
    </div>

    <div v-if="tag.isUserOwned" class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Implementation Details</div>

      <v-alert
        density="compact"
        prominent
        icon="mdi-information-outline"
        variant="tonal"
        color="warning">
        <div class="text-caption">
          Tags with mechanical effects will require implementation in code, and so could take some
          time to become available. In order to expedite this process, please be as clear and
          detailed as possible when describing the effects of this tag -- what it should do, how it
          should work, and so on.
        </div>
      </v-alert>
      <v-textarea maxlength="5500" auto-grow counter v-model="tag.ImplementationDetails" />
    </div>
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Tag } from '../../models/compendium/tag';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'TagEditor',
  components: {
    CompendiumItemEditor,
  },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    tag: {} as Tag,
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.tag = new Tag();
        } else {
          this.tag = useDataStore().getTagById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.tag = new Tag();
    } else {
      this.tag = useDataStore().getTagById(this.id);
    }
  },
  computed: {
    AppliesTo() {
      return [
        { title: 'Point of Interest', value: 'poi' },
        { title: 'Ship', value: 'ship' },
      ];
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
