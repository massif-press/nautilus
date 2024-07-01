<template>
  <v-card border rounded="b-0" style="position: relative">
    <v-btn
      v-if="item.IsUserOwned && item.ImageSrc"
      icon
      color="error"
      variant="tonal"
      size="x-small"
      @click="removeImage"
      style="position: absolute; top: -6px; right: -6px; z-index: 1">
      <v-icon size="x-large">mdi-close</v-icon>
    </v-btn>
    <v-img v-if="item.ImageSrc" :src="item.ImageSrc" height="250" cover></v-img>
    <div v-else class="d-flex justify-center align-center" style="height: 250px">
      <v-icon x-large>mdi-image-off</v-icon>
    </div>
  </v-card>
  <v-btn
    v-if="item.IsUserOwned"
    block
    variant="tonal"
    rounded="t-0"
    color="accent"
    size="x-small"
    @click="dialog = true">
    Set Item Image
  </v-btn>
  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>Set Image for {{ item.Title || item.Name }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-iterator :items="filteredImages" :items-per-page="itemsPerPage">
          <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  rounded
                  width="600"
                  variant="outlined"
                  hide-details
                  clearable />
              </v-col>
              <v-col cols="auto" class="ml-auto">
                <v-select
                  :items="['Ship', 'POI', 'Hull', 'Crew']"
                  v-model="imageType"
                  multiple
                  hide-details
                  width="300"
                  label="Image Tag"
                  density="compact" />
              </v-col>
              <v-col cols="auto">
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
              </v-col>
            </v-row>
          </template>

          <template v-slot:default="{ items }">
            <v-row>
              <v-col v-for="item in items" cols="6" sm="4" xl="2">
                <v-hover>
                  <template #default="{ isHovering, props }">
                    <v-sheet
                      v-bind="props"
                      :color="isHovering ? 'accent' : ''"
                      :border="isHovering ? 'md' : ''"
                      style="cursor: pointer"
                      @click="selectImage(item.raw)">
                      <v-img :src="(item.raw as any).src" height="250" cover></v-img>
                      <v-table class="text-caption" density="compact">
                        <tbody>
                          <tr align="right">
                            <th>
                              <v-btn
                                v-if="(item.raw as any).link"
                                variant="plain"
                                color="accent"
                                icon
                                size="x-small"
                                class="mr-n1 ml-n4 mt-n1"
                                :href.stop="(item.raw as any).link"
                                target="_blank">
                                <v-icon icon="mdi-link" />
                              </v-btn>
                              {{ (item.raw as any).artist }}
                            </th>

                            <td>{{ (item.raw as any).title }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-sheet>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer="{ page, pageCount }">
            <v-footer>
              <v-spacer />
              <div>Page {{ page }} of {{ pageCount }}</div>
            </v-footer>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'ImageManger',
  props: {
    item: { type: Object, required: true },
    tag: { type: String, required: false, default: '' },
  },
  data: () => ({
    dialog: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 12,
    search: '',
    imageType: [],
    images: [],
  }),
  mounted() {
    this.imageType = this.tag ? [this.tag] : [];
  },
  computed: {
    filteredImages() {
      let images = this.images;
      if (this.search)
        images = images.filter((image) => {
          return (
            image.title.toLowerCase().includes(this.search.toLowerCase()) ||
            image.artist.toLowerCase().includes(this.search.toLowerCase()) ||
            image.uploader.toLowerCase().includes(this.search.toLowerCase())
          );
        });

      if (this.imageType.length)
        images = images.filter((image) => this.imageType.includes(image.type));

      return images;
    },
  },
  methods: {
    selectImage(img) {
      this.item.ImageSrc = img.src;
      this.dialog = false;
    },
    removeImage() {
      this.item.ImageSrc = '';
    },
  },
};
</script>
