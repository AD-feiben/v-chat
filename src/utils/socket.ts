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

let isLogin: boolean = false;

export const login = (userName: string) => {
  if (isLogin) { return; }
  if (socket.disconnect) { socket.connect() }
  socket.emit('add user', userName);
  isLogin = true;
  heartbeat();
}

let heartbeatTimer: number = 0;

export const logout = () => {
  isLogin = false;
  socket.removeAllListeners();
  socket.disconnect();
  heartbeatTimer && window.clearTimeout(heartbeatTimer);
  socket.open();
}

export const sendMsg = (msg: IMessage) => {
  socket.emit('new message', msg.text);
}

const heartbeat = () => {
  heartbeatTimer && window.clearTimeout(heartbeatTimer);
  heartbeatTimer = setTimeout(() => {
    socket.emit('heartbeat');
    heartbeat();
  }, 30000);
}

socket.on('disconnect', () => {
  logout();
  store && store.dispatch('reLogin');
});

export default socket;
