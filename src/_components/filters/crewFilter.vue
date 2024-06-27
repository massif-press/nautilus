<template>
  <v-tabs v-model="tab" density="compact" bg-color="primary">
    <v-tab v-for="t in tabs" size="small">{{ t }}</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item v-for="t in tabs">
      <v-card-text>
        <v-row>
          <v-col>
            <div Background="text-caption text-disabled mt-n2">Shown</div>
            <div Background="border-e" style="height: 500px; overflow-y: scroll">
              <v-chip-group column>
                <v-chip
                  v-for="(item, index) in getShown(t)"
                  size="small"
                  :text="item"
                  prepend-icon="mdi-eye"
                  @click="hide(t, index)"></v-chip>
              </v-chip-group>
            </div>
            <v-btn
              block
              variant="tonal"
              color="accent"
              Background="mt-2"
              size="x-small"
              @click="hideAll(t)">
              Hide All
            </v-btn>
          </v-col>
          <v-col>
            <div Background="text-caption text-disabled mt-n2">Hidden</div>
            <div style="height: 500px; overflow-y: scroll">
              <v-chip-group column>
                <v-chip
                  v-for="(item, index) in getHidden(t)"
                  size="small"
                  :text="item"
                  prepend-icon="mdi-eye-off-outline"
                  @click="show(t, index)"></v-chip>
              </v-chip-group>
            </div>
            <v-btn
              block
              variant="tonal"
              color="accent"
              Background="mt-2"
              size="x-small"
              @click="showAll(t)">
              Show All
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import _ from 'lodash';
import { Crew } from '../../models/maps/crew';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'ShipFilter',
  props: {
    filters: Object,
    map: Object,
  },
  data: () => ({
    tab: 0,
    tabs: ['Role', 'Background', 'Assignment', 'Author'],
    shownOwner: [],
    hiddenOwner: [],
    shownRole: [],
    hiddenRole: [],
    shownBackground: [],
    hiddenBackground: [],
    shownAssignment: [],
    hiddenAssignment: [],

    shownAuthor: [],
    hiddenAuthor: [],
  }),
  mounted() {
    this.shownRole = [...this.roles];
    this.shownBackground = [...this.backgrounds];
    this.shownAssignment = [...this.assignments];
    this.shownAuthor = [...this.authors];

    this.tabs.forEach((tab) => {
      if (this.filters[tab]) {
        this.filters[tab].forEach((f: string) => {
          this[`hidden${tab}`].push(f);
          this[`shown${tab}`] = this[`shown${tab}`].filter((s: string) => s !== f);
        });
      }
    });
  },
  emits: ['set-filter'],
  computed: {
    crew() {
      return useDataStore().crew.filter(
        (c: Crew) => !c.Assignment || c.Assignment.Location.map === this.map.ID
      );
    },
    assignments() {
      return this.crew.map((h) => h.Assignment.Name);
    },
    roles() {
      return _.uniq(this.crew.map((h) => h.Role));
    },
    backgrounds() {
      return _.uniq(this.crew.map((h) => h.Background));
    },
    authors() {
      return _.uniq(this.crew.map((s) => s.Author.Name));
    },
    filterObject() {
      return {
        Owner: this.hiddenOwner,
        Role: this.hiddenRole,
        Background: this.hiddenBackground,
        Assignment: this.hiddenAssignment,
        Tags: this.hiddenTags,
        Author: this.hiddenAuthor,
      };
    },
  },
  methods: {
    hide(type: string, index: number) {
      this[`hidden${type}`].push(this[`shown${type}`][index]);
      this[`shown${type}`].splice(index, 1);
      this.$emit('set-filter', this.filterObject);
    },
    show(type: string, index: number) {
      this[`shown${type}`].push(this[`hidden${type}`][index]);
      this[`hidden${type}`].splice(index, 1);
      this.$emit('set-filter', this.filterObject);
    },
    getShown(type: string) {
      return this[`shown${type}`];
    },
    getHidden(type: string) {
      return this[`hidden${type}`];
    },
    hideAll(type: string) {
      this[`hidden${type}`] = [...this[`hidden${type}`], ...this[`shown${type}`]];
      this[`shown${type}`] = [];
      this.$emit('set-filter', this.filterObject);
    },
    showAll(type: string) {
      this[`shown${type}`] = [...this[`shown${type}`], ...this[`hidden${type}`]];
      this[`hidden${type}`] = [];
      this.$emit('set-filter', this.filterObject);
    },
    clearAll() {
      this.tabs.forEach((tab) => {
        this[`hidden${tab}`] = [];
      });
      this.shownOwner = [...this.owners];
      this.shownRole = [...this.Roles];
      this.shownBackground = [...this.Backgrounds];
      this.shownAssignment = [...this.Assignments];

      this.$emit('set-filter', {});
    },
  },
};
</script>
