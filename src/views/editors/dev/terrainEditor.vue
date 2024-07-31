<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="5" style="height: 750px; overflow-x: scroll">
          <v-table density="compact">
            <thead>
              <tr>
                <th>Name</th>
                <th>Pos Y</th>
                <th>Pos X</th>
                <th>Size</th>
                <th>SVG</th>
                <th>Details</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in map.Terrain"
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
                  <v-text-field
                    v-model="item.Ypos"
                    density="compact"
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Xpos"
                    density="compact"
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Size"
                    density="compact"
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-dialog width="80vw">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon variant="text" size="small">
                        <v-icon size="large" icon="mdi-svg" v-bind="props" />
                      </v-btn>
                    </template>
                    <template #default="{ isActive }">
                      <v-card>
                        <v-toolbar color="primary" density="compact">
                          <v-toolbar-title>Select SVG</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                          <v-row>
                            <v-col cols="3" v-for="s in svgs">
                              <v-card
                                flat
                                border
                                @click="
                                  item.Svg = s;
                                  isActive.value = false;
                                ">
                                <v-img :src="getImgPath(s)" height="200px" />
                                <v-divider class="my-1" />
                                <div class="text-caption pb-1 px-2">{{ s }}</div>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-dialog>
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
                            rows="5"
                            auto-grow />
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
                    @click="map.Terrain.splice(idx, 1)">
                    <v-icon size="x-large">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-table density="compact">
            <thead>
              <tr>
                <th>Label</th>
                <th>Pos Y</th>
                <th>Pos X</th>
                <th>Size</th>
                <th>Show</th>
                <th>Color</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in map.Labels"
                class="text-center"
                :class="selected && item.ID === selected.ID ? 'bg-primary' : ''">
                <td>
                  <v-text-field
                    v-model="item.Name"
                    maxlength="80"
                    counter
                    density="compact"
                    hide-details
                    variant="outlined"
                    width="250px" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Ypos"
                    density="compact"
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Xpos"
                    density="compact"
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Size"
                    density="compact"
                    maxlength="3"
                    counter
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-text-field
                    v-model="item.Show"
                    density="compact"
                    maxlength="2"
                    counter
                    hide-details
                    variant="outlined"
                    type="number"
                    width="100px"
                    @change="rerender" />
                </td>
                <td>
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon variant="text" size="small">
                        <v-icon size="large" :color="item.Color" icon="mdi-square" />
                      </v-btn>
                    </template>
                    <v-color-picker
                      v-model="item.Color"
                      hide-details
                      mode="hexa"
                      @change="rerender" />
                  </v-menu>
                </td>

                <td>
                  <v-btn
                    icon
                    variant="plain"
                    color="error"
                    size="x-small"
                    @click="item.Submaps[tab].Labels.splice(item, 1)">
                    <v-icon size="x-large">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col>
          <v-card color="black" class="ma-n3">
            <terrain-renderer
              ref="map"
              :map="map"
              @add-terrain="addTerrain"
              @add-label="addLabel"
              @select="selected = $event" />
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
1

<script lang="ts">
import { Label, LabelData } from '../../../models/maps/submap';
import { Terrain } from '../../../models/maps/terrain';
import TerrainRenderer from './terrainRenderer.vue';

export default {
  name: 'submap-editor',
  components: {
    TerrainRenderer,
  },
  props: {
    map: { type: Object, required: true },
  },
  data: () => ({
    selected: null as any,
    showMapItems: false,
    svgs: [
      'planet.svg',
      'rocks/1.svg',
      'rocks/2.svg',
      'rocks/3.svg',
      'rocks/4.svg',
      'rocks/5.svg',
      'rocks/6.svg',
      'rocks/7.svg',
      'rocks/8.svg',
      'rocks/9.svg',
      'rocks/10.svg',
      'rocks/11.svg',
      'rocks/12.svg',
      'rocks/13.svg',
      'rocks/14.svg',
      'rocks/15.svg',
      'rocks/16.svg',
      'rocks/17.svg',
      'rocks/18.svg',
      'rocks/19.svg',
      'rocks/20.svg',
      'rocks/21.svg',
      'rocks/22.svg',
      'rocks/23.svg',
      'rocks/24.svg',
      'rocks/25.svg',
      'rocks/26.svg',
      'rocks/27.svg',
      'rocks/28.svg',
      'rocks/29.svg',
      'rocks/30.svg',
      'rocks/31.svg',
      'rocks/32.svg',
      'rocks/33.svg',
      'rocks/34.svg',
      'rocks/35.svg',
      'rocks/36.svg',
      'rocks/37.svg',
      'rocks/38.svg',
      'rocks/39.svg',
      'largeband.svg',
      'smallband.svg',
      'eyalet.svg',
    ],
  }),
  methods: {
    getImgPath(img: string) {
      const path = 'submaps';
      return `/${path}/${img}`;
    },
    rerender() {
      this.$refs.map.redraw();
    },
    addTerrain(coords: { lat: number; lng: number }) {
      const t = new Terrain(this.map);
      t.Xpos = coords.lng.toString();
      t.Ypos = coords.lat.toString();
      this.map.Terrain.push(t);
      this.rerender();
    },
    addLabel(coords: { lat: number; lng: number }) {
      const labelData = {
        type: 'label',
        name: 'New Label',
        offset: [coords.lat, coords.lng],
        size: 10,
        color: '#fff',
        show: 1,
      };

      const t = new Label(this.map, labelData as LabelData);
      this.map.Labels.push(t);
      this.rerender();
    },
  },
};
</script>
