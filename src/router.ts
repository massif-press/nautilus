import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Login from './views/login.vue';
import Main from './views/main.vue';
import Landing from './views/landing.vue';
import Map from './views/map.vue';
import Editor from './views/editor.vue';
import EditorOverview from './views/editors/overview.vue';
import ShipEditor from './views/editors/ship.vue';
import PoiEditor from './views/editors/poi.vue';
import About from './views/about.vue';
import Compendium from './views/compendium.vue';

import Hulls from './views/compendium/hulls.vue';
import Tags from './views/compendium/tags.vue';

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
          path: 'map/',
          name: 'map',
          component: Map,
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
          ],
        },
        {
          path: 'compendium',
          name: 'compendium',
          component: Compendium,
          children: [
            {
              path: 'hulls',
              name: 'hulls',
              component: Hulls,
            },
            {
              path: 'tags/:type',
              name: 'tags',
              component: Tags,
              props: true,
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
