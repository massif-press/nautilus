<template>
  <comment-item
    v-for="c in nestedComments"
    :comment="<any>c"
    :depth="0"
    @submit="addNestedComment($event)"
    @erase="modDeleteComment($event)" />
  <v-expand-transition>
    <v-card v-if="newComment" class="mt-4 mx-auto">
      <v-textarea
        v-model="newCommentContent"
        density="compact"
        placeholder="Enter new comment..."
        hide-details />
      <v-card-actions class="py-0">
        <v-btn color="error" size="small" variant="tonal" @click="newCommentContent = ''">
          Clear
        </v-btn>
        <v-spacer />
        <v-btn color="error" size="small" variant="tonal" @click="newComment = false">Cancel</v-btn>
        <v-btn
          color="accent"
          size="small"
          variant="tonal"
          class="ml-6"
          :loading="loading"
          @click="addComment()">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-expand-transition>
  <div v-if="!newComment" class="text-right mt-2">
    <v-btn color="primary" prepend-icon="mdi-comment-plus" @click="newComment = true">
      Add Comment
    </v-btn>
  </div>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top right"
    class="pa-0">
    <v-alert :icon="snackbar.icon" variant="outlined">{{ snackbar.text }}</v-alert>
  </v-snackbar>
</template>

<script lang="ts">
import _ from 'lodash';
import { v4 as uid } from 'uuid';
import CommentItem from './commentItem.vue';
import { useUserStore } from '../../../stores/userStore';
import { postComment } from '../../../api';

export default {
  name: 'CommentsPage',
  components: {
    CommentItem,
  },
  props: {
    item: { type: Object, required: true },
    comments: { type: Array, required: true },
  },
  data: () => ({
    newComment: false,
    newCommentContent: '',
    snackbar: {
      show: false,
      text: '',
      color: '',
      icon: '',
      timeout: 3000,
    },
    loading: false,
  }),
  emits: ['refresh'],
  computed: {
    nestedComments() {
      const commentMap = new Map();

      // Create a map of comments by their ID
      this.comments.forEach((comment) => commentMap.set(comment.id, { ...comment, children: [] }));

      // Iterate through the comments and nest them
      const nestedComments = [] as any[];
      commentMap.forEach((comment) => {
        if (comment.parent_id) {
          commentMap.get(comment.parent_id).children.push(comment);
        } else {
          nestedComments.push(comment);
        }
      });

      return nestedComments;
    },
  },
  methods: {
    async addComment(parentId = '', content?: string) {
      this.loading = true;
      if (content || this.newCommentContent) {
        const comment = {
          item_id: this.item.ID,
          id: uid(),
          parent_id: parentId,
          author_id: useUserStore().user_id,
          content: content ? content : this.newCommentContent,
          createdAt: Date.now(),
        };

        try {
          await postComment(comment);

          this.newCommentContent = '';
          this.newComment = false;

          this.snackbar.show = true;
          this.snackbar.text = 'Comment added successfully.';
          this.snackbar.color = 'success';
          this.snackbar.icon = 'mdi-check';
          this.refresh();
        } catch (error) {
          console.error('Error adding comment:', error);

          this.snackbar.show = true;
          this.snackbar.text = 'Error adding comment.';
          this.snackbar.color = 'error';
          this.snackbar.icon = 'mdi-alert-circle';
        } finally {
          this.loading = false;
        }
      }
    },
    async modDeleteComment(comment: any) {
      const editedComment = {
        item_id: this.item.ID,
        id: comment.id,
        parent_id: comment.parent_id,
        author_id: comment.author_id,
        content: comment.content,
        createdAt: comment.createdAt,
        mod_id: useUserStore().user_id,
        updatedAt: Date.now(),
      };

      try {
        await postComment(editedComment);

        comment = editedComment;

        this.snackbar.show = true;
        this.snackbar.text = 'Comment cleared successfully.';
        this.snackbar.color = 'success';
        this.snackbar.icon = 'mdi-check';
        this.refresh();
      } catch (error) {
        console.error('Error adding comment:', error);

        this.snackbar.show = true;
        this.snackbar.text = 'Error removing comment content.';
        this.snackbar.color = 'error';
        this.snackbar.icon = 'mdi-alert-circle';
      }
    },
    refresh() {
      this.$emit('refresh');
    },
    addNestedComment(payload: { parentId: string; content: string }) {
      this.addComment(payload.parentId, payload.content);
    },
    findById(items, id) {
      let result = null;

      function search(items) {
        for (const item of items) {
          if (item.id === id) {
            result = item;
            return;
          }
          if (item.children) {
            search(item.children);
            if (result) return;
          }
        }
      }

      search(items);
      return result;
    },
  },
};
</script>
