<template>
  <div class="text-right">
    <v-dialog v-model="dialog" width="75vw">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="accent"
          variant="tonal"
          size="small"
          class="my-2"
          prepend-icon="mdi-pencil">
          Set Submap
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" density="compact" extended>
          <v-toolbar-title>Set Submap</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template #extension>
            <v-text-field
              v-model="search"
              label="Search"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify" />
          </template>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="3" v-for="s in filteredSubmaps">
              <v-card flat border @click="select(s)">
                <v-img :src="getImgPath(s.img)" height="200px" />
                <v-divider class="my-1" />
                <div class="text-caption pb-1 px-2">{{ s.name }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useDataStore } from '../../../stores/dataStore';

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
      return useDataStore().submaps;
    },
    filteredSubmaps() {
      return this.submaps.filter((s) => s.name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    select(submap: any) {
      this.$emit('select', submap);
      this.dialog = false;
    },
    getImgPath(img: string) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
  },
};
</script>
