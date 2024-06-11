<template>
  <v-navigation-drawer>
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
      </v-list-group>
      <v-divider />

      <v-list-group value="Crew">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Personnel">
            <div class="text-caption text-disabled">
              <i>{{ crew.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="c in crew" link :to="`/main/editor/edit/crew/${c.ID}`">
          <v-icon icon="mdi-account" size="x-small" class="mt-n1" />
          {{ c.Name }}
        </v-list-item>
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
      </v-list-group>
    </v-list>
    <v-divider />

    <v-menu location="bottom">
      <template #activator="{ props }">
        <v-btn v-bind="props" size="small" variant="plain" color="accent" block>
          <v-icon icon="mdi-plus" start />
          Add New
        </v-btn>
      </template>
      <v-list>
        <v-list-item link title="Add new Ship" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Point of Interest" to="/main/editor/edit/poi/new" />
        <v-list-item link title="Add new Personnel" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Hull" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Cargo" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Tag" to="/main/editor/edit/ship/new" />
      </v-list>
    </v-menu>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { useCompendiumStore } from '../../stores/compendiumStore';
import { useMapStore } from '../../stores/mapStore';

export default {
  name: 'Editor',
  data: () => ({
    search: '',
    open: [],
  }),
  computed: {
    ships() {
      return useMapStore().ships;
    },
    crew() {
      return useMapStore().crew;
    },
    pois() {
      return useMapStore().pois;
    },
    cargo() {
      return useCompendiumStore().cargo;
    },
    hulls() {
      return useCompendiumStore().hulls;
    },
    tags() {
      return useCompendiumStore().tags;
    },
  },
};
</script>
