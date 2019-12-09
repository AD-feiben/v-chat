<template>
  <div class="message-item">
    <div v-if="message.type === 's'" class="sys-msg">{{ message.text }}</div>
    <div v-if="message.type === 'o'" class="msg o-msg">
      <div
        class="avatar"
        :style="getAvatarStyle(message.user.nickName)"
        @mousedown="mousedownHandle(message.user.nickName)"
        @touchstart="mousedownHandle(message.user.nickName)"
        @mousemove="mousemoveHandle()"
        @touchmove="mousemoveHandle()"
        @mouseup="mouseupHandle()"
        @touchend="mouseupHandle()"
        @click.stop=""
      >
        {{ nickNameFirstLetter }}
      </div>
      <div class="message">
        <p class="nick-name">{{ message.user.nickName }}<span class="time">{{ fmtTime(message.time) }}</span></p>
        <div class="msg-content" v-html="formatMsg(message.text)"/>
      </div>
    </div>
    <div v-if="message.type === 'm'" class="msg m-msg">
      <div class="message">
        <p class="nick-name"><span class="time">{{ fmtTime(message.time) }}</span>{{ message.user.nickName }}</p>
        <div class="msg-content" v-html="formatMsg(message.text)"/>
      </div>
      <div class="avatar" :style="getAvatarStyle(message.user.nickName)">{{ nickNameFirstLetter }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IMessage } from '@/utils/socket';
import { isLink, regLink } from '@/utils/is';
import expressionList from '@/config/chat-expression';

const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

@Component
export default class MessageItem extends Vue {
  @Prop({ type: Object, required: true }) message!: IMessage;

  timer: number = 0;
  isAted: boolean = false;

  get nickNameFirstLetter () {
    return this.msgNickName ? this.msgNickName[0] : '';
  }
  get msgNickName () {
    return this.message.user && this.message.user.nickName;
  }
  get nickName() {
    return this.$store.getters.nickName;
  }

  get regAtMe () {
    return /(@\S+)/g;
  }

  fmtTime (time: number) {
    return new Date(time || Date.now()).toLocaleString()
  }

  at(userName: string) {
    this.$emit('at', `@${userName} `);
  }

  mousedownHandle(userName: string) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.at(userName);
      this.isAted = true;
    }, 500);
  }

  mousemoveHandle() {
    this.timer && clearTimeout(this.timer);
  }

  mouseupHandle() {
    if (this.timer && this.isAted) {
      this.$emit('needFocus');
    }
    clearTimeout(this.timer);
    this.isAted = false;
  }

  formatMsg(text: string) {
    const names = text.match(this.regAtMe);
    const atNameList: string[] = [`@${this.nickName}`, '@All', '@all', '@所有人'];
    if (atNameList.includes(RegExp.$1)) {
      text = text.replace(this.regAtMe, `<b class="at">${RegExp.$1}</b>`);
    }

    text = text.replace(regLink, '<a target="_blank" href="$1$2">$1$2</a>');
    text = this.convertExpression(text);
    return text;
  }

  convertExpression(text: string) {
    let regExp = new RegExp('\\[.+?\\]', 'g');
    if (!regExp.test(text)) return text;
    text = text.replace(regExp, (item): any => {
      if (!item) return;
      let index = Object.keys(expressionList).indexOf(item);
      if (index !== -1) {
        return `<img class="expression-message" src=${(expressionList as IObj<string>)[item]} alt="expression"/>`;
      }
    });
    return text;
  }

  isLink(str: string) {
    return isLink(str);
  }

  getColor (username: string) {
    if (!username) return '#FFFF00';
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index]
  }

  getAvatarStyle (username: string) {
    if (!username) return;
    return { backgroundColor: this.getColor(username)} ;
  }
}

</script>

<style lang="scss">
.message-item{
  padding: 8px;
  margin-bottom: 5px;
  .sys-msg{
    text-align: center;
    font-size: 16px;
    color: #999;
  }
  .msg{
    display: flex;
    padding-left: 10px;
    padding-right: 20px;
    .avatar{
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 12px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      font-weight: 600;
      border-radius: 50%;
      text-transform: capitalize;
      color: #fff;
      background-color: gold;
      cursor: pointer;
      user-select: none;
    }
    .nick-name{
      margin-bottom: 4px;
      font-size: 14px;
      font-style: italic;
      color: #333;
      .time{
        margin: 0 5px;
        font-style: normal;
        color: #999;
      }
    }
    .msg-content{
      display: inline-block;
      position: relative;
      padding: 5px 10px;
      background-color: #f4f4f4;
      border-radius: 4px;
      line-height: 1.25em;
      word-break: break-all;
      .at{
        font-size: 16px;
        color: #e00;
      }
      &::before{
        content: '';
        display: block;
        position: absolute;
        top: 5px;
        border-right: 8px solid #f4f4f4;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
      }
      a{
        color: inherit;
      }
      .expression-message {
        width: 22px;
        height: 22px;
        display: inline-block;
        line-height: 22px;
        vertical-align: middle;
        margin: 0 2px;
      }
    }
  }
  .o-msg{
    .msg-content{
      &::before{
        left: -5px;
      }
    }
  }

  .m-msg{
    justify-content: flex-end;
    padding-right: 10px;
    padding-left: 20px;
    text-align: right;
    .avatar{
      margin-left: 12px;
      margin-right: 0;
    }
    .msg-content{
      text-align: left;
      color: #fff;
      background-color: #4DBA87;
      &::before{
        border-left: 8px solid #4DBA87;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 0;
        right: -5px;
      }
    }
  }
}
</style>
