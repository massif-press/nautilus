<template>
  <v-container>
    <v-card border flat variant="text" class="pa-2">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="ma-1"
            item-text="name"
            density="compact"
            variant="outlined"
            rounded
            hide-details
            clearable />
        </v-col>
      </v-row>
    </v-card>

    <v-card-text>
      <v-data-table
        v-model:expanded="expanded"
        :search="search"
        :headers="headers"
        :items="deployables"
        item-value="ID"
        :items-per-page="100"
        show-expand>
        <template #item.Name="{ item }">
          <v-btn
            size="small"
            color="secondary"
            :text="item.TruncatedName"
            :to="`/main/editor/edit/${item.ItemType}/${item.ID}`" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="px-0">
              <deployable-card :deployable="item" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
// import deployableCard from './cards/deployableCard.vue';
import { filter } from 'lodash';
import DeployableCard from './cards/deployableCard.vue';

export default {
  name: 'deployable',
  components: { DeployableCard },
  data: () => ({
    expanded: [],
    ct_selections: [] as string[],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'DeployableType' },
      { title: 'Author', key: 'Author.Name' },
    ],
  }),
  computed: {
    deployables() {
      return useDataStore().deployables.filter((x) => x.isPublicVisible);
    },
    filteredDeployables() {
      if (!this.search) return this.deployable;
      return _.filter(this.deployable, (deployable) => {
        return _.includes(deployable.Name.toLowerCase(), this.search.toLowerCase());
      });
    },
    deployableTypes() {
      return _.uniq(this.deployable).map((c) => c.deployableType);
    },
    authors() {
      return _.uniqBy(this.deployable, 'Author.Name').map((c) => c.Author.Name);
    },
  },
};
</script>
