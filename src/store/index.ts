import Vue from 'vue'
import Vuex from 'vuex'
import { setLocal, getLocal } from '@/utils/local';
import socket, { IUser } from '@/utils/socket';

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
      commit('updateUser', { nickName: userName });
      socket.login(userName);
    },
    logout({ commit }) {
      commit('updateUser', { nickName: '' });
      socket.exit();
    }
  },
  modules: {
  }
})

const userInfo = getLocal(NICK_NAME_KEY) as IUser;
if (userInfo && userInfo.nickName !== '') {
  store.dispatch('login', userInfo.nickName);
}

export default store;
