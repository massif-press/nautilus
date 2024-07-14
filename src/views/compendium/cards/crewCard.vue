<template>
  <v-card border variant="tonal">
    <v-card-text class="pt-2">
      <v-row dense align="center">
        <v-col cols="auto">
          <div class="text-h5">{{ crew.Name }}</div>
          <div class="text-caption">
            {{ crew.Role }}
            <span v-if="crew.Assignment">
              , {{ crew.Assignment.Title || crew.Assignment.Name }}
            </span>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-chip size="x-small">{{ crew.Pronouns }}</v-chip>
        </v-col>
      </v-row>
      <blockquote class="my-1 border-s-lg rounded pl-2">
        {{ crew.Description }}
      </blockquote>
      <div v-for="item in crew.Details">
        <div class="text-caption">{{ item.title }}</div>
        <p style="font-size: 14px; white-space: pre-wrap">{{ item.body }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'CrewCard',
  props: {
    crew: { type: Object, required: true },
  },
};
</script>
