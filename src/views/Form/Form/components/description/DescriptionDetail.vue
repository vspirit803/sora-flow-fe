<template>
  <v-card outlined>
    <FormComponentDetailHeader
      title="描述文字"
    />
    <v-divider />

    <FormComponentPropsCard name="描述文字">
      <v-text-field
        v-model="item.text"
        outlined
        dense
        placeholder="请输入描述文字"
      />
    </FormComponentPropsCard>
    <v-divider />
    
    <FormComponentSizeAdjuster :item="item" />
  </v-card>
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
