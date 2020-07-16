<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <br>
    <v-radio-group
      v-model="item.default"
      :row="item.direction==='horizontal'"
    >
      <v-radio
        v-for="index of item.options.length"
        :key="index"
        :value="item.options[index - 1]"
        :label=" item.options[index - 1]"
      />
    </v-radio-group>
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
