<template>
  <v-btn
    v-if="item.Status !== 'Approved'"
    color="success"
    :loading="loading"
    class="ml-1"
    size="x-small"
    @click="accept(item)">
    Approve
  </v-btn>
  <v-dialog width="60vw">
    <template #activator="{ props }">
      <v-btn
        v-if="item.Status !== 'Changes Requested'"
        v-bind="props"
        color="warning"
        :loading="loading"
        class="ml-1"
        size="x-small">
        Req. Changes
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card style="position: absolute; top: 15vh; left: 0; right: 0">
        <v-toolbar density="compact" color="warning">
          <v-toolbar-title>
            Request Changes &mdash; {{ (item as any).Title || (item as any).Name }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-textarea v-model="item.ModComment" label="Reason" hide-details />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn
            color="success"
            variant="text"
            :loading="loading"
            @click="requestChanges(item, isActive)">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-dialog width="60vw">
    <template #activator="{ props }">
      <v-btn
        v-if="item.Status !== 'Rejected'"
        v-bind="props"
        color="error"
        :loading="loading"
        class="ml-1"
        size="x-small">
        Reject
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar density="compact" color="error">
          <v-toolbar-title>
            Reject &mdash; {{ (item as any).Title || (item as any).Name }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-textarea v-model="item.ModComment" label="Reason" hide-details />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn color="success" variant="text" :loading="loading" @click="reject(item, isActive)">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top right"
    class="pa-0">
    <v-alert :icon="snackbar.icon" variant="outlined">{{ snackbar.text }}</v-alert>
  </v-snackbar>
</template>

<script lang="ts">
import { updateItem } from '../../api';
import { GetItem } from '../../storage';
import { useUserStore } from '../../stores/userStore';
import { useDataStore } from '../../stores/dataStore';

export default {
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    loading: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
  }),
  methods: {
    async update() {
      this.loading = true;
      try {
        await useDataStore().saveItem(this.item);
        const data = await GetItem(this.item.ID);
        await updateItem(this.item.ID, data);
        this.popSnackbarGood();
      } catch (e) {
        console.error(e);
        this.popSnackbarBad();
      } finally {
        this.loading = false;
      }
    },
    async accept(item) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Approved';
      item.ModComment = '';
      item.LastModTouch = new Date();

      this.update();
    },
    requestChanges(item, isActive) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Changes Requested';
      item.LastModTouch = new Date();

      this.update();
      isActive.value = false;
    },
    reject(item, isActive) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Rejected';
      item.LastModTouch = new Date();

      this.update();
      isActive.value = false;
    },
    popSnackbarGood() {
      this.snackbar.show = true;
      this.snackbar.text = 'Item state change submitted successfully.';
      this.snackbar.color = '#1976D2';
      this.snackbar.icon = 'mdi-check-circle';
    },
    popSnackbarBad() {
      this.snackbar.show = true;
      this.snackbar.text = 'Item state change failed.';
      this.snackbar.color = '#D32F2F';
      this.snackbar.icon = 'mdi-alert-circle';
    },
  },
};
</script>
