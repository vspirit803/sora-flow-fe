<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <br>
    <v-radio-group
      :row="item.direction==='horizontal'"
    >
      <v-checkbox
        v-for="index of item.options.length"
        :key="index"
        v-model="item.default"
        hide-details
        class="pt-0 mt-0"
        :class="{'mt-2' : item.direction==='vertical' && index - 1,'ml-4' : item.direction==='horizontal' && index - 1}"
        :value="item.options[index - 1]"
        :label="item.options[index - 1]"
      />
    </v-radio-group>
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
