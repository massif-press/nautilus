<template>
  <compendium-item-editor :item="crew">
    <v-row>
      <v-col cols="8">
        <v-text-field hide-details v-model="crew.Name" label="Name" />
      </v-col>
      <v-col>
        <v-combobox hide-details v-model="crew.Pronouns" :items="Pronouns" label="Pronouns" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-combobox hide-details v-model="crew.Role" :items="Roles" label="Role" />
      </v-col>
      <v-col>
        <v-combobox
          hide-details
          v-model="crew.Background"
          :items="Backgrounds"
          label="Background" />
      </v-col>
      <v-col cols="auto">
        <div class="text-caption text-disabled ml-n2">Assignment</div>
        <div>
          <span v-if="!crew.Assignment">
            <i class="text-caption text-disabled">Unassigned</i>
          </span>
          <v-btn
            v-else
            size="small"
            color="accent"
            variant="tonal"
            :to="`/main/map/${crew.Assignment.ID}`">
            {{ (crew.Assignment as any).Title || crew.Assignment.Name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Description</div>
      <v-textarea hide-details v-model="crew.Description" />
    </div>

    <fieldset
      class="pa-1 mt-2"
      style="border: solid rgba(150, 150, 150, 0.3) 1px; border-radius: 3px">
      <legend class="text-caption text-disabled ml-2 px-1">Item Detail</legend>
      <div v-for="item in crew.Details" class="mt-4 border">
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
              @click="crew.Details.splice(crew.Details.indexOf(item), 1)">
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
              @click="crew.Details.push(suggestion)" />
            <v-list-item title="Other" @click="crew.Details.push({ title: '', body: '' })" />
          </v-list>
        </v-menu>
      </div>
    </fieldset>
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Crew } from '../../models/maps/crew';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';
import { useMapStore } from '../../stores/mapStore';

export default {
  name: 'CrewEditor',
  components: {
    CompendiumItemEditor,
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
          this.crew = useMapStore().getCrewById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.crew = new Crew();
    } else {
      this.crew = useMapStore().getCrewById(this.id);
    }
  },
  computed: {
    Roles() {
      return _.uniq(useMapStore().crew.map((c) => c.Role));
    },
    Backgrounds() {
      return _.uniq(useMapStore().crew.map((c) => c.Background));
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
