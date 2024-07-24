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
import { useUserStore } from './stores/userStore';
import { useDataStore } from './stores/dataStore';
import AddImage from './views/editors/components/add-image.vue';
import Mod from './views/mod/index.vue';
import Deployable from './views/compendium/deployable.vue';
import DeployableEditor from './views/editors/deployable.vue';
import MapEditor from './views/editors/dev/map.vue';

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
              path: 'add-image/:init',
              name: 'add-image',
              component: AddImage,
              props: true,
            },
            {
              path: 'edit/ship/:id/:mapId?/:lat?/:lon?',
              name: 'edit-ship',
              component: ShipEditor,
              props: true,
            },
            {
              path: 'edit/poi/:id/:mapId?/:lat?/:lon?',
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
              path: 'edit/deployable/:id/',
              name: 'edit-deployable',
              component: DeployableEditor,
              props: true,
            },
            {
              path: 'edit/map/:id/',
              name: 'edit-map',
              component: MapEditor,
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
              path: 'deployables',
              name: 'deployables',
              component: Deployable,
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
              path: 'authors/:preSearch?',
              name: 'authors',
              component: Authors,
              props: true,
            },
          ],
        },
        {
          path: 'about',
          name: 'about',
          component: About,
        },
        {
          path: 'mod',
          name: 'mod',
          component: Mod,
        },
      ],
    },
  ],
});

router.beforeEach(async () => {
  if (router.currentRoute.value.name === 'login') return;
  await useUserStore().load();

  await useDataStore().load();
});

router.afterEach(async () => {
  if (router.currentRoute.value.name === 'login') return;
  if (router.currentRoute.value.name === 'mod') {
    if (!useUserStore().is_mod) {
      router.push({ name: 'main' });
    }
  }
  if (router.currentRoute.value.name === 'dev') {
    if (!useUserStore().dev_access) {
      router.push({ name: 'main' });
    }
  }
});

export default router;
