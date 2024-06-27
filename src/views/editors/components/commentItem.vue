<template>
  <v-card
    :class="depth > 0 ? 'border-s-md rounded-0' : 'border-sm mt-2'"
    flat
    class="px-2 pb-1"
    :style="`margin-left: ${4 * depth}px`">
    <div class="text-caption ml-n3">
      <v-btn variant="text" size="small" color="secondary" class="mt-n1">
        {{ comment.commenter }}
      </v-btn>
      <span class="ml-2 text-disabled">{{ new Date(comment.createdAt).toLocaleString() }}</span>
    </div>
    <p class="pl-3">{{ comment.content }}</p>
    <div class="ml-4 mt-n1">
      <v-btn
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
          hide-details />
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
      @submit="$emit('submit', $event)" />
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'CommentItem',
  props: {
    comment: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  emits: ['submit'],
  data: () => ({
    reply: false,
    replyContent: '',
  }),
  computed: {
    activeDepth(): number {
      return Math.min(this.depth, 6);
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
