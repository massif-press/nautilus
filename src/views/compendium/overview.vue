<template>
  <div class="text-h2 text-center mt-1 mb-4" style="letter-spacing: 20px !important">
    COMPENDIUM
  </div>

  <v-row align="center">
    <v-col cols="1"><v-divider /></v-col>
    <v-col cols="auto">
      <div class="text-caption text-disabled">DATABASE ITEMS</div>
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
  <div class="px-12">
    <v-row align="center">
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/hulls" class="ma-2">
          HULLS
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/cargo" class="ma-2">
          CARGO
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/submaps" class="ma-2">
          SUBMAPS
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/tags" class="ma-2">
          TAGS
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <v-row align="center">
    <v-col cols="1"><v-divider /></v-col>
    <v-col cols="auto">
      <div class="text-caption text-disabled">MAP ITEMS</div>
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
  <div class="px-12">
    <v-row align="center">
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/terrain" class="ma-2">
          TERRAIN
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/ships" class="ma-2">
          SHIPS
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/poi" class="ma-2">
          POI
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/crew" class="ma-2">
          CREW
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <v-row align="center">
    <v-col cols="1"><v-divider /></v-col>
    <v-col cols="auto">
      <div class="text-caption text-disabled">OTHER</div>
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>

  <div class="px-12">
    <v-row align="center">
      <v-col cols="3">
        <v-btn size="x-large" variant="tonal" block to="/main/compendium/authors" class="ma-2">
          AUTHORS
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CompendiumOverview',
};
</script>
