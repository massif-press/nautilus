<template>
  <v-footer border="b">
    <v-spacer />
    <v-tabs v-model="tab" height="32px">
      <v-tab>Data</v-tab>
      <v-tab>Comments</v-tab>
    </v-tabs>
  </v-footer>
  <v-window v-model="tab">
    <v-window-item>
      <v-container class="px-12">
        <div class="text-center">
          <div class="text-h3">{{ item.Title || item.Name }}</div>
          <div class="text-caption mb-n2">
            Review Status:
            <b :class="`text-${statusColor}`">{{ item.Status }}</b>
          </div>
        </div>
        <div v-if="showModComment" class="my-3">
          <v-alert dense border color="warning" variant="tonal" icon="mdi-comment-alert">
            <b>Mod Comment:</b>
            {{ item.ModComment }}
            <div class="text-right text-caption">
              <b>{{ commentingMod.Name }}</b>
              @ {{ item.LastModTouch.toLocaleString() }}
            </div>
          </v-alert>
        </div>
        <v-divider class="my-4" />

        <slot />

        <v-footer v-if="item.isUserOwned || showModButtons" app style="position: fixed" border="t">
          <ModItemButtons v-if="showModButtons" :item="item" />
          <v-spacer />
          <div v-if="item.isUserOwned">
            <v-tooltip v-if="item.PreventDelete" location="top" open-delay="300" width="300px">
              <template #activator="{ props }">
                <v-icon v-bind="props" color="warning" icon="mdi-alert-circle" />
              </template>
              <b class="text-black">
                This item is referenced by other items and cannot be deleted.
              </b>
            </v-tooltip>

            <v-tooltip location="top" open-delay="300" width="300px">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="tonal"
                  color="error"
                  size="small"
                  :disabled="item.PreventDelete"
                  @click="deleteItem">
                  Delete Item
                </v-btn>
              </template>
              <b class="text-black">
                Removes this item from local data and flags this item for deletion. Deletion will
                occur on next update if you are the only contributing author.
              </b>
            </v-tooltip>
            <v-tooltip location="top" open-delay="300" max-width="300px">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="tonal"
                  color="success"
                  size="small"
                  class="mx-4"
                  :disabled="!item.IsSaveReady"
                  @click="save">
                  Save Changes
                </v-btn>
              </template>
              <b class="text-black">
                Saves changes to local data. This will not be reflected on the server until you
                publish.
              </b>
            </v-tooltip>

            <v-tooltip location="top" open-delay="300" max-width="300px">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="tonal"
                  color="accent"
                  size="small"
                  :disabled="!item.IsSaveReady"
                  @click="publish">
                  Publish Changes
                </v-btn>
              </template>
              <b class="text-black">
                Submit all changes to the server. These changes will be reflected in the live map on
                the next update and this item will be flagged for review.
              </b>
            </v-tooltip>
          </div>
        </v-footer>
      </v-container>
    </v-window-item>
    <v-window-item><comments-page :item="item" /></v-window-item>
  </v-window>
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
import { useDataStore } from '../../../stores/dataStore';
import CommentsPage from './commentsPage.vue';
import { useUserStore } from '../../../stores/userStore';
import ModItemButtons from '../../mod/modItemButtons.vue';
import { updateItem } from '../../../api';
import { GetItem } from '../../../storage';

export default {
  name: 'EditorBase',
  props: {
    item: { type: Object, required: true },
  },
  components: {
    CommentsPage,
    ModItemButtons,
  },
  data: () => ({
    tab: 0,
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
  }),
  computed: {
    isMod() {
      return useUserStore().is_mod;
    },
    showModButtons() {
      if (this.item.Status === 'Approved' || this.item.Status === 'Unpublished') return false;
      return this.isMod;
    },
    statusColor() {
      if (this.item.Status === 'Unpublished') return 'grey';
      if (this.item.Status === 'Approved') return 'success';
      if (this.item.Status === 'Submitted') return 'accent';
      if (this.item.Status === 'Rejected') return 'error';
      return 'warning';
    },
    showModComment() {
      if (!this.item.ModComment) return false;
      if (this.isMod) return true;
      return (
        (this.item.Status === 'Rejected' || this.item.Status === 'Changes Requested') &&
        this.item.ModComment
      );
    },
    commentingMod() {
      return (
        useDataStore().authors.find((x) => x.ID === this.item.LastModId) || {
          Name: 'Unknown Author',
        }
      );
    },
  },
  methods: {
    deleteItem() {
      if (this.item.Collection === 'Compendium') {
        useDataStore().deleteItem(this.item);
      } else useDataStore().deleteItem(this.item);

      this.snackbar.show = true;
      this.snackbar.text = 'Item removed from local data';
      this.snackbar.color = '#F57F17';
      this.snackbar.icon = 'mdi-delete-forever';

      setTimeout(() => this.$router.push('/main/editor/overview'), 1500);
    },
    async save(skipToast = false) {
      await useDataStore().saveItem(this.item);

      if (skipToast) return;
      this.snackbar.show = true;
      this.snackbar.text = 'Item saved to local data';
      this.snackbar.color = '#2E7D32';
      this.snackbar.icon = 'mdi-check-circle';
    },
    async publish() {
      const cachedStatus = this.item.Status;
      try {
        this.item.Status = 'Submitted';
        console.log(this.item.Status);
        await this.save(true);
        const data = await GetItem(this.item.ID);
        console.log(data);
        await updateItem(this.item.ID, data);

        this.snackbar.show = true;
        this.snackbar.text = 'Item submitted for review';
        this.snackbar.color = '#1976D2';
        this.snackbar.icon = 'mdi-send';
      } catch (error) {
        console.error(error);
        this.snackbar.show = true;
        this.snackbar.text = 'Failed to submit item';
        this.snackbar.color = '#D32F2F';
        this.snackbar.icon = 'mdi-alert-circle';

        this.item.Status = cachedStatus;
        this.save(true);
      }
    },
  },
};
</script>
