<template>
  <div class="input-bar">
    <input
      v-model.trim="msg.text"
      type="text"
      placeholder="Type something here..."
      @keyup.enter="sendMsg"
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IMessage } from '@/components/MessageItme.vue';

@Component
export default class InputBar extends Vue {
  msg: IMessage = {
    type: 'm',
    text: ''
  }

  get user () {
    return this.$store.state.user;
  }

  sendMsg() {
    if (this.msg.text) {
      this.$emit('sendMsg', Object.assign({}, { ...this.msg, ...{ user: this.user }}));
      this.msg.text = '';
    }
  }
}

</script>

<style lang="scss">
.input-bar{
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
    background-color: #f2f2f2;
  }
}
</style>
