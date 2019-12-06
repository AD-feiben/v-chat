import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      nickName: 'feiben'
    }
  },
  mutations: {
    updateUser(state, user) {
      state.user = Object.assign(state.user, user);
    }
  },
  actions: {
    login({ commit }, userName) {
      commit('updateUser', { nickName: userName });
    }
  },
  modules: {
  }
})
