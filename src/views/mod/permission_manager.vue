<template>
  <v-data-table :headers="headers" :items="requests" :search="search" :items-per-page="-1">
    <template #item.author="{ item }">
      {{ getAuthor(item.ID).Name }}
    </template>
    <template #item.btn="{ item }">
      <v-btn size="small" variant="tonal" color="accent" class="mx-2" @click="approve(item)">
        Approve
      </v-btn>
      <v-btn size="small" variant="tonal" color="error" @click="deny(item)">Deny</v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'ItemQueue',
  components: {},
  data: () => ({
    search: '',
    headers: [
      { title: 'User', value: 'Name' },
      { title: 'Discord', value: 'Discord' },
      { title: 'Author Info', value: 'author' },
      { title: 'Image Permission', value: 'btn' },
    ],
  }),
  computed: {
    requests() {
      return [
        {
          Name: 'Test',
          ID: '123',
          Discord: 'Discord',
        },
      ];
    },
  },
  methods: {
    getAuthor(id) {
      return useDataStore().author(id);
    },
  },
};
</script>
