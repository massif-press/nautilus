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
          <div class="text-caption text-disabled text-right">
            <i>
              Showing {{ filteredSubmaps.length }} of {{ submaps.length }} points of interest from
              {{ authors.length }} authors
            </i>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-card-text>
      <v-row>
        <v-col cols="3" v-for="s in filteredSubmaps">
          <v-dialog>
            <template #activator="{ props }">
              <v-card flat border v-bind="props">
                <v-img :src="getImgPath(s.img)" height="200px" />
                <v-divider class="my-1" />
                <div class="text-caption pb-1 px-2">{{ s.name }}</div>
                <div class="text-caption mt-n2 px-2">
                  // {{ getAuthor(s).Name }}
                  <v-chip
                    size="x-small"
                    variant="tonal"
                    color="accent"
                    v-if="getAuthor(s).Discord"
                    start>
                    {{ s.Discord }}
                  </v-chip>
                </div>
              </v-card>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar density="compact">
                  <v-toolbar-title>{{ s.name }}</v-toolbar-title>
                  <v-spacer />
                  <v-btn icon @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-img :src="getImgPath(s.img)" height="80vh" />
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useCompendiumStore } from '../../stores/compendiumStore';

export default {
  name: 'SubmapSelector',
  props: {
    selected: { type: Object, required: false },
  },
  emits: ['select'],
  data: () => ({
    search: '',
    dialog: false,
  }),
  computed: {
    submaps() {
      return useCompendiumStore().submaps;
    },
    filteredSubmaps() {
      if (!this.search) return this.submaps;
      return this.submaps.filter((s) => s.name.toLowerCase().includes(this.search.toLowerCase()));
    },
    authors() {
      return _.uniq(this.submaps.map((s) => s.author));
    },
  },
  methods: {
    getImgPath(img: string) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    getAuthor(submap: any) {
      return useCompendiumStore().author(submap.author);
    },
  },
};
</script>
