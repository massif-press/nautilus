<template>
  <v-card :variant="noHeader ? 'tonal' : 'flat'" :rounded="noHeader ? '0' : 'sm'">
    <v-tabs
      v-if="noHeader"
      :value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      density="compact"
      bg-color="primary">
      <v-tab>Details</v-tab>
      <v-tab v-if="item.Crew && item.Crew.length">Crew</v-tab>
      <v-tab v-if="item.CargoManifest && item.CargoManifest.length">Cargo</v-tab>
      <v-tab v-if="item.Deployables && item.Deployables.length">Hangar</v-tab>
    </v-tabs>

    <v-toolbar v-else density="compact" color="primary" extended>
      <v-toolbar-title>Item Details</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <template #extension>
        <v-tabs :value="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
          <v-tab>Details</v-tab>
          <v-tab v-if="item.Crew && item.Crew.length">Crew</v-tab>
          <v-tab v-if="item.CargoManifest && item.CargoManifest.length">Cargo</v-tab>
          <v-tab v-if="item.Deployables && item.Deployables.length">Hangar</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <div class="px-2 pt-4 mb-n2 text-h4 text-uppercase">
      <v-icon icon="cc:gms" class="mt-n1" />
      {{ item.Title || item.Name }}
    </div>

    <v-card-text class="pt-0">
      <v-window :model-value="modelValue">
        <v-window-item>
          <slot name="details" />

          <v-card
            elevation="0"
            v-if="item.Details && item.Details.length"
            v-for="d in item.Details"
            class="mb-3 mx-auto px-6 mt-2">
            <div class="font-weight-bold">{{ d.title }}</div>
            <p v-text:="d.body" class="pl-3" style="font-size: 14px; white-space: pre-wrap" />
          </v-card>
        </v-window-item>
        <v-window-item v-if="item.Crew && item.Crew.length">
          <div class="text-h6">Crew List</div>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel density="compact" v-for="c in item.Crew">
              <template #title>
                <v-row dense align="center">
                  <v-col cols="auto">
                    <v-avatar color="grey-darken-4" class="rounded">
                      <v-icon icon="mdi-account" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="auto">
                    {{ c.Name }}
                    <span class="text-caption text-disabled">//</span>
                    {{ c.Role }}
                  </v-col>
                </v-row>
              </template>
              <template #text>
                <crew-card :crew="c" />
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>
        <v-window-item v-if="item.CargoManifest && item.CargoManifest.length">
          <div class="text-h6">Cargo Manifest</div>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel density="compact" v-for="c in item.CargoManifest">
              <template #title>
                <v-row dense align="center">
                  <v-col cols="auto">
                    <v-avatar color="grey-darken-4" class="rounded">
                      <v-icon icon="mdi-cube" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="auto">
                    {{ c.item.Name }}
                    <span class="text-caption text-disabled px-2">
                      // {{ c.item.CargoType }} Cargo
                    </span>
                  </v-col>
                  <v-col cols="auto" class="ml-auto">
                    {{ c.quantity }}
                  </v-col>
                </v-row>
              </template>
              <template #text>
                <cargo-card :cargo="c.item" />
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>
        <v-window-item v-if="item.Deployables && item.Deployables.length">
          <div class="text-h6">Hangar</div>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="c in item.Deployables">
              <template #title>
                <v-row dense align="center">
                  <v-col cols="auto">
                    <v-avatar color="grey-darken-4" class="rounded">
                      <v-icon :icon="c.item.Icon" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="5">
                    {{ c.name }}
                    <span class="text-caption text-disabled px-2">
                      // {{ c.item.Name }} ({{ c.item.DeployableType }}
                      <span v-if="c.complement !== 'Single Unit'" />
                      {{ c.complement }})
                    </span>
                  </v-col>

                  <v-col cols="auto" class="ml-auto mr-12 mt-n1">
                    <div class="text-caption text-disabled">STATUS</div>
                    {{ c.status }}
                  </v-col>
                </v-row>
              </template>
              <template #text>
                <deployable-card :deployable="c.item" />
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>
      </v-window>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="accent" variant="text" @click="$emit('close')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import CrewCard from '../../../compendium/cards/crewCard.vue';
import DeployableCard from '../../../compendium/cards/deployableCard.vue';
import CargoCard from '../../../compendium/cards/cargoCard.vue';

export default {
  name: 'DetailMenu',
  components: {
    CrewCard,
    DeployableCard,
    CargoCard,
  },
  props: {
    modelValue: { type: Number, required: true },
    item: { type: Object, required: true },
    map: { type: Object, required: true },
    noHeader: { type: Boolean, default: false },
  },
  emits: ['close', 'update:modelValue'],
  methods: {
    setTab(tab: number) {
      this.tab = tab;
    },
  },
};
</script>
