<template>
  <div class="home" @click="homeClickHandle">
    <app-bar>{{ groupTitle }}（{{ num }}）</app-bar>
    <div class="message-list" :class="{ pbsafe: !socketLogin }">
      <div class="err-msg" v-if="err" @click="err.clickHandler">{{ err.msg }}</div>
      <div ref="msgScrollBox" class="message-content" @touchmove.stop="">
        <div ref="msgContent">
          <message-item
            v-for="(message, index) in messageList"
            :key="index"
            :message="message"
            @at="atHandle"
            @needFocus="focusHandle"/>
        </div>
      </div>
    </div>
    <input-bar
      v-if="socketLogin"
      ref="inputBar"
      @sendMsg="sendMessageHandle"
      @scrollBottom="scrollBottom(true)"
      @click.native.stop=""/>
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

  get groupTitle () {
    return this.$store.getters.groupTitle || '投喂小团队';
  }

  get messageList () {
    return this.$store.state.messageList || [];
  }

  get num () {
    return this.$store.state.userNum;
  }

  get socketLogin () {
    return this.$store.getters.socketLogin;
  }

  get err() {
    if (!this.socketLogin) {
      return {
        msg: '已断开连接，正在重新连接...长时间没反应可点击刷新',
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

  atHandle(userName: string) {
    (this.$refs.inputBar as any).addText(userName);
  }

  focusHandle() {
    (this.$refs.inputBar as any).focus();
  }

  homeClickHandle() {
    this.$refs.inputBar && (this.$refs.inputBar as any).blur();
  }

  sendMessageHandle(msg: IMessage) {
    // this.$store.dispatch('addMessage', msg);
    sendMsg(msg);
    this.scrollBottom(true);
  }

  scrollBottom(ignoreCondition?: boolean) {
    this.$nextTick(() => {
      const maxScrollTop = (this.$refs.msgScrollBox as any).scrollHeight - (this.$refs.msgScrollBox as any).offsetHeight;
      if (ignoreCondition === true) {
        return (this.$refs.msgScrollBox as any).scrollTop = maxScrollTop;
      }
      const scrollTop = (this.$refs.msgScrollBox as any).scrollTop;
      if (maxScrollTop - scrollTop < 200 || scrollTop === 0) {
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
    &.pbsafe{
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  .message-content{
    height: 100%;
    overflow-y: auto;
  }
}
</style>
