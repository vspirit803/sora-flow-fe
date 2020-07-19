<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <MultiplySelectCore :item="item" />
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import FormComponent from '../base/FormComponent.vue';
import { MultiplySelectModel } from './MultiplySelectModel';

export default Vue.extend({
  name: 'MultiplySelect',
  components: { FormComponent },
  props: {
    item: {
      type: MultiplySelectModel,
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
