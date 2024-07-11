<template>
  <div v-if="!map && !isDev" class="ma-12">
    <v-alert color="error" border variant="outlined" icon="mdi-alert-circle">
      <span>Map not found</span>
    </v-alert>
  </div>
  <div v-else>
    <v-alert
      color="warning"
      border
      variant="outlined"
      density="compact"
      class="my-1 mx-4"
      icon="mdi-alert-outline">
      <span>
        Maps are editable by anyone with developer access and changes are published immediately. If
        you run into any issues, contact Beef.
      </span>
    </v-alert>
    <v-container class="px-12">
      <div class="text-center">
        <div class="text-h3">{{ map.Name }}</div>
        <v-row dense justify="space-between" class="mt-1 text-caption">
          <v-col cols="auto">
            Created by {{ map.Author.Name }} on {{ map.CreatedAt.toLocaleString() }}
          </v-col>
          <v-col cols="auto">
            Last updated by {{ map.UpdatedBy.Name }} on {{ map.UpdatedAt.toLocaleString() }}
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-4" />

      <v-row align="center">
        <v-col cols="6">
          <v-text-field hide-details v-model="map.Name" label="Name" />
        </v-col>
        <v-col>
          <v-text-field hide-details v-model="map.Subtitle" label="Subtitle" />
        </v-col>
        <v-col>
          <v-text-field hide-details v-model="map.Control" label="Control" />
        </v-col>
        <v-col cols="auto">
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon variant="text">
                <v-icon size="40" :color="map.Color" icon="mdi-square" />
              </v-btn>
            </template>
            <v-color-picker v-model="map.Color" hide-details />
          </v-menu>
        </v-col>
      </v-row>

      <div class="text-caption my-4">
        <v-textarea hide-details v-model="map.Description" label="Description" rows="3" auto-grow />
      </div>

      <v-card>
        <terrain-editor :map="map" />
      </v-card>

      <v-footer app style="position: fixed" border="t">
        <v-spacer />

        <v-btn variant="tonal" color="accent" size="small" :disabled="!isDev" @click="publish">
          Save and Publish
        </v-btn>
      </v-footer>
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
import { getUser, updateItem } from '../../../api';
import { SystemMap } from '../../../models/maps/systemMap';
import { GetItem } from '../../../storage';
import { useDataStore } from '../../../stores/dataStore';
import { useUserStore } from '../../../stores/userStore';
import TerrainEditor from './terrainEditor.vue';

export default {
  name: 'MapEditor',
  props: {
    id: { type: String, required: true },
  },
  components: {
    TerrainEditor,
  },
  data: () => ({
    map: {} as SystemMap,
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.map = new SystemMap();
        } else {
          this.map = useDataStore().getMapById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.map = new SystemMap();
    } else {
      this.map = useDataStore().getMapById(this.id);
    }
  },
  computed: {
    isDev() {
      return useUserStore().dev_access;
    },
  },
  methods: {
    async publish() {
      try {
        const validate = await getUser(useUserStore().user_id);

        const userDevCheck =
          validate.dev_key === ((import.meta as any).env.VITE_APP_DEV_KEY as string);

        if (!userDevCheck) {
          this.snackbar.show = true;
          this.snackbar.text = 'You do not have permission to publish this item. Nice try, buddy.';
          this.snackbar.color = '#D32F2F';
          this.snackbar.icon = 'mdi-alert-circle';
          return;
        }

        this.map.Status = 'Approved';
        this.map.DeletedAt = null;

        await useDataStore().saveItem(this.map);

        const data = await GetItem(this.map.ID);
        await updateItem(this.map.ID, data);

        this.snackbar.show = true;
        this.snackbar.text = 'Item published successfully';
        this.snackbar.color = 'success';
        this.snackbar.icon = 'mdi-check-circle';
      } catch (error) {
        console.error(error);
        this.snackbar.show = true;
        this.snackbar.text = 'Failed to submit item';
        this.snackbar.color = '#D32F2F';
        this.snackbar.icon = 'mdi-alert-circle';
      }
    },
  },
};
</script>
