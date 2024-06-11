<template>
  <compendium-item-editor :item="cargo">
    <v-row>
      <v-col cols="8">
        <v-text-field hide-details v-model="cargo.Name" label="Name" />
      </v-col>
      <v-col>
        <v-select hide-details v-model="cargo.CargoType" :items="cargoTypes" label="Type" />
      </v-col>
    </v-row>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Description</div>
      <v-textarea hide-details v-model="cargo.Description" />
    </div>
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Cargo, CargoTypes } from '../../models/compendium/cargo';
import { useCompendiumStore } from '../../stores/compendiumStore';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';

export default {
  name: 'CargoEditor',
  components: {
    CompendiumItemEditor,
  },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    cargo: {} as Cargo,
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.cargo = new Cargo();
        } else {
          this.cargo = useCompendiumStore().getCargoById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.cargo = new Cargo();
    } else {
      this.cargo = useCompendiumStore().getCargoById(this.id);
    }
  },
  computed: {
    cargoTypes() {
      return CargoTypes.map((x) => ({ title: x.title, props: { subtitle: x.description } }));
    },
  },
};
</script>
