<template>
  <div class="app-bar">
    <div class="icon-exit" @click="logout">
      <svg t="1575694393515" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2724" width="20" height="20"><path d="M45.983 518.23c0-15.531 6.763-29.473 17.413-39.12v0l175.251-158.073c9.354-8.353 21.649-13.472 35.179-13.472 29.062 0 52.593 23.531 52.592 52.652 0 15.531-6.707 29.532-17.413 39.179v0l-73.419 66.182h378.799c29.003 0 52.593 23.59 52.593 52.651 0 29.121-23.59 52.712-52.593 52.712v0h-378.799l73.419 66.182c10.706 9.649 17.413 23.59 17.413 39.18 0 29.062-23.53 52.652-52.592 52.652-13.53 0-25.825-5.119-35.179-13.531v0l-175.251-158.015c-10.646-9.648-17.412-23.59-17.413-39.18v0zM511.731 809.199h330.5v-581.936h-330.5c-29.061 0-52.593-23.59-52.593-52.651 0-29.12 23.531-52.712 52.593-52.712h383.093c29.062 0 52.593 23.59 52.593 52.712v687.296c0 29.121-23.531 52.711-52.593 52.711h-383.093c-29.061 0-52.593-23.59-52.593-52.711 0-29.062 23.532-52.711 52.593-52.711v0zM511.731 809.199z" p-id="2725"></path></svg>
    </div>
    <h3>
      <slot/>
    </h3>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppBar extends Vue {
  logout() {
    this.$store.dispatch('logout');
    this.$router.replace({ name: 'login' });
  }
}
</script>

<style lang="scss">
.app-bar{
  position: relative;
  display: flex;
  width: 100%;
  height: 50px;
  padding-top: env(safe-area-inset-top);
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
  border-bottom: 1px solid rgba($color: #000000, $alpha: .1);

  .icon-exit{
    position: absolute;
    left: 10px;
  }
}
</style>
