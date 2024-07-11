<template>
  <v-app>
    <div style="margin-bottom: 60px">
      <router-view />
    </div>
    <v-footer app class="border-t-sm" style="position: fixed">
      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            :icon="timeLeft ? 'mdi-database-outline' : 'mdi-database-refresh'"
            :color="timeLeft ? 'grey-darken-2' : 'success'"
            class="ml-n2 mr-2" />
        </template>
        <v-card class="pa-4">
          <div v-if="timeLeft" class="text-center text-caption">
            Data update available in {{ timeLeft }} {{ timeLeft > 1 ? 'minutes' : 'minute' }}
            <br />
            <span class="text-disabled">
              Last update
              {{ new Date(lastLocalUpdate).toLocaleString() }}
            </span>
          </div>
          <div v-else="timeLeft" class="text-center text-caption text-disabled">
            New data available. Please refresh.
          </div>
        </v-card>
      </v-menu>
      <v-select
        v-model="selectedMap"
        :items="maps"
        item-title="Name"
        item-value="ID"
        label="Map"
        variant="outlined"
        hide-details
        density="compact"
        style="width: 300px"
        @update:modelValue="setMap" />
      <v-btn
        size="small"
        variant="tonal"
        color="accent"
        class="ml-3"
        to="/main/map/#"
        :disabled="!selectedMap">
        OPEN
      </v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/editor/overview">EDITOR</v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/compendium">COMPENDIUM</v-btn>
      <v-spacer />
      <v-btn size="small" variant="tonal" color="accent" to="/main/about">ABOUT</v-btn>
      <v-spacer />
      <div style="width: 1px; height: 40px; opacity: 0.3" class="bg-grey" />
      <v-spacer />
      <v-btn
        v-if="isMod"
        size="small"
        variant="elevated"
        color="purple"
        class="mr-8"
        to="/main/mod">
        MOD TOOLS
      </v-btn>
      <v-btn size="small" variant="tonal" color="secondary" @click="logout">LOG OUT</v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { useDataStore } from '../stores/dataStore';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'main-view',
  data: () => ({
    selectedMap: null as any,
    timer: 0,
    timeLeft: 0,
  }),
  mounted() {
    const store = useDataStore();
    if (!store.map) {
      if (!store.maps.length) store.load();
      const preload = localStorage.getItem('cc-n-mapid');
      if (preload) store.setMap(store.maps.find((m) => m.ID === preload));
      else store.setMap(store.maps[0]);
    }
    this.selectedMap = store.map?.ID;

    this.timeLeft = Math.ceil((useDataStore().expires - Date.now()) / 1000 / 60);

    if (this.timeLeft <= 0) this.timeLeft = 0;

    if (!this.timeLeft) return;

    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000 * 60);
  },
  computed: {
    maps() {
      return useDataStore().maps;
    },
    isMod() {
      return useUserStore().is_mod;
    },
    expiration() {
      return useDataStore().expires;
    },
    lastLocalUpdate() {
      return Number(useDataStore().local_update);
    },
  },
  methods: {
    setMap(map: string) {
      localStorage.setItem('cc-n-mapid', map);
      useDataStore().setMap(this.maps.find((m) => m.ID === map));
    },
    logout() {
      useUserStore().logout();
      this.$router.push('/');
    },
  },
};
</script>
