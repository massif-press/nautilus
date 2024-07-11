<template>
  <v-card>
    <v-card-text>
      <v-card color="black" class="ma-n3">
        <terrain-renderer
          ref="map"
          :map="map"
          @add-terrain="addTerrain"
          @select="selected = $event" />
      </v-card>

      <v-table density="compact" class="mt-6">
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
                      <v-textarea v-model="item.Description" outlined hide-details dense rows="5" />
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
    </v-card-text>
  </v-card>
</template>
1

<script lang="ts">
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
    svgs: ['cyllene.svg', 'ganymede.svg', 'hugeplanet.svg', 'planet.svg'],
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
  },
};
</script>
