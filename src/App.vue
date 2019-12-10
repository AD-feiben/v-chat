<template>
  <div id="app" @touchmove.prevent="">
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
    max-width: 450px;
    min-width: 320px;
    margin: 0 auto;
    box-shadow: 0 0 10px 5px rgba($color: #000000, $alpha: .1);
  }
</style>
