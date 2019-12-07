<template>
  <div class="home">
    <app-bar>投喂小团队（{{ num }}）</app-bar>
    <div class="message-list">
      <div class="message-content">
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
import { Component, Vue } from 'vue-property-decorator';
import AppBar from '@/components/AppBar.vue';
import InputBar from '@/components/InputBar.vue';
import MessageItem, { IMessage } from '@/components/MessageItme.vue';


export interface IUser {
  nickName: string;
}

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
  sendMessageHandle(msg: IMessage) {
    this.messageList.push(msg);
  }

  mounted () {
    this.$sockets.subscribe('user joined', (data: any): void => {
      this.num = data.numUsers;
      this.messageList.push({
        type: 's',
        text: `${data.username} 加入群聊`
      })
    })
    this.$sockets.subscribe('user left', (data: any): void => {
      this.num = data.numUsers;
      this.messageList.push({
        type: 's',
        text: `${data.username} 退出群聊`
      })
    })
    this.$sockets.subscribe('new message', (data: any): void => {
      this.messageList.push({
        type: 'o',
        text: data.message,
        user: {
          nickName: data.username
        }
      })
    });
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
  }
}
</style>
