<template>
  <div class="expression-box" @touchmove.stop="">
    <ul class="expression-ul">
        <li :key="item + index" @click="select(index)" v-for="(item, index) in expression">
          <img :src="item" />
        </li>
      </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import expressionList from '@/config/chat-expression';

@Component
export default class Expresssion extends Vue {
  expression: IObj<string> = {};
  mounted() {
    this.expression = expressionList;
  }
  @Emit()
  select(index: string) {
    return index;
  }
}
</script>

<style lang="scss">
.expression-box{
  height: 175px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .expression-ul {
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    > li {
      width: calc(100% / 8 - 5px);
      padding: 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      &:nth-child(8n) {
        margin-right: 0;
      }
      > img {
        width: 100%;
      }
    }
  }
}
</style>
