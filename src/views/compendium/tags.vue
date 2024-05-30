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
          <v-chip-group v-model="t_selections" multiple column>
            <v-chip
              v-for="s in all_selections"
              :value="s.value"
              :text="s.title"
              :color="t_selections.includes(s.value) ? 'accent' : ''"
              label
              size="small" />
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card>
    <v-card-text>
      <div v-for="tag in filteredTags" class="mb-3">
        <tag-card :tag="tag" />
      </div>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useCompendiumStore } from '../../compendiumStore';
import TagCard from './cards/tagCard.vue';

export default {
  name: 'Tags',
  components: { TagCard },
  props: {
    type: { type: String, default: 'ship' },
  },
  data: () => ({
    all_selections: [
      { title: 'Ship', value: 'ship' },
      { title: 'Point of Interest', value: 'poi' },
    ],
    t_selections: [],
    search: '',
  }),
  mounted() {
    if (this.type === 'ship') {
      this.t_selections = ['ship'];
    } else if (this.type === 'poi') {
      this.t_selections = ['poi'];
    } else this.t_selections = this.all_selections.map((s) => s.value);
  },
  computed: {
    filteredTags() {
      return _.filter(this.tags, (tag) => {
        if (tag.AppliesTo.some((a) => this.t_selections.includes(a))) {
          if (!this.search) return true;
          return tag.Name.toLowerCase().includes(this.search.toLowerCase());
        }
      });
    },
    tags() {
      return useCompendiumStore().tags;
    },
  },
};
</script>
