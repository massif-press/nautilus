<template>
  <editor-base :item="item">
    <v-row justify="center">
      <v-col xl="8" cols="12">
        <slot />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import _ from 'lodash';
import EditorBase from './editorBase.vue';

export default {
  name: 'MapItemEditor',
  components: { EditorBase },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
