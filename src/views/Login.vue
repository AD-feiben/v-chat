<template>
  <div class="login">
    <div class="login-from">
      <p>Type your nickname for chat</p>
      <input type="text" v-model="nickName" autofocus @keyup.enter="loginHandle">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  nickName: string = '';

  loginHandle() {
    if (!this.nickName) {
      return alert('Please type your nickname');
    }
    this.$store.dispatch('login', this.nickName);
    this.$router.replace({ name: 'home' });
  }
}
</script>

<style lang="scss">
.login{
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #000;

  .login-from{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
    flex-direction: column;
    color: #fff;
    font-size: 20px;

    input{
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 20px;
      outline: none;
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid #fff;
      color: #fff;
      background-color: transparent;
    }
  }
}
</style>
