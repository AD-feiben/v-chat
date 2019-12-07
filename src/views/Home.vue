<template>
  <div class="home" @click="homeClickHandle">
    <app-bar>投喂小团队（{{ num }}）</app-bar>
    <div class="message-list">
      <div class="err-msg" v-if="err" @click="err.clickHandler">{{ err.msg }}</div>
      <div ref="msgScrollBox" class="message-content" @touchmove.stop="">
        <div ref="msgContent">
          <message-item
            v-for="(message, index) in messageList"
            :key="index"
            :message="message"/>
        </div>
      </div>
    </div>
    <input-bar ref="inputBar" @sendMsg="sendMessageHandle" @click.native.stop=""/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AppBar from '@/components/AppBar.vue';
import InputBar from '@/components/InputBar.vue';
import MessageItem from '@/components/MessageItme.vue';
import socket, { IMessage, sendMsg } from '@/utils/socket';
import { onVisibilityChange } from '@/utils/event';

let offPageVisibleChange: Function | null = null;

@Component({
  components: {
    AppBar,
    InputBar,
    MessageItem
  }
})
export default class Home extends Vue {
  'refs': {
    'msgScrollBox': HTMLDivElement;
    'msgContent': HTMLDivElement;
    'inputBar': InputBar
  }

  get messageList () {
    return this.$store.state.messageList || [];
  }

  get num () {
    return this.$store.state.userNum;
  }

  get err() {
    if (socket.disconnected) {
      return {
        msg: '你已经断开连接，点击刷新页面尝试重新连接',
        clickHandler: () => {
          location.reload();
        }
      }
    }
    return null;
  }

  @Watch('messageList', { immediate: true, deep: true })
  messageListWatcher() {
    this.scrollBottom();
  }

  homeClickHandle() {
    (this.$refs.inputBar as any).blur();
  }

  sendMessageHandle(msg: IMessage) {
    this.messageList.push(msg);
    sendMsg(msg);
  }

  scrollBottom() {
    this.$nextTick(() => {
      const maxScrollTop = (this.$refs.msgScrollBox as any).scrollHeight - (this.$refs.msgScrollBox as any).offsetHeight;
      if (maxScrollTop - (this.$refs.msgScrollBox as any).scrollTop < 150) {
        (this.$refs.msgScrollBox as any).scrollTop = maxScrollTop;
      }
    });
  }

  mounted () {
    if (Notification.permission === 'granted') {
      this.$store.commit('updateNotificationPermission', 'granted');
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        this.$store.commit('updateNotificationPermission', permission);
      });
    }


    offPageVisibleChange && offPageVisibleChange();
    offPageVisibleChange = onVisibilityChange((isHide: boolean): void => {
      if (isHide === true) return;
      this.$store.dispatch('reLogin');
    });
  }

  beforeDestroy() {
    offPageVisibleChange && offPageVisibleChange();
  }
}

</script>

<style lang="scss">
.home{
  display: flex;
  flex-direction: column;
  height: 100%;

  .err-msg{
    padding: 5px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: #ff0000;
  }
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
