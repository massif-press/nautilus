<template>
  <div v-if="!item" class="ma-12">
    <v-alert color="error" border variant="outlined" icon="mdi-alert-circle">
      <span>Item not found</span>
    </v-alert>
  </div>
  <div v-else>
    <v-footer border="b">
      <v-spacer />
      <v-tabs v-model="tab" height="32px">
        <v-tab>Data</v-tab>
        <v-tab>
          <v-badge inline color="primary" :content="comments.length">Comments&nbsp;</v-badge>
        </v-tab>
      </v-tabs>
    </v-footer>
    <v-container class="px-12">
      <div class="text-center">
        <div class="text-h3">{{ item.Title || item.Name }}</div>
        <div class="text-caption mb-n2">
          By
          <b>{{ item.Author.Name }}</b>
          <discord-chip :author="item.Author" class="ml-2" />
          <span class="px-3">//</span>
          Review Status:
          <b :class="`text-${statusColor}`">{{ item.Status }}</b>
        </div>
      </div>
      <v-divider class="my-4" />

      <v-window v-model="tab">
        <v-window-item>
          <div v-if="item.DeleteTime" class="my-3">
            <v-alert dense border color="error" variant="tonal" icon="mdi-delete">
              <span class="text-caption">
                This item has been marked for deletion and will be removed shortly after
                {{ item.DeleteTime }}.
              </span>
            </v-alert>
          </div>

          <div v-if="showModComment" class="my-3">
            <v-alert
              dense
              border
              :color="item.Status === 'Submitted' ? 'success' : 'warning'"
              variant="tonal"
              :icon="item.Status === 'Submitted' ? 'mdi-check-circle' : 'mdi-comment-alert'">
              <b class="pr-2">Mod Comment:</b>
              <span>
                {{ item.ModComment }}
              </span>
              <div v-if="commentingMod && item.LastModTouch" class="text-right text-caption">
                <b>{{ commentingMod.Name }}</b>
                @ {{ item.LastModTouch.toLocaleString() }}
              </div>
            </v-alert>
          </div>

          <v-card v-if="isDev" color="pink-lighten-2" variant="outlined" class="py-1 px-3">
            <div class="text-caption">Dev Tools</div>
            <v-row>
              <v-col>
                <v-text-field v-model="item.ID" label="ID" density="compact" hide-details />
              </v-col>
              <v-col v-if="item.ItemType === 'tag'">
                <v-text-field
                  v-model="item.Enables"
                  label="Enables"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col v-if="item.ItemType === 'tag'">
                <v-checkbox
                  v-model="item.Implemented"
                  label="Implemented"
                  density="compact"
                  hide-details />
              </v-col>
            </v-row>
          </v-card>

          <slot />

          <v-footer
            v-if="item.isUserOwned || showModButtons"
            app
            style="position: fixed"
            border="t">
            <mod-item-buttons v-if="showModButtons" :item="item" />
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
                    :disabled="item.PreventDelete || !!item.DeleteTime"
                    @click="deleteItem">
                    Delete Item
                  </v-btn>
                </template>
                <b class="text-black">
                  Flags this item for deletion. Deletion will occur within 24 hours. Publishing
                  again will cancel the deletion.
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
                    @click="save()">
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
                  Submit all changes to the server. These changes will be reflected in the live map
                  on the next update and this item will be flagged for review.
                </b>
              </v-tooltip>
            </div>
          </v-footer>
        </v-window-item>
        <v-window-item>
          <comments-page :item="item" :comments="comments" @refresh="getComments" />
        </v-window-item>
      </v-window>
    </v-container>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
      class="pa-0">
      <v-alert :icon="snackbar.icon" variant="outlined">{{ snackbar.text }}</v-alert>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { useDataStore } from '../../../stores/dataStore';
import CommentsPage from './commentsPage.vue';
import { useUserStore } from '../../../stores/userStore';
import ModItemButtons from '../../mod/modItemButtons.vue';
import { getComments, updateItem } from '../../../api';
import { GetItem } from '../../../storage';
import DiscordChip from '../../../_components/discordChip.vue';

export default {
  name: 'EditorBase',
  props: {
    item: { type: Object, required: true },
  },
  components: {
    CommentsPage,
    ModItemButtons,
    DiscordChip,
  },
  data: () => ({
    tab: 0,
    comments: [],
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
  }),
  async mounted() {
    this.getComments();
  },
  watch: {
    item() {
      this.getComments();
    },
  },
  computed: {
    isMod() {
      return useUserStore().is_mod;
    },
    isDev() {
      return useUserStore().dev_access;
    },
    showModButtons() {
      if (this.item.Status === 'Unpublished') return false;
      return this.isMod;
    },
    statusColor() {
      if (this.item.Status === 'Unpublished') return 'grey';
      if (this.item.Status === 'Approved') return 'success';
      if (this.item.Status === 'Submitted') return 'accent';
      if (this.item.Status === 'Rejected') return 'pink';
      if (this.item.Status === 'Flagged for Deletion') return 'error';
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
    async getComments() {
      this.comments = await getComments(this.item.ID);
    },
    async deleteItem() {
      this.item.Delete();
      await this.save(true);
      const data = await GetItem(this.item.ID);
      await updateItem(this.item.ID, data);

      // useDataStore().deleteItem(this.item);

      this.snackbar.show = true;
      this.snackbar.text = 'Item flagged for removal.';
      this.snackbar.color = 'error';
      this.snackbar.icon = 'mdi-delete-forever';
    },
    async save(skipToast = false) {
      await useDataStore().saveItem(this.item);

      if (skipToast) return;
      this.snackbar.show = true;
      this.snackbar.text = 'Item saved to local data';
      this.snackbar.color = '#2E7D32';
      this.snackbar.icon = 'mdi-check-circle';
      this.$router.push(this.$router.currentRoute.value.path.replace(/[^/]+$/, this.item.ID));
    },
    async publish() {
      const cachedStatus = this.item.Status;
      try {
        this.item.Status = 'Submitted';
        this.item.DeletedAt = null;
        await this.save(true);
        const data = await GetItem(this.item.ID);
        await updateItem(this.item.ID, data);

        this.snackbar.show = true;
        this.snackbar.text = 'Item submitted for review';
        this.snackbar.color = '#1976D2';
        this.snackbar.icon = 'mdi-send';
        this.$router.push(this.$router.currentRoute.value.path.replace(/[^/]+$/, this.item.ID));
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
