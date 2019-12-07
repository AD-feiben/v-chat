<template>
  <div class="home">
    <app-bar>投喂小团队（{{ num }}）</app-bar>
    <div class="message-list">
      <div ref="msgContent" class="message-content" @touchmove.stop="">
        <message-item
          v-for="(message, index) in messageList"
          :key="index"
          :message="message"/>
      </div>
    </div>
    <input-bar @sendMsg="sendMessageHandle"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AppBar from '@/components/AppBar.vue';
import InputBar from '@/components/InputBar.vue';
import MessageItem from '@/components/MessageItme.vue';
import socket, { IMessage } from '@/utils/socket';

@Component({
  components: {
    AppBar,
    InputBar,
    MessageItem
  }
})
export default class Home extends Vue {
  messageList: IMessage[] = [];
  num: number = 0;

  'refs': {
    'msgContent': HTMLDivElement;
  }

  @Watch('messageList', { immediate: true, deep: true })
  messageListWatcher() {
    this.scrollBottom();
  }

  sendMessageHandle(msg: IMessage) {
    this.messageList.push(msg);
    socket.sendMsg(msg);
  }

  scrollBottom() {
    this.$nextTick(() => {
      (this.$refs.msgContent as any).scrollTop = (this.$refs.msgContent as any).scrollHeight;
    });
  }

  mounted () {
    socket.on('user joined', (data: any): void => {
      this.num = data.numUsers;
      this.messageList.push({
        type: 's',
        text: `${data.username} 加入群聊`
      });
    })
    socket.on('user left', (data: any): void => {
      this.num = data.numUsers;
      this.messageList.push({
        type: 's',
        text: `${data.username} 退出群聊`
      });
    })
    socket.on('new message', (data: any): void => {
      this.messageList.push({
        type: 'o',
        text: data.message,
        user: {
          nickName: data.username
        }
      });
    });

    socket.on('login', (data: any): void => {
      this.num = data.numUsers;
      this.messageList.push({
        type: 's',
        text: 'Welcome to VChat'
      });
    })
  }
}

</script>

<style lang="scss">
.home{
  display: flex;
  flex-direction: column;
  height: 100%;
  .message-list{
    flex: 1;
    overflow: hidden;
  }
  .message-content{
    height: 100%;
    overflow-y: auto;
  }
}
</style>
