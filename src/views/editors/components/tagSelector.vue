<template>
  <v-row dense v-if="selected.length" v-for="t in selected">
    <v-col>
      <tag-card :tag="t" small class="ma-1" />
    </v-col>
    <v-col cols="auto" class="align-self-center">
      <v-btn
        icon
        variant="text"
        size="small"
        color="error"
        @click="selected.splice(selected.indexOf(t), 1)">
        <v-icon size="x-large">mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <div class="text-right">
    <v-dialog v-model="dialog">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" variant="tonal" size="x-small" prepend-icon="mdi-plus">
          Add Tag
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" extended>
          <v-toolbar-title>Select Tag</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template #extension>
            <v-text-field v-model="search" label="Search" />
          </template>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="headers" :items="filteredTags" :items-per-page="-1">
            <template #item.Name="{ item }">
              <v-btn color="secondary" size="small" @click="select(item)">
                {{ item.Name }}
              </v-btn>
            </template>
            <template #item.Tags="{ item }">
              <v-tooltip v-for="tag in item.Tags" location="top">
                <template #activator="{ props }">
                  <v-chip v-bind="props" prepend-icon="mdi-tag">
                    {{ tag.Name }}
                  </v-chip>
                </template>
                <b>{{ tag.Description }}</b>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useCompendiumStore } from '../../../stores/compendiumStore';
import tagCard from '../../compendium/cards/tagCard.vue';

export default {
  name: 'TagSelector',
  components: { tagCard },
  props: {
    selected: { type: Array, required: false },
    type: { type: String, required: true },
  },
  emits: ['select'],
  data: () => ({
    search: '',
    headers: [
      { title: 'Tag', value: 'Name', sortable: true },
      { title: 'Description', value: 'Description', sortable: true },
    ],
    dialog: false,
  }),
  computed: {
    tags() {
      return useCompendiumStore().tags;
    },
    filteredTags() {
      const t = this.tags.filter((h) => h.AppliesTo.includes(this.type));
      return t.filter((h) => h.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    select(tag) {
      this.$emit('select', tag);
      this.dialog = false;
    },
  },
};
</script>
