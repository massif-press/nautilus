<template>
  <v-container>
    <v-card border flat variant="text" class="pa-2">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="ma-1"
            item-text="name"
            density="compact"
            variant="outlined"
            rounded
            hide-details
            clearable />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-chip-group v-model="sw_selections" multiple :items="shipwrights" column>
            <v-chip
              v-for="s in shipwrights"
              :value="s.ID"
              :text="s.Name"
              :color="sw_selections.includes(s.ID) ? 'accent' : ''"
              label
              size="small" />
          </v-chip-group>
        </v-col>
      </v-row>
      <v-select
        v-model="cl_selections"
        :items="classes"
        density="compact"
        multiple
        hide-details
        prepend-icon="mdi-filter">
        <template #selection="{ item, index }">
          <v-chip v-if="index < 7" size="small">
            {{ item.title }}
          </v-chip>
          <span v-if="index === 7" class="text-grey text-caption align-self-center">
            (+{{ cl_selections.length - 7 }} others)
          </span>
        </template>
        <template #prepend-item>
          <v-list-item title="Select All" @click="selectAllClass">
            <template #prepend>
              <v-icon
                :icon="
                  cl_selections.length === 0
                    ? 'mdi-checkbox-blank-outline'
                    : cl_selections.length === classes.length
                    ? 'mdi-checkbox-marked'
                    : 'mdi-minus-box-outline'
                " />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </v-card>

    <v-card-text>
      <div v-for="hull in filteredHulls" class="mb-3">
        <hull-card :hull="hull" />
      </div>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useCompendiumStore } from '../../compendiumStore';
import HullCard from './cards/hullCard.vue';

export default {
  name: 'Hulls',
  components: { HullCard },
  data: () => ({
    sw_selections: [],
    cl_selections: [],
    search: '',
  }),
  mounted() {
    this.sw_selections = this.shipwrights.map((s) => s.ID);
    this.cl_selections = this.classes;
  },
  computed: {
    filteredHulls() {
      return this.hulls.filter(
        (h) =>
          this.sw_selections.includes(h.Shipwright.ID) &&
          this.cl_selections.includes(h.Class) &&
          (this.search === '' || h.Name.toLowerCase().includes(this.search.toLowerCase()))
      );
    },
    hulls() {
      return useCompendiumStore().hulls;
    },
    shipwrights() {
      return useCompendiumStore().shipwrights.filter((s) =>
        this.hulls.some((h) => h.Shipwright.ID === s.ID)
      );
    },
    classes() {
      return _.uniq(this.hulls.map((h) => h.Class));
    },
  },
  methods: {
    selectAllClass() {
      this.cl_selections = this.cl_selections.length === this.classes.length ? [] : this.classes;
    },
  },
};
</script>
