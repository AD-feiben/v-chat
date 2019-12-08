<template>
  <div class="input-bar">
    <input
      v-model.trim="msg.text"
      type="text"
      ref="input"
      placeholder="Type something here..."
      @input="inputHanlde"
      @keyup.enter="sendMsg"
    >
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IMessage, setTitle } from '@/utils/socket';
import { isMobile } from '@/utils/is';

interface InputEvent extends UIEvent {
  readonly data: string | null;
  readonly inputType: string;
  readonly isComposing: boolean;
}

@Component
export default class InputBar extends Vue {
  showUserList: boolean = false;
  msg: IMessage = {
    type: 'm',
    text: ''
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

  public addText(text: string) {
    this.msg.text += text;
  }

  public blur() {
    this.showUserList = false;
    this.$refs.input && (this.$refs.input as any).blur();
  }

  public focus() {
    (this.$refs.input as any).focus();
  }

  inputHanlde(e: InputEvent) {
    this.showUserList = e.data === '@';
  }

  userClickHandle(userName: string) {
    this.addText(`${userName} `);
    this.showUserList = false;
    this.focus();
  }

  sendMsg() {
    if (this.msg.text) {
      this.$emit('sendMsg', Object.assign({}, { ...this.msg, ...{ user: this.user }}));
      if (this.msg.text.substring(0, 5) === '修改群名：') {
        let title = this.msg.text.substr(5) || '群聊';
        this.$store.dispatch('sendTitleMsg', {
          username: this.nickName,
          title
        });
        setTitle(title);
      }
    }

    if (this.msg.text === '当前人数') {
      this.$emit('getUsers');
      this.$store.dispatch('showUserList');
    }
    isMobile() && this.blur();
    this.msg.text = '';
  }
}

</script>

<style lang="scss">
.input-bar{
  position: relative;
  display: flex;
  height: 50px;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgba($color: #000000, $alpha: .1);
  box-sizing: content-box;

  input{
    flex: 1;
    height: 100%;
    padding: 0 10px;
    font-size: 16px;
    border: none;
    outline: none;
    background-color: #f4f4f4;
  }

  .user-list{
    position: absolute;
    bottom: 52px;
    bottom: calc(52px + env(safe-area-inset-bottom));
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
