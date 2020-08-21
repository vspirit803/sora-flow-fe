<template>
  <FormComponentPropsCard name="排列方式">
    <v-radio-group
      v-model="item.layout"
      row
    >
      <v-radio
        value="vertical"
        label="纵向"
      />
      <v-radio
        value="horizontal"
        label="横向"
      />
    </v-radio-group>
  </FormComponentPropsCard>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponentModel } from './FormComponentModel';

export default Vue.extend({
  name: 'FormComponentLayout',
  props: {
    item: {
      type: FormComponentModel,
      required: true,
    },
  },
});
</script>
