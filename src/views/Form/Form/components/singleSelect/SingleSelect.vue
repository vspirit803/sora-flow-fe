<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <SingleSelectCore :item="item" />
  </FormComponent>
</template>
<script lang="ts">
import Vue from 'vue';

import FormComponent from '../base/FormComponent.vue';
import { SingleSelectModel } from './SingleSelectModel';

export default Vue.extend({
  name: 'SingleSelect',
  components: { FormComponent },
  props: {
    item: {
      type: SingleSelectModel,
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
