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
            <v-img :src="(item.raw as any).src" height="250" cover></v-img>
            <v-table class="text-caption" density="compact">
              <tbody>
                <tr align="right">
                  <th>{{ (item.raw as any).artist }}</th>
                  <td>{{ (item.raw as any).link }}</td>
                </tr>
                <tr align="right">
                  <th>Type:</th>
                  <td>{{ (item.raw as any).type }}</td>
                </tr>
                <tr align="right">
                  <th>Uploader:</th>
                  <td>{{ (item.raw as any).uploader }}</td>
                </tr>
                <tr align="right">
                  <th><v-btn size="x-small" block variant="tonal" color="error">Delete</v-btn></th>
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
                              v-model="(item.raw as any).src"
                              label="Image"
                              density="compact" />
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
                            <v-select
                              v-model="(item.raw as any).type"
                              label="Type"
                              :items="['Ship', 'POI', 'Hull', 'Crew']"
                              density="compact" />

                            <v-btn
                              color="accent"
                              variant="tonal"
                              block
                              class="mt-4"
                              @click="updateImage(item.raw)">
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
export default {
  name: 'ImageManger',
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 24,
    search: '',
    images: [
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
        title: 'Desert',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        title: 'Docks',
        artist: 'Erich Behrens',
        uploader: 'John Doe',
        type: 'desert',
        link: 'https://www.vuetifyjs.com',
      },
    ],
  }),
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
    onClickSeeAll() {
      this.itemsPerPage = this.itemsPerPage === 4 ? this.images.length : 4;
    },
    deleteImage() {
      console.log('delete image');
      console.log('nyi');
    },
    updateImage(image) {
      console.log('update image');
      console.log('nyi');
    },
  },
};
</script>
