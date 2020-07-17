<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <v-textarea
      :placeholder="item.placeholder"
      :value="item.default"
      :rows="item.rowNumber"
    />
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponent } from '../base';
import { MultiplyLineInputModel } from './MultiplyLineInputModel';

export default Vue.extend({
  name: 'MultiplyLineInput',
  components: { FormComponent },
  props: {
    item: {
      type: MultiplyLineInputModel,
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
