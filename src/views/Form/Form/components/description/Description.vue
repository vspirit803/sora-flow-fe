<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span
      v-if="item.text"
      class="mt-1"
    >{{ item.text }}</span>
    <span
      v-else
      class="font-italic mt-1"
    >请输入描述文字</span>
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponent } from '../base/';
import { DescriptionModel } from './DescriptionModel';

export default Vue.extend({
  name: 'Description',
  components: { FormComponent },
  props: {
    item: {
      type: DescriptionModel,
      required: true,
    },
  },
  methods: {
    remove() {
      this.$emit('remove', this.item);
    },
  },
});
</script>
