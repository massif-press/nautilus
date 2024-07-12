<template>
  <v-card
    :class="depth > 0 ? 'border-s-md rounded-0' : 'border-sm mt-2'"
    flat
    class="pl-1 pb-1"
    :style="depth > 30 ? 'margin-left: -6px' : `margin-left: 4px`">
    <div class="text-caption ml-n3">
      <v-btn
        variant="text"
        size="small"
        color="secondary"
        class="mt-n1"
        :to="`/main/compendium/authors/${commenter.Name}`">
        {{ commenter.Name }}
      </v-btn>
      <span class="ml-2 text-disabled">{{ new Date(comment.createdAt).toLocaleString() }}</span>
      <v-menu v-if="isMod && !comment.mod_id">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="purple-accent-1"
            variant="plain"
            size="x-small"
            class="ml-6"
            prepend-icon="mdi-delete">
            Erase Comment Content (Mod)
          </v-btn>
        </template>
        <v-list class="bg-red" density="compact">
          <v-list-item
            title="Click to Confirm"
            prepend-icon="mdi-eraser"
            @click="$emit('erase', comment)" />
        </v-list>
      </v-menu>
    </div>
    <p v-if="comment.mod_id" class="text-caption text-disabled font-italic">
      &mdash; Comment removed by moderator &mdash;

      <div v-if="isMod" class="mx-4">
        <v-btn size=x-small color=purple-accent-1 variant="tonal" @click="showModContent = !showModContent">View original content (mod)</v-btn>
        <v-fade-transition>
        <v-card v-if="showModContent" variant="tonal" class="py-1 px-4">
          {{ comment.content }}>
        </v-card>
        </v-fade-transition>
      </div>

    </p>
    <p v-else class="pl-3">{{ comment.content }}</p>
    <div class="ml-4 mt-n1">
      <v-btn
        v-if="!comment.mod_id"
        color="accent"
        variant="plain"
        size="x-small"
        prepend-icon="mdi-reply"
        @click="reply = true">
        Reply
      </v-btn>
    </div>
    <v-expand-transition>
      <v-card v-if="reply" class="mt-4 mx-auto">
        <v-textarea
          v-model="replyContent"
          density="compact"
          placeholder="Enter new comment..."
          maxlength="5500"
          auto-grow
          counter />
        <v-card-actions class="py-0">
          <v-btn color="error" size="small" variant="tonal" @click="replyContent = ''">Clear</v-btn>
          <v-spacer />
          <v-btn color="error" size="small" variant="tonal" @click="reply = false">Cancel</v-btn>
          <v-btn color="accent" size="small" variant="tonal" class="ml-6" @click="submit()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
    <div class="text-caption text-right"></div>
    <comment-item
      v-for="c in comment.children"
      :comment="c"
      :depth="depth + 1"
      @submit="$emit('submit', $event)"
      @erase="$emit('erase', $event)" />
  </v-card>
</template>

<script lang="ts">
import { Author } from '../../../models/author';
import { useDataStore } from '../../../stores/dataStore';
import { useUserStore } from '../../../stores/userStore';

export default {
  name: 'CommentItem',
  props: {
    comment: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  emits: ['submit', 'erase'],
  data: () => ({
    reply: false,
    replyContent: '',
    showModContent: false,
  }),
  computed: {
    commenter(): Author {
      return useDataStore().author(this.comment.author_id);
    },
    isMod(): boolean {
      return useUserStore().is_mod;
    },
  },
  methods: {
    submit(): void {
      this.$emit('submit', {
        content: this.replyContent,
        parentId: this.comment.id,
      });
      this.reply = false;
      this.replyContent = '';
    },
  },
};
</script>
