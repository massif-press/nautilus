<template>
  <v-data-iterator :items="filteredImages" :items-per-page="itemsPerPage">
    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
      <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable />

        <div class="d-flex align-center">
          <v-btn class="me-8" variant="text" @click="onClickSeeAll">
            <span class="text-decoration-underline text-none">See all</span>
          </v-btn>

          <div class="d-inline-flex">
            <v-btn
              :disabled="page === 1"
              class="me-2"
              icon="mdi-arrow-left"
              size="small"
              variant="tonal"
              @click="prevPage"></v-btn>

            <v-btn
              :disabled="page === pageCount"
              icon="mdi-arrow-right"
              size="small"
              variant="tonal"
              @click="nextPage"></v-btn>
          </div>
        </div>
      </h1>
    </template>

    <template v-slot:default="{ items }">
      <v-row>
        <v-col v-for="item in items" cols="6" sm="4" xl="2">
          <v-sheet border>
            <v-img :src="getSrc(item.raw)" height="250" cover></v-img>
            <v-table class="text-caption" density="compact">
              <tbody>
                <tr align="right">
                  <th>{{ (item.raw as any).artist }}</th>
                  <td>{{ (item.raw as any).link }}</td>
                </tr>
                <tr align="right">
                  <th />
                  <td><v-chip v-for="tag in item.raw.tags" :text="tag" size="x-small" /></td>
                </tr>
                <tr align="right">
                  <th />
                  <td>
                    {{ getUser(item.raw).Name }}
                    {{ new Date(item.raw.created_at).toLocaleString() }}
                    <div v-if="item.raw.deleted_at" class="text-error">
                      Deleted at
                      {{ new Date(item.raw.deleted_at).toLocaleString() }}
                    </div>
                  </td>
                </tr>
                <tr align="right">
                  <th>
                    <v-dialog width="50vw">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" size="x-small" block variant="tonal" color="error">
                          Delete
                        </v-btn>
                      </template>
                      <template #default="{ isActive }">
                        <v-card>
                          <v-card-text>Confirm Delete</v-card-text>
                          <v-divider />
                          <v-card-actions>
                            <v-btn @click="isActive.value = false">Cancel</v-btn>
                            <v-spacer />
                            <v-btn
                              color="error"
                              :loading="loading"
                              @click="deleteImage(item.raw, isActive)">
                              Delete
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </th>
                  <td>
                    <v-dialog width="50vw">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" size="x-small" block variant="tonal" color="accent">
                          Edit
                        </v-btn>
                      </template>
                      <template #default="{ isActive }">
                        <v-card>
                          <v-toolbar density="compact" color="primary">
                            <v-toolbar-title>Edit Image</v-toolbar-title>
                            <v-spacer />
                            <v-btn icon @click="isActive.value = false">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-toolbar>
                          <v-card-text>
                            <v-text-field
                              v-model="(item.raw as any).title"
                              label="Nautilus-only Image Title"
                              density="compact" />
                            <v-text-field
                              v-model="(item.raw as any).artist"
                              label="Artist name or Attribution"
                              density="compact" />
                            <v-text-field
                              v-model="(item.raw as any).link"
                              label="Artist site or link"
                              density="compact" />
                            <v-combobox
                              v-model="(item.raw as any).tags"
                              multiple
                              chips
                              label="Type"
                              :items="['Ship', 'POI', 'Hull', 'Crew']"
                              density="compact" />

                            <v-btn
                              color="accent"
                              variant="tonal"
                              block
                              class="mt-4"
                              :loading="loading"
                              @click="updateImage(item.raw, isActive)">
                              Submit
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-dialog>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </v-col>
      </v-row>
    </template>

    <template v-slot:footer="{ page, pageCount }">
      <v-footer class="justify-space-between text-body-2 mt-4">
        Total user images: {{ images.length }}
        <div>Page {{ page }} of {{ pageCount }}</div>
      </v-footer>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import { getImages, postImageMetadata } from '../../api';
import { useDataStore } from '../../stores/dataStore';

export default {
  name: 'ImageManger',
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 24,
    search: '',
    loading: false,
    images: [],
  }),
  async mounted() {
    await this.getImages();
  },
  computed: {
    filteredImages() {
      if (!this.search) return this.images;
      return this.images.filter((image) => {
        return (
          image.title.toLowerCase().includes(this.search.toLowerCase()) ||
          image.artist.toLowerCase().includes(this.search.toLowerCase()) ||
          image.uploader.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    async getImages() {
      this.loading = true;
      try {
        this.images = await getImages();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    getSrc(item) {
      if (!item.key) return `/img/nodata.png`;
      return `${(import.meta as any).env.VITE_APP_DISTRIBUTION}images/${item.key}`;
    },
    getUser(item) {
      return useDataStore().author(item.uploader);
    },
    onClickSeeAll() {
      this.itemsPerPage = this.itemsPerPage === 4 ? this.images.length : 4;
    },
    async deleteImage(image, isActive) {
      this.loading = true;
      image.key = '';
      image.deleted_at = Date.now();

      await postImageMetadata(image);
      isActive.value = false;
      this.loading = false;
    },
    async updateImage(image, isActive) {
      this.loading = true;
      await postImageMetadata(image);
      isActive.value = false;
      this.loading = false;
    },
  },
};
</script>
