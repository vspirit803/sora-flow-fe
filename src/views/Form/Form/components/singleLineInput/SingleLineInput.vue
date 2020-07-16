<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <v-text-field
      :placeholder="item.placeholder"
      :value="item.default"
    />
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import FormComponent from '../base/FormComponent.vue';
import { SingleLineInputModel } from './SingleLineInputModel';

export default Vue.extend({
  name: 'SingleLineInput',
  components: { FormComponent },
  props: {
    item: {
      type: SingleLineInputModel,
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
