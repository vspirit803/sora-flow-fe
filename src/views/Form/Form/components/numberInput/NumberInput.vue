<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span class="mt-1">{{ item.title }}</span>
    <NumberInputCore
      style="margin-top:2px;"
      :item="item"
    />
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import FormComponent from '../base/FormComponent.vue';
import { NumberInputModel } from './NumberInputModel';

export default Vue.extend({
  name: 'NumberInput',
  components: { FormComponent },
  props: {
    item: {
      type: NumberInputModel,
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
