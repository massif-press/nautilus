<template>
  <v-tabs v-model="tab" density="compact" bg-color="primary">
    <v-tab v-for="t in tabs" size="small">{{ t }}</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item v-for="t in tabs">
      <v-card-text>
        <v-row>
          <v-col>
            <div class="text-caption text-disabled mt-n2">Shown</div>
            <div class="border-e" style="height: 500px; overflow-y: scroll">
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
              class="mt-2"
              size="x-small"
              @click="hideAll(t)">
              Hide All
            </v-btn>
          </v-col>
          <v-col>
            <div class="text-caption text-disabled mt-n2">Hidden</div>
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
              class="mt-2"
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
import { useMapStore } from '../../stores/mapStore';
import { Poi } from '../../models/poi';

export default {
  name: 'ShipFilter',
  props: {
    filters: Object,
    map: Object,
  },
  data: () => ({
    tab: 0,
    tabs: ['Owner', 'Type', 'Size', 'Tags', 'Author'],
    shownOwner: [],
    hiddenOwner: [],
    shownType: [],
    hiddenType: [],
    shownSize: [],
    hiddenSize: [],
    shownTags: [],
    hiddenTags: [],
    shownAuthor: [],
    hiddenAuthor: [],
  }),
  mounted() {
    this.shownOwner = [...this.owners];
    this.shownType = [...this.poitypes];
    this.shownSize = [...this.sizes];
    this.shownTag = [...this.tags];
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
    pois() {
      return useMapStore().pois.filter((s: Poi) => s.Location.map === this.map.ID);
    },
    owners() {
      return _.uniq(this.pois.map((h) => h.Owner));
    },
    poitypes() {
      return _.uniq(this.pois.map((p) => p.PoiType));
    },
    tags() {
      return _.uniq(this.pois.map((s) => s.ItemTags).flat()).map((t) => t.Name);
    },
    sizes() {
      return _.uniq(this.pois.map((p) => p.Size));
    },
    authors() {
      return _.uniq(this.pois.map((s) => s.Author));
    },
    filterObject() {
      return {
        Owner: this.hiddenOwner,
        Type: this.hiddenType,
        Size: this.hiddenSize,
        Tags: this.hiddenTags,
        Author: this.hiddenAuthor,
      };
    },
  },
  methods: {
    hide(type: string, index: number) {
      this[`hidden${type}`].push(this[`shown${type}`][index]);
      this[`shown${type}`].splice(index, 1);
      console.log(this.filterObject);
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
      this.shownType = [...this.poitypes];
      this.shownSize = [...this.sizes];
      this.shownTag = [...this.tags];
      this.shownAuthor = [...this.authors];

      this.$emit('set-filter', {});
    },
  },
};
</script>
