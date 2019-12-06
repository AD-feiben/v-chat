<template>
  <div class="app-bar">
    <h3>
      <slot/>
    </h3>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppBar extends Vue {

}
</script>

<style lang="scss">
.app-bar{
  display: flex;
  width: 100%;
  height: 50px;
  padding-top: env(safe-area-inset-top);
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
  border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
}
</style>
