import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    user_id: '',
    discord: '',
    dev_access: false,
    show_discord: false,
  }),
  actions: {
    loadUser() {
      this.username = 'TEST USER';
      this.user_id = '0000-0000-0000-0000';
    },
  },
});
