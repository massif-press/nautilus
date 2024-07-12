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
      </v-row>
    </v-card>
    <v-card-text>
      <div v-for="tag in filteredTags" class="mb-3">
        <v-card color="transparent" flat @click="$router.push(`/main/editor/edit/tag/${tag.ID}`)">
          <tag-card :tag="tag" />
        </v-card>
      </div>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
import TagCard from './cards/tagCard.vue';

export default {
  name: 'Tags',
  components: { TagCard },
  data: () => ({
    all_selections: [
      { title: 'Ship', value: 'ship' },
      { title: 'Point of Interest', value: 'poi' },
    ],
    t_selections: [] as string[],
    search: '',
  }),
  mounted() {
    this.t_selections = this.all_selections.map((s) => s.value);
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
      return useDataStore().tags.filter((x) => x.isPublicVisible);
    },
    authors() {
      return _.uniqBy(this.tags, 'Author.Name').map((t) => t.Author.Name);
    },
  },
};
</script>
