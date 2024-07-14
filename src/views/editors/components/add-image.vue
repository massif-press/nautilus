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
        <!-- <p v-if="!hasImageAccess" class="pa-6"> -->
        <p v-if="false" class="pa-6">
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
              <v-file-input v-model="image" label="Image" accept="image/*" @change="processImage" />
              <v-text-field
                v-model="title"
                maxlength="100"
                label="Nautilus-only Image Title"
                density="compact" />
              <v-text-field
                v-model="artist"
                maxlength="100"
                label="Artist name or Attribution"
                density="compact" />
              <v-combobox
                :items="['Ship', 'POI', 'Hull', 'Crew']"
                v-model="tags"
                maxlength="200"
                label="Image Tags"
                chips
                multiple
                density="compact" />
              <v-text-field
                v-model="link"
                maxlength="80"
                label="Artist site or link"
                density="compact" />
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
              <v-fade-transition>
                <v-progress-linear
                  v-if="loading"
                  v-model="loadingProgress"
                  color="accent"
                  height="30"
                  rounded="xl"
                  class="mt-4" />
              </v-fade-transition>
            </v-col>
            <v-col>
              <v-card variant="outlined" class="pa-1" style="height: 100%">
                <v-img v-if="imageData" :src="imageData" />
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
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top right"
    class="pa-0">
    <v-alert :icon="snackbar.icon" variant="outlined">{{ snackbar.text }}</v-alert>
  </v-snackbar>
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
import { v4 as uuid } from 'uuid';
import { getImagePresign, postImageMetadata } from '../../../api';
import { useUserStore } from '../../../stores/userStore';

async function uploadImageToS3(presignedUrl, file) {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to S3');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

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
    imageData: null,
    artist: '',
    title: '',
    tags: [],
    link: '',
    canSubmit: false,
    loading: false,
    loadingProgress: 0,
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
  }),
  computed: {
    hasImageAccess() {
      return useUserStore().image_submission;
    },
  },
  methods: {
    async submitImage() {
      this.loading = true;
      try {
        const filename = this.image.name;
        const key = `${uuid().substring(0, 8)}_${filename}`;
        const res = await getImagePresign(key);

        this.loadingProgress = 25;

        await uploadImageToS3(res, this.image);

        this.loadingProgress = 75;

        await postImageMetadata({
          id: uuid(),
          key,
          title: this.title,
          artist: this.artist,
          tags: this.tags,
          link: this.link,
          uploader: useUserStore().user_id,
          created_at: Date.now(),
        });

        this.loadingProgress = 100;

        this.snackbar = {
          show: true,
          text: 'Image submitted successfully!',
          color: 'success',
          icon: 'mdi-check',
        };
        this.reset();
      } catch (error) {
        console.error('Error submitting image:', error);
        this.snackbar = {
          show: true,
          text: 'Failed to submit image.',
          color: 'error',
          icon: 'mdi-alert',
        };
      } finally {
        this.loading = false;
        this.loadingProgress = 0;
      }
    },
    processImage() {
      if (this.image) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(this.image);
      }
    },

    reset() {
      this.image = null;
      this.imageData = null;
      this.artist = '';
      this.title = '';
      this.tags = [];
      this.link = '';
      this.canSubmit = false;
    },
  },
};
</script>
