<template>
  <v-tabs grow density="compact" v-model="tab">
    <v-tab>Item Queue</v-tab>
    <v-tab>Manage Permissions</v-tab>
    <v-tab>Manage Images</v-tab>
    <v-tab>Transfer Items</v-tab>
  </v-tabs>
  <v-divider />
  <div class="px-6 py-3">
    <v-window v-model="tab">
      <v-window-item><item-queue /></v-window-item>
      <v-window-item><permission-manager /></v-window-item>
      <v-window-item><image-manager /></v-window-item>
      <v-window-item><transfer-items /></v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts">
import ImageManager from './image_manager.vue';
import ItemQueue from './item_queue.vue';
import PermissionManager from './permission_manager.vue';
import TransferItems from './transfer_items.vue';

export default {
  name: 'ModDashboard',
  components: {
    ItemQueue,
    PermissionManager,
    TransferItems,
    ImageManager,
  },
  data: () => ({
    tab: 0,
  }),
};
</script>
