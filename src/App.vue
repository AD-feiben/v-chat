<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
  #app{
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
    background-color: #fff;
  }
</style>
