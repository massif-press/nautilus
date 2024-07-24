<template>
  <compendium-item-editor :item="deployable">
    <v-row align="center">
      <v-col cols="8">
        <v-text-field
          maxlength="80"
          counter
          v-model="deployable.Name"
          :readonly="!deployable.isUserOwned"
          label="Name" />
      </v-col>
      <v-col>
        <v-select
          hide-details
          v-model="deployable.DeployableType"
          :readonly="!deployable.isUserOwned"
          :items="deployableTypes"
          label="Type" />
      </v-col>
      <v-col cols="auto">
        <v-menu width="300px">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="plain"
              size="small"
              :disabled="!deployable.IsUserOwned">
              <v-icon size="large" :icon="deployable.Icon" />
            </v-btn>
          </template>
          <v-card variant="outlined">
            <v-card-text>
              <v-row dense>
                <v-col v-for="icon in icons" :key="icon">
                  <v-btn size="small" icon variant="text" @click="deployable.Icon = icon">
                    <v-icon size="x-large" :icon="icon" />
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              size="small"
              :disabled="!deployable.IsUserOwned">
              <v-icon size="large" :color="deployable.Color" icon="mdi-square" />
            </v-btn>
          </template>
          <v-color-picker v-model="deployable.Color" hide-details />
        </v-menu>
      </v-col>
    </v-row>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">Description</div>
      <v-textarea
        maxlength="5500"
        auto-grow
        counter
        :readonly="!deployable.isUserOwned"
        v-model="deployable.Description" />
    </div>

    <!-- <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">
        Deploy Keywords
        <v-tooltip width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="small" class="mt-n1" icon="mdi-information-outline" />
          </template>
          <b>
            If the parent ship's Mission or Mission Status contains any of these keywords this item
            will be deployed nearby.
          </b>
        </v-tooltip>
      </div>
      <v-chip
        v-for="(keyword, idx) in deployable.DeployKeywords"
        :key="keyword"
        class="ma-1"
        size="small"
        outlined
        :closeable="deployable.isUserOwned"
        @click:close="deployable.DeployKeywords.splice(idx, 1)">
        {{ keyword }}
      </v-chip>
      <v-text-field
        v-if="deployable.isUserOwned"
        maxlength="80"
        counter
        density="compact"
        width="300px"
        class="mt-1"
        :closeable="deployable.isUserOwned"
        v-model="deployKeyword"
        label="Add Deploy Keyword"
        append-icon="mdi-plus-circle-outline"
        @keyup.enter="deployable.DeployKeywords.push(deployKeyword), (deployKeyword = '')"
        @click:append="deployable.DeployKeywords.push(deployKeyword), (deployKeyword = '')" />
    </div>

    <div class="mx-2 mt-3">
      <div class="text-caption text-disabled ml-n2">
        Recall Keywords
        <v-tooltip width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="small" class="mt-n1" icon="mdi-information-outline" />
          </template>
          <b>
            If the parent ship's Mission or Mission Status contains any of these keywords this item
            will not be deployed and remain on the ship. Recall keywords take priority, and will
            cause the item to remain with the ship even if the item would otherwise be deployed.
          </b>
        </v-tooltip>
      </div>
      <v-chip
        v-for="(keyword, idx) in deployable.RecallKeywords"
        :key="keyword"
        class="ma-1"
        size="small"
        outlined
        :closeable="deployable.isUserOwned"
        @click:close="deployable.RecallKeywords.splice(idx, 1)">
        {{ keyword }}
      </v-chip>
      <v-text-field
        v-if="deployable.isUserOwned"
        maxlength="80"
        counter
        density="compact"
        width="300px"
        class="mt-1"
        hide-details
        v-model="recallKeyword"
        label="Add Recall Keyword"
        append-icon="mdi-plus-circle-outline"
        @keyup.enter="deployable.RecallKeywords.push(recallKeyword), (recallKeyword = '')"
        @click:append="deployable.RecallKeywords.push(recallKeyword), (recallKeyword = '')" />
    </div> -->
  </compendium-item-editor>
</template>

<script lang="ts">
import _ from 'lodash';
import { Deployable, DeployableTypes } from '../../models/compendium/deployable';
import { useDataStore } from '../../stores/dataStore';
import CompendiumItemEditor from './components/compendiumItemEditor.vue';

export default {
  name: 'DeployableEditor',
  components: {
    CompendiumItemEditor,
  },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    deployable: {} as Deployable,
    deployKeyword: '',
    recallKeyword: '',
    icons: [
      'mdi-send',
      'mdi-send-variant-outline',
      'mdi-rocket',
      'mdi-rocket-outline',
      'mdi-rocket-launch',
      'mdi-rocket-launch-outline',
      'mdi-turbine',
      'mdi-vector-point',
      'mdi-circle-double',
      'mdi-square',
      'mdi-square-outline',
      'mdi-triangle',
      'mdi-triangle-outline',
      'mdi-star',
      'mdi-star-outline',
      'mdi-star-four-points',
      'mdi-star-four-points-outline',
      'mdi-star-three-points',
      'mdi-star-three-points-outline',
      'mdi-hexagon',
      'mdi-hexagon-outline',
      'mdi-pentagon',
      'mdi-pentagon-outline',
      'mdi-octagon',
      'mdi-octagon-outline',
      'mdi-octagram',
      'mdi-octagram-outline',
      'mdi-rhombus',
      'mdi-rhombus-outline',
      'mdi-rhombus-medium',
      'mdi-rhombus-medium-outline',
      'mdi-rhombus-split',
      'mdi-rhombus-split-outline',
      'mdi-arrow-up-bold',
      'mdi-arrow-down-bold',
      'mdi-arrow-left-bold',
      'mdi-arrow-right-bold',
    ],
  }),
  watch: {
    id: {
      handler() {
        if (this.id === 'new') {
          this.deployable = new Deployable();
        } else {
          this.deployable = useDataStore().getDeployableById(this.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id === 'new') {
      this.deployable = new Deployable();
    } else {
      this.deployable = useDataStore().getDeployableById(this.id);
    }
  },
  computed: {
    deployableTypes() {
      return DeployableTypes.map((x) => ({ title: x.title, props: { subtitle: x.description } }));
    },
  },
};
</script>
