import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { setLocal, getLocal } from '@/utils/local';
import socket, { IUser, IMessage } from '@/utils/socket';

const NICK_NAME_KEY = 'name';

interface IRootState {
  user: {
    nickName: string;
  };
  messageList: IMessage[];
  userNum: number;
}

Vue.use(Vuex)

const store = new Vuex.Store<IRootState>({
  state: {
    user: {
      nickName: ''
    },
    messageList: [],
    userNum: 0
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
    },
    updateMessageList(state, messageList) {
      state.messageList = messageList;
    },
    addMessage(state, message: IMessage) {
      state.messageList = state.messageList.concat([ message ]);
    },
    updateUserNum(state, num: number) {
      state.userNum = num;
    }
  },
  actions: {
    login({ commit }, userName) {
      commit('updateUser', { nickName: userName });
      socket.login(userName);
      socket.on('login', (data: any): void => {
        commit('updateUserNum', data.numUsers)
        commit('addMessage', {
          type: 's',
          text: 'Welcome to VChat'
        })
      })
    },
    logout({ commit }) {
      commit('updateUser', { nickName: '' });
      commit('updateMessageList', []);
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
