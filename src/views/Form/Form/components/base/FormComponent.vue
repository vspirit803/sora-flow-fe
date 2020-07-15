<template>
  <div class="form-component">
    <div class="mask" />
    <div class="inner">
      <v-icon
        v-show="item.isSelected"
        class="icon top-left component-drag-handle"
      >
        mdi-drag
      </v-icon>
      <v-icon
        v-show="item.isSelected && item.canMoveToPrevRow"
        class="icon top-middle"
        theme="filled"
        @click.stop="moveToPrevRow"
      >
        mdi-arrow-up-bold-circle
      </v-icon>
      <v-icon
        v-show="item.isSelected && item.canMoveToNextRow"
        class="icon bottom-middle"
        theme="filled"
        @click.stop="moveToNextRow"
      >
        mdi-arrow-down-bold-circle
      </v-icon>
      <v-icon
        v-show="item.isSelected && item.canSwapToLeft"
        class="icon left-middle"
        type="swap"
        @click.stop="swapToLeft"
      >
        mdi-arrow-left-bold-circle
      </v-icon>
      <v-icon
        v-show="item.isSelected && item.canSwapToRight"
        class="icon right-middle"
        type="swap"
        @click.stop="swapToRight"
      >
        mdi-arrow-right-bold-circle
      </v-icon>
      <v-icon
        class="icon right-top"
        type="delete"
        @click.stop="remove"
      >
        mdi-delete
      </v-icon>
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponentModel } from './FormComponentModel';

export default Vue.extend({
  name: 'FormComponent',
  props: {
    item: {
      type: FormComponentModel,
      required: true,
    },
  },
  methods: {
    moveToPrevRow() {
      this.item.moveToPrevRow();
    },
    moveToNextRow() {
      this.item.moveToNextRow();
    },
    swapToLeft() {
      this.item.swapToLeft();
    },
    swapToRight() {
      this.item.swapToRight();
    },
    remove() {
      this.item.remove();
      this.$emit('remove');
    },
  },
});
</script>
<style scoped>
.mask {
  position: absolute;
  z-index: 5;
  width: 100%;
  height: 100%;
}

.form-component {
  position: relative;
  height: 100%;
  user-select: none;
}

.top-left {
  top: -10px;
  left: -10px;
}

.top-middle {
  top: -10px;
  left: calc(50% - 10px);
}

.right-top {
  top: -10px;
  right: -10px;
  display: none;
}

.form-component:hover .right-top {
  display: inline-block;
}

.bottom-middle {
  bottom: -10px;
  left: calc(50% - 10px);
}

.left-middle {
  bottom: calc(50% - 10px);
  left: -10px;
}

.right-middle {
  right: -10px;
  bottom: calc(50% - 10px);
}

.inner {
  padding: 10px;
}

.icon {
  position: absolute;
  z-index: 10;
  width: 20px;
  height: 20px;
}

.icon:hover {
  cursor: pointer;
}
</style>
