<template>
  <v-tabs grow v-model="tab">
    <v-tab>Images</v-tab>
    <v-tab>Submaps</v-tab>
  </v-tabs>
  <v-divider />
  <v-card width="60vw" variant="text" class="mx-auto mt-4">
    <v-window v-model="tab">
      <v-window-item>
        <div class="text-h6 text-center">Submit Image</div>
        <p v-if="!hasImageAccess" class="pa-6">
          In the interests of security and maintaining a positive and safe experience, we ask that
          you request image upload access from the developers. For the time being, this can be done
          by contacting me (beeftime) on the LANCER Discord server. With access, you will be able to
          submit images, which will be hosted in the cloud and made publicly accessible.
          <br />
          <br />
          If you have any questions or concerns, please feel free to reach out at any time via my
          contact information on the About page.
        </p>

        <div v-else>
          <v-alert icon="mdi-information" density="compact" variant="tonal">
            <p>
              Images are hosted in the cloud and are publicly accessible. For this reason, please
              ensure that you have the right to use the image you are submitting.
            </p>
            <ul class="ml-8">
              <li>Images must be in a web-readable format and are restricted to 5MB in size.</li>
              <li>Explicit or inappropriate content will not be tolerated.</li>
              <li>AI generated content is forbidden.</li>
            </ul>
          </v-alert>

          <v-row class="my-3">
            <v-col>
              <v-file-input v-model="image" label="Image" />
              <v-text-field v-model="title" label="Nautilus-only Image Title" density="compact" />
              <v-text-field v-model="artist" label="Artist name or Attribution" density="compact" />
              <v-select
                :items="['Ship', 'POI', 'Hull', 'Crew']"
                v-model="type"
                label="Image Tag"
                density="compact" />
              <v-text-field v-model="link" label="Artist site or link" density="compact" />
              <v-checkbox v-model="canSubmit" hide-details>
                <template #label>
                  <div class="text-caption pl-2">
                    By clicking this checkbox you verify that you own or have the right to use this
                    image.
                  </div>
                </template>
              </v-checkbox>
              <v-btn
                color="accent"
                variant="tonal"
                block
                class="mt-4"
                :disabled="!image || !canSubmit"
                @click="submitImage">
                Submit
              </v-btn>
            </v-col>
            <v-col>
              <v-card variant="outlined" class="pa-1" style="height: 100%">
                <v-img v-if="image" />
                <div v-else class="text-center text-disabled" style="padding-top: 52%">
                  No image
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-window-item>
      <v-window-item>
        <div class="text-h6 text-center">Submit Submap SVG</div>
        <p class="pa-6">
          At the current time, submap submission is not available. This feature is planned for a
          future update, and will allow users to submit custom submaps for use in the map editor. In
          the meantime, submap SVGs can be created and shared via the LANCER Discord server. If they
          are appropriate for use, I can manually add them to the map editor.
        </p>
      </v-window-item>
    </v-window>
  </v-card>
  <v-footer app fixed>
    <v-btn
      to="/main/editor/overview"
      color="accent"
      variant="tonal"
      size="x-small"
      prepend-icon="mdi-arrow-left"
      class="mx-3">
      Back
    </v-btn>
  </v-footer>
</template>

<script lang="ts">
import { useUserStore } from '../../stores/userStore';

export default {
  name: 'AddImage',
  props: {
    init: { type: String, required: true },
  },
  watch: {
    init: {
      immediate: true,
      handler(val) {
        this.tab = Number(val);
      },
    },
  },
  data: () => ({
    tab: 0,
    image: null,
    artist: '',
    title: '',
    type: '',
    link: '',
    canSubmit: false,
  }),
  computed: {
    hasImageAccess() {
      return useUserStore().image_submission;
    },
  },
  methods: {
    submitImage() {
      console.log('nyi');
    },
  },
};
</script>
