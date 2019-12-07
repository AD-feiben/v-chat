import Vue from 'vue'
import Vuex from 'vuex'
import { setLocal, getLocal } from '@/utils/local';
import { login } from '@/utils/scoket';

const NICK_NAME_KEY = 'name';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      nickName: ''
    }
  },
  getters: {
    isLogin (state) {
      return state.user.nickName !== '';
    }
  },
  mutations: {
    updateUser(state, user) {
      setLocal(NICK_NAME_KEY, user);
      state.user = Object.assign(state.user, user);
    }
  },
  actions: {
    login({ commit }, userName) {
      login(userName);
      commit('updateUser', { nickName: userName });
    },
    logout({ commit }) {
      commit('updateUser', { nickName: '' });
    }
  },
  modules: {
  }
})

store.commit('updateUser', getLocal(NICK_NAME_KEY));

export default store;
