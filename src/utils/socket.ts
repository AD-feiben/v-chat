import io from 'socket.io-client';
import store from '@/store';

export interface IUser {
  nickName: string;
}

export interface IMessage {
  type: 'm' | 'o' | 's';
  text: string;
  user?: IUser;
}

const url = `//117.48.206.189`;
const options = {
  path: '/socket.io',
  transports: ['websocket'],
  timeout: 5000,
  reconnectionDelayMax: 5000
};

export const socket = io(url, options);

export const login = (userName: string) => {
  socket.emit('add user', userName);
  heartbeat();
}

let heartbeatTimer: number = 0;

export const logout = () => {
  socket.removeAllListeners();
  socket.disconnect();
  heartbeatTimer && window.clearTimeout(heartbeatTimer);
  socket.open();
}

export const sendMsg = (msg: IMessage) => {
  socket.emit('new message', msg.text);
}

export const setTitle = (title: string) => {
  socket.emit('set title', title);
}

const heartbeat = () => {
  heartbeatTimer && window.clearTimeout(heartbeatTimer);
  heartbeatTimer = setTimeout(() => {
    socket.emit('heartbeat');
    heartbeat();
  }, 20000);
}

socket.on('login', (data: any): void => {
  store.commit('updateUserNum', data.numUsers);
  store.commit('updateUserList', data.users);
  store.dispatch('addMessage', {
    type: 's',
    text: `Hi ${store.getters.nickName} Welcome to VChat`
  });
  store.commit('updateSocketLogin', true);
  store.dispatch('setGroupTitle', data.title);
  store.dispatch('showUserList');
});
socket.on('user joined', (data: any): void => {
  store.commit('updateUserNum', data.numUsers);
  store.dispatch('addMessage', {
    type: 's',
    text: `${data.username} 加入群聊`
  });
  store.commit('updateUserList', data.users);
  store.dispatch('showUserList');
});
socket.on('user left', (data: any): void => {
  store.commit('updateUserNum', data.numUsers);
  store.dispatch('addMessage', {
    type: 's',
    text: `${data.username} 退出群聊`
  });
  store.commit('updateUserList', data.users);
  store.dispatch('showUserList');
});
socket.on('new message', (data: any): void => {
  if (store.state.notificationPermission === 'granted') {
    new Notification('VChat 收到消息', {
      body: data.message,
      tag: 'vchat',
      renotify: true
    });
  }
  store.dispatch('addMessage', {
    type: 'o',
    text: data.message,
    user: {
      nickName: data.username
    }
  });
});

socket.on('set title', (data: any) => {
  store.dispatch('sendTitleMsg', data);
});

socket.on('user list', (data: any) => {
  store.commit('updateUserList', data.users);
  store.dispatch('showUserList');
});

socket.on('disconnect', () => {
  store.commit('updateSocketLogin', false);
  store.dispatch('reLogin');
});

export default socket;
