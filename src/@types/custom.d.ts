/// <reference types="socket.io-client" />
declare module 'socket.io-client';


interface IObj<T> {
  [key: string]: T;
  [key: number]: T;
}
