import Vue from 'vue'
import Vuex from 'vuex'
import { setLocal, getLocal } from '@/utils/local';
import { IUser, IMessage, login, logout } from '@/utils/socket';
import router from '@/router';

const NICK_NAME_KEY = 'name';
const MESSAGE_KEY = 'msg';

interface IRootState {
  user: {
    nickName: string;
  };
  userList: string[];
  messageList: IMessage[];
  userNum: number;
  notificationPermission: 'granted' | 'denied' | 'default';
  socketLogin: boolean;
  groupTitle: string;
}

Vue.use(Vuex)

const store = new Vuex.Store<IRootState>({
  state: {
    user: {
      nickName: ''
    },
    userList: [],
    messageList: [],
    userNum: 0,
    notificationPermission: 'default',
    socketLogin: false,
    groupTitle: ''
  },
  getters: {
    nickName(state) {
      return state.user.nickName;
    },
    isLogin(state) {
      return state.user.nickName !== '';
    },
    socketLogin(state) {
      return state.socketLogin;
    },
    userList(state) {
      return state.userList;
    },
    groupTitle(state) {
      return state.groupTitle;
    }
  },
  mutations: {
    updateUser(state, user) {
      setLocal(NICK_NAME_KEY, user);
      state.user = Object.assign(state.user, user);
    },
    updateMessageList(state, messageList) {
      let localMsgList = messageList.filter((item: IMessage) => {
        return item.type !== 's';
      });
      if (localMsgList.length > 100) {
        localMsgList.splice(0, localMsgList.length - 100);
      }
      setLocal(MESSAGE_KEY, localMsgList);
      state.messageList = messageList;
    },
    updateUserNum(state, num: number) {
      state.userNum = num;
    },
    updateNotificationPermission(state, notificationPermission) {
      state.notificationPermission = notificationPermission;
    },
    updateSocketLogin(state, socketLogin) {
      state.socketLogin = socketLogin;
    },
    updateUserList(state, userList) {
      state.userList = [].concat(userList);
    },
    updateGroupTitle(state, groupTitle) {
      state.groupTitle = groupTitle;
    }
  },
  actions: {
    setGroupTitle({ commit }, title) {
      commit('updateGroupTitle', title);
    },
    sendTitleMsg({ dispatch }, data) {
      const { username, title } = data;
      dispatch('setGroupTitle', title);
      dispatch('addMessage', {
        type: 'o',
        text: `${username} 修改群名称为： ${title}`,
        user: {
          nickName: '群聊小助手'
        }
      });
    },
    showUserList({ state, dispatch }) {
      dispatch('addMessage', {
        type: 'o',
        text: `当前人数为 ${
          state.userList.length
        } 人, 分别是 ${state.userList.join('，')}`,
        user: {
          nickName: '群聊小助手'
        }
      });
    },
    setMessage({ commit }) {
      commit('updateMessageList', getLocal(MESSAGE_KEY) || []);
    },
    addMessage({ state, commit }, message: IMessage) {
      commit('updateMessageList', state.messageList.concat([message]));
    },
    login({ commit }, userName) {
      commit('updateUser', { nickName: userName });
      login(userName);
    },
    reLogin({ dispatch }) {
      const userInfo = getLocal(NICK_NAME_KEY) as IUser;
      if (userInfo && userInfo.nickName !== '') {
        dispatch('login', userInfo.nickName);
      } else {
        router.replace({ name: 'login' });
      }
    },
    logout({ commit }) {
      commit('updateUser', { nickName: '' });
      commit('updateMessageList', []);
      logout();
    }
  },
  modules: {}
});

store.dispatch('setMessage');

export default store;
