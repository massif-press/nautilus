import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Login from './login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
  ],
});

export default router;
