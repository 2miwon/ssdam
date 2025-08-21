import { createStore } from 'vuex'
import accounts from './modules/accounts'
import recommend from './modules/recommend'
import books from './modules/books'
import pages from './modules/pages'
import editor from './modules/editor'
import revision from './modules/revision'
import onboarding from './modules/onboarding'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => state, // Optionally, you can customize what part of the state to persist
  asyncStorage: false, // For localStorage
  // Custom error handling for quota exceeded
  saveState: (key, state, storage) => {
      try {
        storage.setItem(key, JSON.stringify(state));
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          console.error('Quota exceeded!', e);
          storage.removeItem('imageKeyValues');
          // store.commit('CLEAR_IMAGE_KEY_VALUE');
        }
      }
  }
});

// Create a new store instance.
const store = createStore({
  plugins: [vuexLocal.plugin],
  modules: {
    accounts,
    recommend,
    books,
    pages,
    editor,
    revision,
    onboarding
  }
})

export default store