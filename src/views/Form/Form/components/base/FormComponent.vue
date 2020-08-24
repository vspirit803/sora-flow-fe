<template>
  <div class="form-component">
    <div
      v-if="formStatus==='designing'"
      class="mask"
    />
    <div class="inner">
      <v-icon
        v-show="formStatus==='designing' && isSelected"
        class="icon top-left component-drag-handle"
      >
        mdi-drag
      </v-icon>
      <v-icon
        v-show="formStatus==='designing' && isSelected && item.canMoveToPrevRow"
        class="icon top-middle"
        @click.stop="moveToPrevRow"
      >
        mdi-arrow-up-bold-circle
      </v-icon>
      <v-icon
        v-show="formStatus==='designing' && isSelected && item.canMoveToNextRow"
        class="icon bottom-middle"
        @click.stop="moveToNextRow"
      >
        mdi-arrow-down-bold-circle
      </v-icon>
      <v-icon
        v-show="formStatus==='designing' && isSelected && item.canSwapToLeft"
        class="icon left-middle"
        @click.stop="swapToLeft"
      >
        mdi-swap-horizontal-circle
      </v-icon>
      <v-icon
        v-show="formStatus==='designing' && isSelected && item.canSwapToRight"
        class="icon right-middle"
        @click.stop="swapToRight"
      >
        mdi-swap-horizontal-circle
      </v-icon>
      <v-icon
        v-show="formStatus==='designing'"
        class="icon right-top"
        @click.stop="remove"
      >
        mdi-delete
      </v-icon>
      <div 
        class="d-flex"
        :class="{'flex-column':item.layout!=='horizontal','content-inline':item.layout==='horizontal'}"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, inject, Ref } from '@vue/composition-api';

import { FormComponentModel } from './FormComponentModel';

export default defineComponent({
  name: 'FormComponent',
  props: {
    item: {
      type: FormComponentModel,
      required: true,
    },
  },
  setup(props, context) {
    const item = props.item;
    const selectedItem = inject('selectedItem') as Ref<FormComponentModel | null>;
    const isSelected = computed(() => item === selectedItem.value);
    const formStatus = inject('formStatus', 'designing');

    return {
      formStatus,
      isSelected,
      moveToPrevRow() {
        item.moveToPrevRow();
      },
      moveToNextRow() {
        item.moveToNextRow();
      },
      swapToLeft() {
        item.swapToLeft();
      },
      swapToRight() {
        item.swapToRight();
      },
      remove() {
        item.remove();
        context.emit('remove');
      },
    };
  },
});
</script>
<style scoped>
.mask {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
}

.form-component {
  position: relative;
  height: 100%;
  user-select: none;
}

.top-left {
  top: -12px;
  left: -12px;
}

.top-middle {
  top: -12px;
  left: calc(50% - 12px);
}

.right-top {
  top: -12px;
  right: -12px;
  display: none;
}

.form-component:hover .right-top {
  display: inline-block;
}

.bottom-middle {
  bottom: -12px;
  left: calc(50% - 12px);
}

.left-middle {
  bottom: calc(50% - 12px);
  left: -12px;
}

.right-middle {
  right: -12px;
  bottom: calc(50% - 12px);
}

.inner {
  padding: 10px;
}

.icon {
  position: absolute;
  z-index: 4;
}

.icon:hover {
  cursor: pointer;
}
</style>
