<template>
  <v-navigation-drawer permanent>
    <v-list density="compact">
      <v-list-item link title="Overview" to="/main/editor/overview" />
      <v-divider />
      <v-list-group value="Ships">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Ships">
            <div class="text-caption text-disabled">
              <i>{{ ships.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="s in ships" link :to="`/main/editor/edit/ship/${s.ID}`">
          <v-icon :icon="s.Icon.icon" size="x-small" class="mt-n1" />
          {{ s.Name }}
          <div class="text-caption text-disabled" style="line-height: 14px">
            {{ `${s.Owner} ${s.Hull.Class}` }}
          </div>
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          size="x-small"
          block
          variant="tonal"
          color="accent"
          text="Add new Ship"
          to="/main/editor/edit/ship/new" />
      </v-list-group>

      <v-divider />

      <v-list-group value="POI">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Points of Interest">
            <div class="text-caption text-disabled">
              <i>{{ pois.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="p in pois" link :to="`/main/editor/edit/poi/${p.ID}`">
          <v-icon :icon="p.Icon.icon" size="x-small" class="mt-n1" />
          {{ p.Name }}
          <div class="text-caption text-disabled" style="line-height: 14px">
            {{ `${p.Owner} ${p.PoiType}` }}
          </div>
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Point of Interest"
          to="/main/editor/edit/poi/new" />
      </v-list-group>
      <v-divider />

      <v-list-group value="Crew">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Crew">
            <div class="text-caption text-disabled">
              <i>{{ crew.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="c in crew" link :to="`/main/editor/edit/crew/${c.ID}`">
          <v-icon icon="mdi-account" size="x-small" class="mt-n1" />
          {{ c.Name }}
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Crew"
          to="/main/editor/edit/crew/new" />
      </v-list-group>

      <v-divider />

      <v-list-group value="Hull">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Hull">
            <div class="text-caption text-disabled">
              <i>{{ hulls.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="h in hulls" link :to="`/main/editor/edit/hull/${h.ID}`">
          <v-icon icon="mdi-rocket" size="x-small" class="mt-n1" />
          {{ h.Name }}
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Hull"
          to="/main/editor/edit/hull/new" />
      </v-list-group>

      <v-divider />

      <v-list-group value="Deployable">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Deployable">
            <div class="text-caption text-disabled">
              <i>{{ deployables.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="d in deployables" link :to="`/main/editor/edit/deployable/${d.ID}`">
          <v-icon icon="mdi-rocket" size="x-small" class="mt-n1" />
          {{ d.Name }}
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Deployable"
          to="/main/editor/edit/deployable/new" />
      </v-list-group>

      <v-divider />

      <v-list-group value="Cargo">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Cargo">
            <div class="text-caption text-disabled">
              <i>{{ cargo.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="c in cargo" link :to="`/main/editor/edit/cargo/${c.ID}`">
          <v-icon icon="mdi-cube" size="x-small" class="mt-n1" />
          {{ c.Name }}
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Cargo"
          to="/main/editor/edit/cargo/new" />
      </v-list-group>
      <v-divider />

      <v-list-group value="Tags">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Tags">
            <div class="text-caption text-disabled">
              <i>{{ tags.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="t in tags" link :to="`/main/editor/edit/tag/${t.ID}`">
          <v-icon icon="mdi-tag" size="x-small" class="mt-n1" />
          {{ t.Name }}
        </v-list-item>
        <v-btn
          prepend-icon="mdi-plus"
          variant="tonal"
          color="accent"
          block
          size="x-small"
          text="Add new Tag"
          to="/main/editor/edit/tag/new" />
      </v-list-group>
    </v-list>
    <v-divider />

    <div v-if="isDev">
      <div class="text-cyan px-2 mt-4">Developer Tools</div>
      <v-list density="compact">
        <v-list-group value="Ships">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Maps" />
          </template>
          <v-list-item
            v-for="m in maps"
            :title="m.Name"
            link
            :to="`/main/editor/edit/map/${m.ID}`" />
          <v-btn
            prepend-icon="mdi-plus"
            size="x-small"
            block
            variant="tonal"
            color="accent"
            text="Add new Map"
            to="/main/editor/edit/map/new" />
        </v-list-group>
      </v-list>
    </div>

    <v-divider />

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          size="small"
          variant="plain"
          color="accent"
          block
          style="position: fixed; bottom: 0">
          <v-icon icon="mdi-plus" start />
          Add New
        </v-btn>
      </template>
      <v-list border>
        <v-list-item link title="Add new Ship" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Point of Interest" to="/main/editor/edit/poi/new" />
        <v-list-item link title="Add new Crew" to="/main/editor/edit/crew/new" />
        <v-list-item link title="Add new Hull" to="/main/editor/edit/hull/new" />
        <v-list-item link title="Add new Deployable" to="/main/editor/edit/deployable/new" />
        <v-list-item link title="Add new Cargo" to="/main/editor/edit/cargo/new" />
        <v-list-item link title="Add new Tag" to="/main/editor/edit/tag/new" />
      </v-list>
    </v-menu>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import _ from 'lodash';
import { useDataStore } from '../../stores/dataStore';
import { useUserStore } from '../../stores/userStore';

export default {
  name: 'Editor',
  data: () => ({
    search: '',
    open: [],
  }),
  computed: {
    isDev() {
      return useUserStore().dev_access;
    },
    ships() {
      return _.uniq(
        useDataStore().ships.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    crew() {
      return _.uniq(
        useDataStore().crew.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    pois() {
      return _.uniq(
        useDataStore().pois.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    cargo() {
      return _.uniq(
        useDataStore().cargo.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    hulls() {
      return _.uniq(
        useDataStore().hulls.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    tags() {
      return _.uniq(
        useDataStore().tags.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    deployables() {
      return _.uniq(
        useDataStore().deployables.filter((x) => x.isUserOwned),
        'ID'
      );
    },
    maps() {
      return useDataStore().maps;
    },
  },
};
</script>
