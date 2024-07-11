<template>
  <div class="text-right">
    <v-btn size="x-small" color="primary" @click="getRequests()">Reload</v-btn>
  </div>
  <v-data-table
    :headers="headers"
    :items="hydratedRequests"
    :search="search"
    :loading="loading"
    :items-per-page="-1">
    <template #item.author="{ item }">
      {{ getAuthor(item.ID).Name }}
    </template>
    <template #item.btn="{ item }">
      <v-btn
        size="small"
        variant="tonal"
        :loading="loading"
        color="accent"
        class="mx-2"
        @click="approve(item)">
        Approve
      </v-btn>
      <v-btn size="small" variant="tonal" :loading="loading" color="error" @click="deny(item)">
        Deny
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { deleteRequest, getRequests, updateUser } from '../../api';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'PermissionQueue',
  data: () => ({
    search: '',
    loading: false,
    headers: [
      { title: 'User', value: 'Name' },
      { title: 'Discord', value: 'Discord' },
      { title: 'Image Permission', value: 'btn' },
    ],
    requests: [],
  }),
  async mounted() {
    await this.getRequests();
  },
  computed: {
    hydratedRequests() {
      return this.requests.map((r) => this.getAuthor(r.id));
    },
  },
  methods: {
    getAuthor(id) {
      return useDataStore().author(id);
    },
    async getRequests() {
      this.loading = true;
      try {
        this.requests = await getRequests();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async approve(item) {
      this.loading = true;
      try {
        await updateUser(item.ID, { img_key: (import.meta as any).env.VITE_APP_IMG_KEY });
        await deleteRequest(item.ID);
        await this.getRequests();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async deny(item) {
      this.loading = true;
      try {
        await deleteRequest(item.ID);
        await this.getRequests();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
