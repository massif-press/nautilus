<template>
  <v-container>
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <div class="text-center text-h5">Hello again.</div>
      <p class="pa-2">
        It's me, your old pal Beef. Welcome to NAUTILUS, a collaborative worldbuilding project about
        interstellar logistics in the LANCER universe. If that last sentence was the kind of thing
        that gets your motor running, welcome friend, you're in the right place. If not, it's okay,
        not everyone is a sicko. You're still welcome here.
      </p>
      <p class="pa-2">
        This is the next HORUS-chat-like COMP/CON flavor project, with a little different scope,
        tone, and focus. We're building a (pretend) tool for tracking the flow of cargo across a
        handful of regions in the LANCER universe. In this first phase, you'll be able to register
        vessels and their cargo, as well as track their movements and status. It's somewhere between
        a software toy and a creative writing exercise. With the release of v3, it'll be
        incorporated into COMP/CON as a start-up screen.
      </p>
      <p class="pa-2">
        This project has two goals. The first, and by far the most important, is to make a fun thing
        to look at and click on. The second is to give me a structure I can use to rebuild and
        extend the COMP/CON backend without having to do it all at once, or in a way that poses any
        risk to existing COMP/CON data. I'm going to be using this project to test out new features
        and ideas, and to stress test some of the new systems and structures I'll be using on the
        backend.
      </p>
      <p class="pa-2">
        If you like the general idea here, but not this specific idea in particular, that's okay
        too, there'll be others coming.
      </p>
      <!-- <v-divider class="my-1" />
      <p class="pa-2">
        If this is your first time here, consider checking out the
        <a href="/main/about">ABOUT</a>
        page, which has some more information about the project and its goals, as well as some rules
        and guidelines about the type of content that will be accepted. If you're ready to jump in,
        you can pick a map from the menu in the lower right and click
        <b>OPEN</b>
        to get started.
      </p>
      <p class="pa-2">
        If you'd like to collaborate in other ways -- such as with art or code -- or if you have
        bigger ideas about how to expand this project, check out the #cc-nautilus channel in the
        LANCER Discord (or ping me directly at @beeftime).
      </p> -->
    </v-card>
  </v-container>
</template>

<script lang="ts">
// TODO: automatically reroute if we have data in localstorage

export default {
  name: 'landing',
};
</script>
