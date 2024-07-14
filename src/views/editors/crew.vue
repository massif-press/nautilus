<template>
  <compendium-item-editor :item="crew">
    <v-row>
      <v-col cols="7">
        <v-text-field
          maxlength="80"
          counter
          v-model="crew.Name"
          :readonly="!crew.isUserOwned"
          label="Name" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="40"
          v-model="crew.Pronouns"
          :readonly="!crew.isUserOwned"
          :items="Pronouns"
          label="Pronouns" />
      </v-col>
      <v-col>
        <v-checkbox
          hide-details
          v-model="crew.IsNhp"
          :readonly="!crew.isUserOwned"
          label="Is NHP" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="crew.Role"
          :readonly="!crew.isUserOwned"
          :items="Roles"
          label="Role" />
      </v-col>
      <v-col>
        <v-combobox
          maxlength="80"
          counter
          v-model="crew.Background"
          :items="Backgrounds"
          :readonly="!crew.isUserOwned"
          label="Background" />
      </v-col>
      <v-col cols="auto">
        <div class="text-caption text-disabled ml-n2">Assignment</div>
        <div>
          <span v-if="!crew.Assignment">
            <i class="text-caption text-disabled">None</i>
          </span>
          <v-btn v-else size="small" :to="`/main/map/${crew.Assignment.ID}`">
            {{ (crew.Assignment as any).Title || crew.Assignment.Name }}
          </v-btn>
          <ship-assignment v-if="crew.isUserOwned" :crew="crew" />
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"><image-selector :item="crew" /></v-col>
      <v-col>
        <div class="mx-2 mt-3">
          <div class="text-caption text-disabled ml-n2">Description</div>
          <v-textarea
            maxlength="5500"
            auto-grow
            counter
            :readonly="!crew.isUserOwned"
            v-model="crew.Description" />
        </div>
      </v-col>
    </v-row>

    <detail-editor :item="crew" :detailSuggestions="detailSuggestions" />
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Crew } from '../../models/maps/crew';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';
import { useDataStore } from '../../stores/dataStore';
import DetailEditor from './components/detailEditor.vue';
import ImageSelector from './components/imageSelector.vue';
import ShipAssignment from './components/shipAssignment.vue';

export default {
  name: 'CrewEditor',
  components: {
    CompendiumItemEditor,
    DetailEditor,
    ImageSelector,
    ShipAssignment,
  },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    crew: {} as Crew,
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.crew = new Crew();
        } else {
          this.crew = useDataStore().getCrewById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.crew = new Crew();
    } else {
      this.crew = useDataStore().getCrewById(this.id);
    }
  },
  computed: {
    Roles() {
      return _.uniq(useDataStore().crew.map((c) => c.Role));
    },
    Backgrounds() {
      return _.uniq(useDataStore().crew.map((c) => c.Background));
    },
    Pronouns() {
      return ['He/Him', 'She/Her', 'They/Them'];
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
