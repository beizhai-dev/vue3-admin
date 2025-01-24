import { defineStore } from 'pinia';
interface OwlState {
  isPasswordFocused: boolean;
}

export const useOwlStore = defineStore('owlStore', {
  state: (): OwlState => ({
    isPasswordFocused: false
    // Initialize other state properties here
  }),
  getters: {
    getPasswordFocused(state: OwlState): boolean {
      return state.isPasswordFocused;
    }
  },
  actions: {
    setPasswordFocused(focused: boolean) {
      this.isPasswordFocused = focused;
    },
    resetOwlState() {
      this.isPasswordFocused = false;
    }
  }
});
