<template>
  <v-container class="px-12">
    <div class="text-center">
      <div class="text-h3">{{ item.Title || item.Name }}</div>
      <div class="text-caption mb-n2">
        Review Status:
        <b class="text-success">{{ item.Status }}</b>
      </div>
    </div>
    <v-divider class="my-4" />

    <slot />

    <v-footer app style="position: fixed">
      <v-spacer />

      <v-tooltip location="top" open-delay="300" width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="error" size="small" @click="deleteItem">
            Delete Item
          </v-btn>
        </template>
        <b class="text-black">
          Removes this item from local data and flags this item for deletion. Deletion will occur on
          next update if you are the only contributing author.
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
            @click="save">
            Save Changes
          </v-btn>
        </template>
        <b class="text-black">
          Saves changes to local data. This will not be reflected on the server until you publish.
        </b>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300" max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="accent" size="small" @click="publish">
            Publish Changes
          </v-btn>
        </template>
        <b class="text-black">
          Submit all changes to the server. These changes will be reflected in the live map on the
          next update and this item will be flagged for review.
        </b>
      </v-tooltip>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'EditorBase',
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    deleteItem() {
      console.log('nyi');
    },
    save() {
      console.log('nyi');
    },
    publish() {
      console.log('nyi');
    },
  },
};
</script>
