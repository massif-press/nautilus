<template>
  <v-tabs
    v-if="!noAdd || item.Submaps.length"
    v-model="tab"
    density="compact"
    height="30px"
    class="mt-n2">
    <v-tab v-for="(s, i) in item.Submaps" :value="i">{{ s.Name }}</v-tab>
    <v-tab v-if="!noAdd" prepend-icon="mdi-plus" @click="addLOD">Add</v-tab>
  </v-tabs>
  <div v-if="!item.Submaps.length" class="text-center text-caption text-disabled">
    <i>No submaps</i>
  </div>
  <v-window v-else v-model="tab">
    <v-window-item v-for="(s, i) in item.Submaps" :key="i">
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="s.Name" density="compact" hide-details label="Name" />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="s.Show"
              density="compact"
              hide-details
              label="Show at zoom"
              type="number" />
          </v-col>
          <v-col cols="auto">
            <v-btn color="error" @click="item.Submaps.splice(i, 1)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <submap-selector :selected="item.Submaps[tab]" @select="setSubmapImg($event)" />

        <v-card v-if="s.Img">
          <submap-renderer ref="smap" :submap="s" @select="selected = $event" />
        </v-card>
        <div class="text-caption text-disabled mt-1">Subitems for {{ s.Name }}</div>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Name</th>
              <th>Icon</th>
              <th>Color</th>
              <th>Offset X</th>
              <th>Offset Y</th>
              <th>Description</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in item.Submaps[tab].Subitems"
              class="text-center"
              :class="selected && item.ID === selected.ID ? 'bg-primary' : ''">
              <td>
                <v-text-field
                  v-model="item.Name"
                  density="compact"
                  hide-details
                  variant="outlined"
                  width="250px" />
              </td>
              <td>
                <v-menu width="300px">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="plain" size="small">
                      <v-icon size="large" :icon="item.Icon.icon" />
                    </v-btn>
                  </template>
                  <v-card variant="outlined">
                    <v-card-text>
                      <v-row dense>
                        <v-col v-for="icon in icons" :key="icon">
                          <v-btn size="small" icon variant="text" @click="item.Icon.icon = icon">
                            <v-icon size="x-large" :icon="icon" />
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </td>
              <td>
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" size="small">
                      <v-icon size="large" :color="item.Icon.color" icon="mdi-square" />
                    </v-btn>
                  </template>
                  <v-color-picker v-model="item.Icon.color" hide-details @change="rerender" />
                </v-menu>
              </td>
              <td>
                <v-text-field
                  v-model="item.Offset[0]"
                  density="compact"
                  hide-details
                  variant="outlined"
                  type="number"
                  width="200px"
                  @change="rerender" />
              </td>
              <td>
                <v-text-field
                  v-model="item.Offset[1]"
                  density="compact"
                  hide-details
                  variant="outlined"
                  type="number"
                  width="200px"
                  @change="rerender" />
              </td>
              <td>
                <v-dialog width="50vw">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" size="small">
                      <v-menu open-on-hover location="top">
                        <template #activator="{ props }">
                          <v-icon size="large" icon="mdi-text-long" v-bind="props" />
                        </template>
                        <v-card variant="outlined">
                          <v-card-text>
                            <p v-if="item.Description">{{ item.Description }}</p>
                            <div v-else class="text-caption text-disabled">
                              No item description. Click to set.
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </v-btn>
                  </template>
                  <template #default="{ isActive }">
                    <v-card>
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title>Item Description</v-toolbar-title>
                      </v-toolbar>
                      <v-card-text>
                        <v-textarea
                          v-model="item.Description"
                          outlined
                          hide-details
                          dense
                          rows="5" />
                      </v-card-text>
                      <v-divider />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          color="accent"
                          size="small"
                          variant="tonal"
                          @click="isActive.value = false">
                          Save and Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </td>
              <td>
                <v-btn
                  icon
                  variant="plain"
                  color="error"
                  size="x-small"
                  @click="item.Submaps[tab].Subitems.splice(item, 1)">
                  <v-icon size="x-large">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-window-item>
  </v-window>
</template>
1

<script lang="ts">
import { Submap } from '../../../models/maps/submap';
import SubmapRenderer from './submapRenderer.vue';
import SubmapSelector from './submapSelector.vue';

export default {
  name: 'submap-editor',
  components: {
    SubmapSelector,
    SubmapRenderer,
  },
  props: {
    item: { type: Object, required: true },
    noAdd: { type: Boolean, default: false },
  },
  data: () => ({
    tab: 0,
    selected: null as any,
    icons: [
      'mdi-circle',
      'mdi-circle-outline',
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
  methods: {
    addLOD() {
      this.item.Submaps.push(
        new Submap({ name: 'LOD ' + (this.item.Submaps.length + 1) }, this.item)
      );
    },
    setSubmapImg(submap) {
      this.item.Submaps[this.tab].Img = submap.img;
    },
    getImgPath(img: string) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    rerender() {
      this.$refs.smap[0].rerender();
    },
  },
};
</script>
