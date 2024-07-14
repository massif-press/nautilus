<template>
  <v-card v-if="!!parent && !parent.Deployables.length" border variant="tonal" class="pa-2">
    <div class="text-center text-disabled text-caption font-italic">Bays Empty</div>
  </v-card>
  <v-card v-else border variant="tonal" class="pa-2">
    <v-row dense v-for="(d, idx) in sortedDeployables" align="center">
      <v-col cols="auto">
        <v-avatar :color="d.item.Color" class="rounded"><v-icon :icon="d.item.Icon" /></v-avatar>
      </v-col>
      <v-col cols="5">
        <div v-if="parent.isUserOwned">
          <v-text-field
            v-model="d.name"
            density="compact"
            maxlength="100"
            counter
            class="small-textfield" />
        </div>
        <div v-else>{{ d.name }}</div>
        <div class="text-caption text-disabled">
          {{ d.item.Name }}
          <span>// {{ d.item.DeployableType }}</span>
        </div>
      </v-col>
      <v-col class="text-center px-12">
        <div v-if="parent.isUserOwned">
          <v-select
            v-model="d.complement"
            :items="complementTypes(d.item)"
            hide-details
            density="compact" />
        </div>
        <div v-else>{{ d.complement }}</div>
      </v-col>
      <v-col>
        <div class="text-caption text-disabled">Status</div>
        {{ d.status }}
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-dialog width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" variant="plain" icon>
              <v-icon icon="mdi-magnify" color="accent" />
            </v-btn>
          </template>
          <v-card>
            <deployable-card :deployable="d.item" />
          </v-card>
        </v-dialog>
        <v-btn
          size="x-small"
          variant="plain"
          color="secondary"
          icon
          :to="`/main/editor/edit/deployable/${d.item.ID}`">
          <v-icon :icon="d.isUserOwned ? 'mdi-pencil' : 'mdi-account-box-multiple-outline'" />
        </v-btn>
        <v-btn
          v-if="parent.isUserOwned"
          size="x-small"
          variant="plain"
          color="error"
          icon
          @click="parent.Deployables.splice(idx, 1)">
          <v-icon icon="mdi-account-remove" />
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
  <div class="text-right">
    <v-dialog v-model="dialog" width="80vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" variant="tonal" size="small">Set Deployables</v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" extended>
          <v-toolbar-title>Assign Deployables</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template #extension>
            <v-text-field v-model="search" label="Search" />
          </template>
        </v-toolbar>
        <v-data-table
          v-model:expanded="expanded"
          :search="search"
          :headers="headers"
          :items="allDeployables"
          :group-by="[
            {
              key: 'DeployableType',
              order: 'asc',
            },
          ]"
          item-value="ID"
          :items-per-page="100"
          class="rounded-0"
          density="compact"
          show-expand>
          <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
            <template
              :ref="
                () => {
                  if (!isGroupOpen(item)) toggleGroup(item);
                }
              " />
            <tr>
              <td :colspan="columns.length">
                <v-btn
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  size="small"
                  variant="text"
                  @click="toggleGroup(item)" />
                <b>{{ item.value }}</b>
              </td>
            </tr>
          </template>
          <template #item.Assignment="{ item }">
            <v-tooltip v-if="!item.CanAdd" location="top" max-width="400px">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  color="accent"
                  size="small"
                  icon="mdi-lock-alert"
                  class="mx-1" />
              </template>
              <b v-if="item.Status !== 'Submitted'">
                This item cannot be selected until it has been published.
              </b>
              <b v-else>This item cannot be selected.</b>
            </v-tooltip>
            <v-btn
              color="accent"
              variant="tonal"
              size="small"
              :disabled="!item.CanAdd"
              @click="assignDeployable(item)">
              Assign Unit
            </v-btn>
          </template>
          <template #expanded-row="{ columns, item }">
            <tr>
              <td />
              <td :colspan="columns.length - 1" class="px-0">
                <deployable-card :deployable="item" />
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../../stores/dataStore';
import { useUserStore } from '../../../stores/userStore';
import DeployableCard from '../../compendium/cards/deployableCard.vue';
import { DeployableTypes } from '../../../models/compendium/deployable';

export default {
  name: 'DeployablesSelector',
  components: { DeployableCard },
  props: {
    parent: { type: Object, required: true },
  },
  emits: ['select'],
  data: () => ({
    expanded: [],
    search: '',
    headers: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'DeployableType' },
      { title: '', key: 'Assignment' },
    ],
    dialog: false,
  }),
  computed: {
    allDeployables() {
      return useDataStore().deployables;
    },
    user(): string {
      return useUserStore().user_id;
    },
    sortedDeployables() {
      return _.sortBy(this.parent.Deployables, 'item.DeployableType');
    },
  },
  methods: {
    assignDeployable(deployable) {
      this.parent.Deployables.push({
        item: deployable,
        name: deployable.Name,
        complement: 'Single Unit',
        status: 'Decked',
      });
      this.dialog = false;
    },
    complementTypes(deployable) {
      return DeployableTypes.find((x) => x.title === deployable.DeployableType)!.complements;
    },
  },
};
</script>

<style scoped>
.small-textfield /deep/ .v-field__input {
  padding-top: 0;
  padding-bottom: 0;
  padding-inline: 8px;
  min-height: 0;
}
</style>
