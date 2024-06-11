import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Login from './views/login.vue';
import Main from './views/main.vue';
import Landing from './views/landing.vue';
import Map from './views/map/index.vue';
import About from './views/about.vue';

import Editor from './views/editors/index.vue';
import EditorOverview from './views/editors/overview.vue';
import ShipEditor from './views/editors/ship.vue';
import PoiEditor from './views/editors/poi.vue';
import CargoEditor from './views/editors/cargo.vue';
import CrewEditor from './views/editors/crew.vue';
import HullEditor from './views/editors/hull.vue';
import TagEditor from './views/editors/tag.vue';
import TerrainEditor from './views/editors/terrain.vue';

import Compendium from './views/compendium/index.vue';
import CompendiumOverview from './views/compendium/overview.vue';
import Hulls from './views/compendium/hulls.vue';
import Tags from './views/compendium/tags.vue';
import Submaps from './views/compendium/submaps.vue';
import Terrain from './views/compendium/terrain.vue';
import Ships from './views/compendium/ships.vue';
import Poi from './views/compendium/poi.vue';
import Crew from './views/compendium/crew.vue';
import Authors from './views/compendium/authors.vue';
import Cargo from './views/compendium/cargo.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'landing',
          name: 'landing',
          component: Landing,
        },
        {
          path: 'map',
          name: 'map',
          component: Map,
        },
        {
          path: 'map/:itemId',
          component: Map,
          props: true,
        },
        {
          path: 'editor',
          name: 'editor',
          component: Editor,
          children: [
            {
              path: 'overview',
              name: 'overview',
              component: EditorOverview,
            },
            {
              path: 'edit/ship/:id/:lat?/:lon?',
              name: 'edit-ship',
              component: ShipEditor,
              props: true,
            },
            {
              path: 'edit/poi/:id/:lat?/:lon?',
              name: 'edit-poi',
              component: PoiEditor,
              props: true,
            },

            {
              path: 'edit/cargo/:id/',
              name: 'edit-cargo',
              component: CargoEditor,
              props: true,
            },
            {
              path: 'edit/crew/:id/',
              name: 'edit-crew',
              component: CrewEditor,
              props: true,
            },
            {
              path: 'edit/hull/:id/',
              name: 'edit-hull',
              component: HullEditor,
              props: true,
            },
            {
              path: 'edit/tag/:id/',
              name: 'edit-tag',
              component: TagEditor,
              props: true,
            },
            {
              path: 'edit/terrain/:id/',
              name: 'edit-terrain',
              component: TerrainEditor,
              props: true,
            },
          ],
        },
        {
          path: 'compendium',
          name: 'compendium',
          component: Compendium,
          children: [
            {
              path: '',
              name: 'compendium-overview',
              component: CompendiumOverview,
            },
            {
              path: 'hulls',
              name: 'hulls',
              component: Hulls,
            },
            {
              path: 'cargo',
              name: 'cargo',
              component: Cargo,
            },
            {
              path: 'submaps',
              name: 'submaps',
              component: Submaps,
            },
            {
              path: 'tags',
              name: 'tags',
              component: Tags,
            },
            {
              path: 'terrain',
              name: 'terrain',
              component: Terrain,
            },

            {
              path: 'ships',
              name: 'ships',
              component: Ships,
            },
            {
              path: 'poi',
              name: 'poi',
              component: Poi,
            },

            {
              name: 'crew',
              path: 'crew',
              component: Crew,
            },
            {
              path: 'authors',
              name: 'authors',
              component: Authors,
            },
          ],
        },
        {
          path: 'about',
          name: 'about',
          component: About,
        },
      ],
    },
  ],
});

export default router;
