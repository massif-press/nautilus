<template>
  <v-btn color="success" class="ml-1" size="x-small" @click="accept(item)">Accept</v-btn>
  <v-dialog width="60vw">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="warning" class="ml-1" size="x-small">Req. Changes</v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
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
          <v-btn color="success" variant="text" @click="requestChanges(item, isActive)">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-dialog width="60vw">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="error" class="ml-1" size="x-small">Reject</v-btn>
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
          <v-btn color="success" variant="text" @click="reject(item, isActive)">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { useUserStore } from '../../stores/userStore';

export default {
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    accept(item) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Accepted';
      item.LastModTouch = new Date();

      console.log('accept', item);
      console.log('nyi');
    },
    requestChanges(item, isActive) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Changes Requested';
      item.LastModTouch = new Date();

      console.log('request changes', isActive);
      console.log('nyi');
      isActive.value = false;
    },
    reject(item, isActive) {
      item.LastModId = useUserStore().user_id;
      item.Status = 'Rejected';
      item.LastModTouch = new Date();

      console.log('reject', isActive);
      console.log('nyi');
      isActive.value = false;
    },
  },
};
</script>
