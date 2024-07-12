<template>
  <div class="px-2 text-caption">
    <v-divider class="my-2" />
    <v-btn color="primary" size="x-small" flat class="my-2" block @click="openDetailTab(0)">
      Details
    </v-btn>
    <v-btn
      v-if="item.Crew && item.Crew.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(1)">
      Crew
    </v-btn>
    <v-btn
      v-if="item.CargoManifest && item.CargoManifest.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(2)">
      Cargo
    </v-btn>
    <v-btn
      v-if="item.Deployables && item.Deployables.length"
      color="primary"
      size="x-small"
      flat
      class="my-2"
      block
      @click="openDetailTab(3)">
      Hangar
    </v-btn>
  </div>

  <v-dialog v-model="dialog" width="75vw">
    <v-card>
      <v-toolbar density="compact" color="primary" extended>
        <v-toolbar-title>Item Details</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template #extension>
          <v-tabs v-model="tab">
            <v-tab>Details</v-tab>
            <v-tab v-if="item.Crew && item.Crew.length">Crew</v-tab>
            <v-tab v-if="item.CargoManifest && item.CargoManifest.length">Cargo</v-tab>
            <v-tab v-if="item.Deployables && item.Deployables.length">Hangar</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <div class="px-2 pt-4 mb-n2 text-h4 text-uppercase">
        <v-icon icon="cc:gms" class="mt-n1" />
        {{ item.Title }}
      </div>

      <v-card-text class="pt-0">
        <v-window v-model="tab">
          <v-window-item>
            <slot name="details" />

            <v-card
              elevation="0"
              v-if="item.Details && item.Details.length"
              v-for="d in item.Details"
              class="mb-3 mx-auto px-6">
              <div class="font-weight-bold">{{ d.title }}</div>
              <p v-text:="d.body" class="pl-3" style="font-size: 14px" />
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
        <v-btn color="accent" variant="text" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    item: { type: Object, required: true },
    map: { type: Object, required: true },
  },
  data() {
    return {
      dialog: false,
      tab: 0,
    };
  },
  emits: ['select', 'deselect'],
  methods: {
    openDetailTab(tab: number) {
      this.tab = tab;
      this.dialog = true;
    },
  },
};
</script>
