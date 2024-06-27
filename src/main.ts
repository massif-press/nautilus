import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import ccIcons from './assets/icons';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import './style.css';
import './styles/main.scss';
import ipsn from './assets/theme';
import router from './router';

import App from './App.vue';
import { useUserStore } from './stores/userStore';
import { useDataStore } from './stores/dataStore';
import { Initialize } from './storage';

const nautilus = createApp(App);

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
  theme: {
    defaultTheme: 'ipsn',
    themes: {
      ipsn,
    },
  },
  icons: {
    defaultSet: 'mdi',
    // aliases,
    sets: {
      cc: ccIcons,
      // mdi,
    },
  },
});

nautilus.use(vuetify);

nautilus.use(router);

nautilus.use(createPinia());

nautilus.mount('#app');

await Initialize();

await useUserStore().load();
await useDataStore().load();
