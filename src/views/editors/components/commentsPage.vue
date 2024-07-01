<template>
  <v-container class="px-12">
    <div class="text-center">
      <div class="text-h3">{{ item.Title || item.Name }}</div>
      <div class="text-caption mb-n2">
        Review Status:
        <b class="text-success">{{ item.Status }}</b>
      </div>
    </div>
    <v-divider class="my-4" />
    <comment-item
      v-for="c in test_comments"
      :comment="c"
      :depth="0"
      @submit="addNestedComment($event)" />
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
          <v-btn color="error" size="small" variant="tonal" @click="newComment = false">
            Cancel
          </v-btn>
          <v-btn color="accent" size="small" variant="tonal" class="ml-6" @click="addComment()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
    <div v-if="!newComment" class="text-right mt-2">
      <v-btn color="primary" prepend-icon="mdi-comment-plus" disabled @click="newComment = true">
        Add Comment
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import CommentItem from './commentItem.vue';

export default {
  name: 'CommentsPage',
  components: {
    CommentItem,
  },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    newComment: false,
    newCommentContent: '',
    test_comments: [
      {
        id: 'testcomment-1',
        content: 'This is a test comment.',
        commenter: 'Test User',
        createdAt: '2021-10-01T00:00:00Z',
        children: [
          {
            id: 'testcomment-2',
            content: 'This is a test reply.',
            commenter: 'Test User 2',
            createdAt: '2021-10-01T00:01:00Z',
            children: [],
          },
        ],
      },
      {
        id: 'testcomment-3',
        content: 'This is another test comment.',
        commenter: 'Test User',
        createdAt: '2021-10-01T00:02:00Z',
        children: [],
      },
      {
        id: 'testcomment-4',
        content: 'This is a third test comment.',
        commenter: 'Test User',
        createdAt: '2021-10-01T00:03:00Z',
        children: [
          {
            id: 'testcomment-5',
            content: 'This is a test reply to the third comment.',
            commenter: 'Test User 2',
            createdAt: '2021-10-01T00:04:00Z',
            children: [],
          },
          {
            id: 'testcomment-6',
            content: 'This is another test reply to the third comment.',
            commenter: 'Test User 3',
            createdAt: '2021-10-01T00:05:00Z',
            children: [],
          },
        ],
      },
    ],
  }),
  methods: {
    addComment() {
      if (this.newCommentContent) {
        this.test_comments.push({
          id: _.uniqueId(),
          content: this.newCommentContent,
          commenter: 'Test User',
          createdAt: new Date().toISOString(),
          children: [],
        });
        this.newCommentContent = '';
        this.newComment = false;
      }
    },
    addNestedComment(payload) {
      const parent = this.findById(this.test_comments, payload.parentId);
      if (parent) {
        parent.children.push({
          id: _.uniqueId(),
          content: payload.content,
          commenter: 'Test User',
          createdAt: new Date().toISOString(),
          children: [],
        });
      }
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
