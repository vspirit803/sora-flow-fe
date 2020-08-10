<template>
  <v-card outlined>
    <FormComponentDetailHeader
      title="单行文字"
      :is-table-field="isTableField"
      @back="onBack"
    />
    <v-divider />
  
    <FormComponentPropsCard name="标题">
      <v-text-field
        v-model="item.title"
        outlined
        dense
        placeholder="请输入描述文字"
      />
    </FormComponentPropsCard>
    <v-divider />
   
    <FormComponentSizeAdjuster :item="item" />
    <v-divider />
    
    <FormComponentPropsCard name="默认文本">
      <v-text-field
        v-model="item.defaultValue"
        placeholder="请输入默认文本"
      />
    </FormComponentPropsCard>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';

import { SingleLineInputModel } from './SingleLineInputModel';

export default Vue.extend({
  name: 'SingleLineInputDetail',
  props: {
    item: {
      type: SingleLineInputModel,
      required: true,
    },
    isTableField: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onBack() {
      if (this.isTableField) {
        this.$emit('back');
      }
    },
  },
});
</script>
