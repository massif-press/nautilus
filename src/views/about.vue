<template>
  <v-container>
          <v-alert variant="outlined" color="accent" density="compact">
        Data updates occur every 15 minutes. When new data is available the database icon (
        <v-icon size="x-small" icon="mdi-database-outline" />
        ) on the bottom left of your screen will turn
        <b class="text-success">green</b>
      </v-alert>
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>About Nautilus</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">
          Nautilus is a collaborative worldbuilding project about interstellar logistics in the
          Lancer universe. Within the fiction, it is an IPS-N network for tracking and managing the
          flow of cargo across the universe, akin to contemporary
          <a href="" target="_blank" class="pr-1">maritime</a>
          <a href="" target="_blank" class="pr-1">tracking</a>
          <a href="" target="_blank" >software</a>
          .
          <br />
          In the real world it's an exercise in collaborative worldbuilding for fans of the LANCER
          RPG. Anyone with a COMP/CON login can can register and elaborate on vessels, ports, stations,
          interplanetary infrastructure, and so on.
        </p>

      </v-card-text>
    </v-card>
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>Using Nautilus</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">to do</p>
      </v-card-text>
    </v-card>
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>Submission Guidelines</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">
          This project is tonally different from the HORUS chatlogs, so I'm going to be a little
          more picky about what gets through the gate. Please try to keep everything lore-accurate
          to the official MASSIF releases.
        </p>
        <p class="py-2">
          That's not to say nods to community content, other homebrew, or your (or your table's)
          original ideas aren't welcome, but they should be grounded in the official setting. If
          you're not sure, ask in the #cc-nautilus channel on the LANCER Discord.
        </p>
        <p class="py-2">
          There are a few things that are definitely off-limits:
          <ul class="py-2 ml-8">
            <li>Personally identifiable information</li>
            <li>Explicit or inappropriate content</li>
            <li>Stuff lifted from other media, or content that is not owned by your or Massif</li>
            <li>AI generated content</li>
          </ul>
          Beyond this I'll be using my discretion to select for content that fits tone and theme. If you're not sure, ask. I want your stuff to be in here.
        </p>
      </v-card-text>
    </v-card>
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>Release Info</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">
          This will probably remain up indefinitely, but don't hold me to that. The repo(s), however, will always be open and free. At some point prior to v3 release I'll be taking what we have and incorporating it into COMP/CON as a start-up screen. I'll be sure to give everyone a heads up before I do that, and I'll be sure to credit everyone who's contributed.
        </p>
        <p class="py-2">
          After that, there'll be another project (and probably at least one more after that). If this one is still seeing activity, I'll keep it up, and we'll figure out some sort of update schedule. If you want to help maintain this project, or have ideas for future projects, let me know in the #cc-nautilus channel on the LANCER Discord. We'll work something out!
        </p>
      </v-card-text>
    </v-card>    
    <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>FAQ</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">
          <div class="text-h6">What about stuff that isn't creatable in the editor? New regions?</div>
          <div class="blockquote border-s-xl mt-1">
            In all cases, let me know in the #cc-nautilus channel on the LANCER Discord. If it's something minor (like a new tag or vessel type) it can be added very easily. If it's something major, or will require new map assets (like a new region or planet) we can talk about it and figure out a way to make it work.<br> I'm <u>very</u> open to expanding the scope of this project, but I want to make sure it's done in a way that's sustainable and doesn't compromise the quality of the existing content.
            <br>
            If it's something that's not possible in the editor, but you think it should be, also let me know in the Discord. I'm always looking for ways to improve the editor, and I'm happy to take suggestions. However, once this gets off the ground I'll be focusing on the COMP/CON v3 release, so it might be a (long) while before I can get to it. If you want to take a crack at it yourself, let me know and we'll figure out a way to get you the assets you need so you can make a PR.
          </div>
        </p>
      </v-card-text>
    </v-card>
        <v-card variant="text" max-width="800px" class="mx-auto pt-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>CONTACT</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p class="py-2">
          You can reach me at <code>beeftime</code> on Discord, or <code>@beeftime99</code> on Twitter. I'll be in (as much as I am able) the #cc-nautilus channel on the LANCER Discord. If you have questions, comments, or concerns, please don't hesitate to reach out.
          <br>
          If you can't get to either for any reason, you can create a new issue on the <a href="https://github.com/massif-press/nautilus" target="_blank">Github repo</a>. I'll be checking those periodically.
        </p>
      </v-card-text>
    </v-card>       
    <div class="text-right text-caption">
      Revisit the
      <v-btn variant="text" size="x-small" color="accent" to="/main/landing">Landing Page</v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'About',
};
</script>
