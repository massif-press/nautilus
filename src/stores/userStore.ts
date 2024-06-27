import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    user_id: '',
    discord: '',
    attribution: '',
    dev_access: false,
    image_submission: false,
    show_discord: false,
    loaded: false,
    is_mod: false,
  }),
  actions: {
    async load() {
      this.username = 'TEST USER';
      this.user_id = '0000-0000-0000-0000';
      this.image_submission = false;
      this.is_mod = false;

      this.loaded = true;
    },
  },
});
