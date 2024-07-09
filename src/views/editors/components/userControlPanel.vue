<template>
  <div>
    <v-btn
      :size="large ? '' : 'x-small'"
      :block="large"
      variant="tonal"
      color="accent"
      prepend-icon="mdi-pencil"
      @click="dialog = true">
      edit user info
    </v-btn>

    <br v-if="user.is_mod" />
    <v-btn v-if="user.is_mod" size="x-small" color="purple" prepend-icon="mdi-star" to="/main/mod">
      Mod Tools
    </v-btn>
  </div>
  <v-dialog v-model="dialog" max-width="75vw">
    <v-card>
      <v-toolbar density="compact" color="primary" extended>
        <v-toolbar-title>
          <span class="headline">User Control Panel</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template #extension>
          <span class="pl-6">
            {{ user.user_id }}
            <v-btn icon size="x-small" variant="plain" class="ma-n1">
              <v-icon icon="mdi-content-copy" @click="copyID" />
            </v-btn>
          </span>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="user.username" label="Nickname" density="compact">
                <template #prepend>
                  <v-tooltip max-width="300px" location="top">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-information-outline" />
                    </template>
                    <b>
                      This name will identify you to other users around the app, including item
                      authorship and in comments and suggestions
                    </b>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.attribution"
                label="Attribution"
                density="compact"
                persistent-hint
                @change="dirty = true"
                hint="Optional">
                <template #prepend>
                  <v-tooltip max-width="300px" location="top">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-information-outline" />
                    </template>
                    <b>
                      This is the name/handle/alias you will be credited as in thanks and
                      contributors lists. You can leave this blank if you don't want to be
                      acknowledged.
                    </b>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="5">
              <v-text-field
                v-model="user.discord"
                label="Discord Handle"
                density="compact"
                persistent-hint
                @change="dirty = true"
                hint="Optional" />
            </v-col>
            <v-col cols="auto" class="ml-3">
              <v-switch
                v-model="user.show_discord"
                label="Show Discord Handle"
                color="accent"
                hide-details
                :disabled="!user.discord.length"
                @change="dirty = true"
                density="compact" />
              <div class="text-caption text-disabled mt-n3 ml-10">
                <i>
                  Your Discord handle is
                  <span v-if="user.show_discord">
                    <b class="text-accent">visible</b>
                    to
                  </span>
                  <span v-else>
                    <b>hidden</b>
                    from
                  </span>
                  other users
                </i>
              </div>
            </v-col>
          </v-row>

          <v-alert
            v-if="!user.image_submission"
            density="compact"
            color="primary"
            class="mb-2 mt-8">
            <b>Request Image Submission Permissions</b>
            <br />
            <p>
              For the time being, only verified users can submit images to the app. For
              verification, you must be a Patreon supporter or a member of the LANCER Discord in
              good standing. If you are a member of the Discord, please provide your Discord handle
              above and we will verify your status. If you are a Patreon supporter, please message
              me via Patreon.
            </p>
            <div class="text-right">
              <v-btn color="accent" size="small" disabled @click="requestImage">
                Request Permissions
              </v-btn>
            </div>
          </v-alert>
        </v-container>
        <v-row align="center" justify="end">
          <v-col cols="auto">
            <v-btn variant="tonal" color="accent" prepend-icon="mdi-download" @click="exportAll">
              export all data
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-file-input
              v-model="importFile"
              accept=".json"
              color="accent"
              variant="solo-filled"
              label="Import Data"
              density="compact"
              width="300px"
              hide-details
              prepend-inner-icon="mdi-upload"
              prepend-icon=""
              @change="importAll" />
          </v-col>
        </v-row>

        <v-alert
          density="compact"
          variant="outlined"
          color="grey"
          class="text-center text-caption mt-6">
          <div>
            Your account was created on
            <i>{{ new Date(user.created_at).toLocaleString() }}</i>
            and last updated at
            <i>{{ new Date(user.updated_at).toLocaleString() }}</i>
          </div>
          <div>
            Your registered e-mail is:
            <span class="text-accent">{{ user.email }}</span>
            .
            <b>This is hidden from all other users</b>
            but is included here for account troubleshooting.
          </div>
          <i>User passwords can be reset in COMP/CON</i>
        </v-alert>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
        <v-spacer />
        <v-btn
          color="success"
          variant="tonal"
          prepend-icon="mdi-content-save"
          :disabled="!dirty"
          @click="updateUser">
          Update User Info
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar" :color="toastColor" rounded="md" location="bottom">
    <div>{{ toastMessage }}</div>
    <template #actions>
      <v-btn variant="text" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { useDataStore } from '../../../stores/dataStore';
import { useUserStore } from '../../../stores/userStore';

export default {
  data: () => ({
    dialog: false,
    importFile: null,
    snackbar: false,
    toastMessage: '',
    toastColor: 'error',
    dirty: false,
  }),
  props: {
    large: Boolean,
  },
  computed: {
    user() {
      return useUserStore();
    },
  },
  methods: {
    async updateUser() {
      try {
        await useUserStore().updateUser();
        this.toastMessage = 'User info updated';
        this.toastColor = 'success';
        this.snackbar = true;
      } catch (e) {
        this.toastMessage = e.message;
        this.toastColor = 'error';
        this.snackbar = true;
      } finally {
        this.dirty = false;
      }
    },
    copyID() {
      navigator.clipboard.writeText(this.user.user_id);
    },
    requestImage() {
      console.log('request image');
    },
    async exportAll() {
      const jsondata = await useDataStore().exportAll();
      console.log(jsondata);
      const blob = new Blob([jsondata], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nautilus_user_export.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    importAll() {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse((e.target as any).result);
        useDataStore().importAll(data);
      };
      reader.readAsText(this.importFile);
    },
  },
};
</script>
