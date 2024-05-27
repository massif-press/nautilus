<template>
  <v-navigation-drawer permanent>
    <v-list-item title="COMPENDIUM" />
    <v-divider />

    <v-list density="compact" v-model:opened="open">
      <v-list-item title="Creating Items"></v-list-item>
      <v-list-group value="Basics">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Basics"></v-list-item>
        </template>
        <v-list-item title="Creating Items"></v-list-item>
        <v-list-item title="Managing Items"></v-list-item>
        <v-list-item title="Item Statuses"></v-list-item>
      </v-list-group>
      <v-list-group value="Maps">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Maps"></v-list-item>
        </template>
        <v-list-item title="Overview"></v-list-item>
        <v-list-item title="Ganymede"></v-list-item>
      </v-list-group>
      <v-list-group value="Items">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Items"></v-list-item>
        </template>
        <v-list-item title="Overview"></v-list-item>
        <v-list-item title="Ships"></v-list-item>
        <v-list-item title="Points of Interest"></v-list-item>
        <v-list-item title="Tags"></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-card flat width="800px" class="mx-auto">
      <v-toolbar density="compact">
        <v-toolbar-title>Basics</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        Creating objects
        <br />
        What the different types of objects are
        <br />
        How to create objects
        <br />
        How to edit objects
        <br />
        How to delete objects
        <br />
        <p></p>
      </v-card-text>
    </v-card>
    <v-card flat width="800px" class="mx-auto">
      <v-toolbar density="compact">
        <v-toolbar-title>Tags</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        What are tags?
        <br />
        How do tags work?
        <br />
        How do tags affect objects?
        <br />
        How do tags affect the simulation?
        <br />
        list of tags by object and type
        <br />
      </v-card-text>
    </v-card>

    <v-card flat width="800px" class="mx-auto">
      <v-card-text></v-card-text>
    </v-card>

    <v-card flat width="800px" class="mx-auto">
      <v-card-text>Simulation steps</v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
export default {
  name: 'Mechanics',
  data: () => ({
    open: [],
  }),
};
</script>
