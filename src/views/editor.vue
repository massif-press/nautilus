<template>
  <v-navigation-drawer>
    <v-list density="compact">
      <v-list-item link title="Overview" to="/main/editor/overview" />
      <v-divider />
      <v-list-group value="Vessels">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Vessels">
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
          <v-list-item v-bind="props" title="Personnel" disabled>
            <div class="text-caption text-disabled">
              <i>{{ crew.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="c in crew" link :to="`/main/editor/edit/poi/new`">
          <v-icon :icon="c.Icon" size="x-small" class="mt-n1" />
          {{ c.Name }}
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group value="Cargo">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Cargo" disabled>
            <div class="text-caption text-disabled">
              <i>{{ cargo.length }} Registered</i>
            </div>
          </v-list-item>
        </template>
        <v-list-item v-for="c in cargo" link :to="`/main/editor/edit/poi/new`">
          <v-icon icon="mdi-cube" size="x-small" class="mt-n1" />
          {{ c.name }}
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-menu location="bottom">
      <template #activator="{ props }">
        <v-btn v-bind="props" size="small" variant="plain" color="accent" block>
          <v-icon icon="mdi-plus" start />
          Add New
        </v-btn>
      </template>
      <v-list>
        <v-list-item link title="Add new Vessel" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Point of Interest" to="/main/editor/edit/ship/new" />
        <v-list-item link title="Add new Personnel" to="/main/editor/edit/ship/new" disabled />
        <v-list-item link title="Add new Cargo" to="/main/editor/edit/ship/new" disabled />
      </v-list>
    </v-menu>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { useMapStore } from '../stores/mapStore';

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
      return useMapStore().cargo;
    },
  },
};
</script>
