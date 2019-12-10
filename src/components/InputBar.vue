<template>
  <div class="input" :class="{ focused }">
    <div class="input-bar" @touchmove.stop="">
      <input
        v-model.trim="msg.text"
        type="text"
        ref="input"
        placeholder="Type something here..."
        @input="inputHanlde"
        @keyup.enter="sendMsg"
        @focus="onfocus"
        @blur="onblur"
      >
      <div class="emoji-btn" @click.stop="toolsClickHandle('expression')">
        <svg t="1575870582154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2224" width="28" height="28"><path d="M510.944 960c-247.04 0-448-200.96-448-448s200.992-448 448-448c247.008 0 448 200.96 448 448S757.984 960 510.944 960zM510.944 128c-211.744 0-384 172.256-384 384 0 211.744 172.256 384 384 384 211.744 0 384-172.256 384-384C894.944 300.256 722.688 128 510.944 128z" p-id="2225"></path><path d="M512 773.344c-89.184 0-171.904-40.32-226.912-110.624-10.88-13.92-8.448-34.016 5.472-44.896 13.888-10.912 34.016-8.48 44.928 5.472 42.784 54.688 107.136 86.048 176.512 86.048 70.112 0 134.88-31.904 177.664-87.552 10.784-14.016 30.848-16.672 44.864-5.888 14.016 10.784 16.672 30.88 5.888 44.864C685.408 732.32 602.144 773.344 512 773.344z" p-id="2226"></path><path d="M368 515.2c-26.528 0-48-21.472-48-48l0-64c0-26.528 21.472-48 48-48s48 21.472 48 48l0 64C416 493.696 394.496 515.2 368 515.2z" p-id="2227"></path><path d="M656 515.2c-26.496 0-48-21.472-48-48l0-64c0-26.528 21.504-48 48-48s48 21.472 48 48l0 64C704 493.696 682.496 515.2 656 515.2z" p-id="2228"></path></svg>
      </div>
      <div class="user-list" v-show="showUserList">
        <ul>
          <li
            v-for="(item, index) in userList"
            :key="index"
            @click="userClickHandle(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <transition name="tools" @after-enter="scrollBottom()">
      <expression @select="expressionSelect" v-if="toolsVisible === 'expression'"/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import socket, { IMessage, setTitle } from '@/utils/socket';
import { isMobile } from '@/utils/is';
import Expression from './Expression.vue';

interface InputEvent extends UIEvent {
  readonly data: string | null;
  readonly inputType: string;
  readonly isComposing: boolean;
}

@Component({
  components: {
    Expression
  }
})
export default class InputBar extends Vue {
  focused: boolean = false;
  showUserList: boolean = false;
  toolsVisible: string = '';
  msg: IMessage = {
    type: 'm',
    text: '',
    time: 0
  }

  'refs': {
    input: HTMLInputElement;
  }

  get nickName () {
    return this.$store.getters.nickName;
  }

  get user () {
    return this.$store.state.user;
  }

  get userList() {
    return this.$store.getters.userList.filter((name: string) => {
      return name !== this.nickName;
    });
  }

  scrollBottom () {
    this.$emit('scrollBottom');
  }

  public addText(text: string) {
    let reg = new RegExp(`${text} ?`, 'g');
    this.msg.text = this.msg.text.replace(reg, '');
    this.msg.text += text;
    this.focus();
  }

  public blur() {
    this.toolsVisible = '';
    this.showUserList = false;
    this.$refs.input && (this.$refs.input as any).blur();
  }

  public focus() {
    this.toolsVisible = '';
    this.$refs.input && (this.$refs.input as any).focus();
  }

  toolsClickHandle(val: string) {
    this.toolsVisible = this.toolsVisible !== val ? val : '';
  }

  onfocus () {
    this.toolsVisible = '';
    this.focused = true;
  }
  onblur () {
    this.focused = false;
  }

  expressionSelect(text: string) {
    this.msg.text += text;
  }

  inputHanlde(e: InputEvent) {
    this.showUserList = e.data === '@';
  }

  userClickHandle(userName: string) {
    this.msg.text = this.msg.text.substring(0, this.msg.text.length - 1);
    this.addText(`@${userName} `);
    this.showUserList = false;
  }

  sendMsg() {
    if (this.msg.text) {
      this.$emit('sendMsg', Object.assign({}, { ...this.msg, ...{ user: this.user }}));
      if (this.msg.text.substring(0, 5) === '修改群名：') {
        let title = this.msg.text.substr(5) || '群聊';
        setTitle(title);
      }
      if (this.msg.text.substring(0, 7) === '@群聊小助手 ') {
        let [event, msg] = this.msg.text.substr(7).split(':');
        socket.emit(event, msg);
      }
    }

    if (this.msg.text === '当前人数') {
      socket.emit('get users')
      // this.$store.dispatch('showUserList');
    }
    isMobile() && this.blur();
    this.msg.text = '';
  }
}

</script>

<style lang="scss">
.tools-enter-active,
.tools-leave-active {
  transition: 0.14s ease-in;
}
.tools-enter,
.tools-leave-active {
  opacity: 0;
  height: 0;
  transform: translateY(20px);
}
.input{
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #000;
  &.focused{
    padding-bottom: 0;
  }
}
.input-bar{
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;

  input{
    flex: 1;
    height: 40px;
    padding: 0 10px;
    font-size: 16px;
    border: none;
    outline: none;
    border-radius: 2px;
    color: #fff;
    background-color: #333;
    overflow: auto;
  }
  .emoji-btn{
    display: flex;
    align-items: center;
    margin-left: 10px;
    fill: #fff;
  }

  .user-list{
    position: absolute;
    bottom: 60px;
    bottom: calc(60px + env(safe-area-inset-bottom));
    left: 20px;
    width: auto;
    min-width: 100px;
    height: auto;
    max-height: 200px;
    overflow: auto;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 20px 5px rgba($color: #000000, $alpha: .1);
    li{
      padding: 10px;
      line-height: 25px;
      border-bottom: 1px solid #f2f2f2;
      cursor: pointer;
      &:nth-of-type(2n + 2){
        background-color: #f4f4f4;
      }
    }
  }
}
</style>
