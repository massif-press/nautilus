<template>
  <div>
    <v-btn
      size="x-small"
      variant="tonal"
      color="accent"
      prepend-icon="mdi-pencil"
      @click="dialog = true">
      edit user info
    </v-btn>
    <br v-if="user.is_mod" />
    <v-btn v-if="user.is_mod" size="x-small" color="purple" prepend-icon="mdi-star" to="/main/mod">
      Mod Dashboard
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
                  <v-tooltip max-width="300px">
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
                hint="Optional">
                <template #prepend>
                  <v-tooltip max-width="300px">
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
                hint="Optional" />
            </v-col>
            <v-col cols="auto" class="ml-3">
              <v-switch
                v-model="user.show_discord"
                label="Show Discord Handle"
                color="accent"
                hide-details
                :disabled="!user.discord.length"
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

          <v-alert v-if="!user.image_submission" density="compact" color="primary" class="my-2">
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
              <v-btn color="accent" size="small" @click="requestImage">Request Permissions</v-btn>
            </div>
          </v-alert>

          <v-alert
            density="compact"
            variant="outlined"
            color="grey"
            class="text-center text-caption mt-6">
            <i>User passwords can be reset in COMP/CON</i>
          </v-alert>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
        <v-spacer />
        <v-btn color="success" variant="tonal" prepend-icon="mdi-content-save" @click="updateUser">
          Update User Info
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useUserStore } from '../../../stores/userStore';

export default {
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    user() {
      return useUserStore();
    },
  },
  methods: {
    updateUser() {
      console.log('update user');
    },
    copyID() {
      navigator.clipboard.writeText(this.user.user_id);
    },
    requestImage() {
      console.log('request image');
    },
  },
};
</script>
