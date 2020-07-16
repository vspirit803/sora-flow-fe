<template>
  <div>
    <FormComponentPropsCard name="描述文字">
      <v-text-field
        v-model="item.text"
        placeholder="请输入描述文字"
      />
    </FormComponentPropsCard>
    
    <FormComponentSizeAdjuster :item="item" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { DescriptionModel } from './DescriptionModel';

export default Vue.extend({
  name: 'DescriptionDetail',
  props: {
    item: {
      type: DescriptionModel,
      required: true,
    },
  },
});
</script>
