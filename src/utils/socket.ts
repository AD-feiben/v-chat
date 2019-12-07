import io from 'socket.io-client';

export interface IUser {
  nickName: string;
}

export interface IMessage {
  type: 'm' | 'o' | 's';
  text: string;
  user?: IUser;
}

export let isConnected: boolean = false;

const url = 'ws://117.48.206.189'
const options = {
  path: '/socket.io',
  transports: ['websocket'],
  timeout: 5000,
  reconnectionDelayMax: 5000
};

class ChatSocket {
  public static isLogin: boolean = false;
  public static instance: SocketIOClient.Socket | null = null;
  public static timer: number = 0;

  constructor () {
    ChatSocket.getInstance();
  }

  public static getInstance(): SocketIOClient.Socket {
    if (ChatSocket.instance === null) {
      ChatSocket.instance = io(url, options);
    }
    return ChatSocket.instance;
  }

  public login (userName: string) {
    if (ChatSocket.getInstance().connected === false) {
      ChatSocket.getInstance().connect();
    }
    if (ChatSocket.isLogin === true) { return; }
    ChatSocket.getInstance().emit('add user', userName);
    ChatSocket.isLogin = true;
    this.reconnect();
    this.heartbeat();
  }

  public sendMsg(msg: IMessage) {
    if (ChatSocket.getInstance().connected === false) {
      ChatSocket.getInstance().connect();
    }
    ChatSocket.getInstance().emit('new message', msg.text);
  }

  public on(eventName: string, cb: Function) {
    ChatSocket.getInstance().on(eventName, cb);
  }

  private heartbeat() {
    ChatSocket.timer && window.clearTimeout(ChatSocket.timer);
    ChatSocket.timer = setTimeout(() => {
      ChatSocket.getInstance().emit('heartbeat');
      this.heartbeat();
    }, 30000);
  }

  private reconnect() {
    ChatSocket.getInstance().on('disconnect', () => {
      ChatSocket.isLogin && ChatSocket.getInstance().connect();
    })
  }

  public exit() {
    ChatSocket.isLogin = false;
    ChatSocket.getInstance().disconnect();
    ChatSocket.getInstance().removeAllListeners();
    ChatSocket.timer && window.clearTimeout(ChatSocket.timer);
  }
}

export default new ChatSocket();
