<template>
  <div class="message-item">
    <div v-if="message.type === 's'" class="sys-msg">{{ message.text }}</div>
    <div v-if="message.type === 'o' && message.user" class="msg o-msg">
      <div class="avatar">{{ nickNameFirstLetter }}</div>
      <div class="message">
        <p class="nick-name">{{ message.user.nickName }}</p>
        <div class="msg-content">{{ message.text }}</div>
      </div>
    </div>
    <div v-if="message.type === 'm' && message.user" class="msg m-msg">
      <div class="message">
        <div class="msg-content">{{ message.text }}</div>
      </div>
      <div class="avatar">{{ nickNameFirstLetter }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IUser } from '@/views/Home.vue';

export interface IMessage {
  type: 'm' | 'o' | 's';
  text: string;
  user?: IUser;
}

@Component
export default class MessageItem extends Vue {
  @Prop({ type: Object, required: true }) message!: IMessage;

  get nickNameFirstLetter () {
    if (this.message.user) {
      return this.message.user.nickName[0];
    }
    return ''
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
    align-items: center;
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
    }
    .nick-name{
      margin-bottom: 4px;
      font-size: 14px;
      text-transform: capitalize;
      font-style: italic;
      color: #333;
    }
    .msg-content{
      position: relative;
      padding: 5px 10px;
      background-color: #f4f4f4;
      border-radius: 4px;
      line-height: 1.25em;
      &::before{
        content: '';
        display: block;
        position: absolute;
        top: 5px;
        border-right: 8px solid #f4f4f4;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
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
    .avatar{
      margin-left: 12px;
      margin-right: 0;
    }
    .msg-content{
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
