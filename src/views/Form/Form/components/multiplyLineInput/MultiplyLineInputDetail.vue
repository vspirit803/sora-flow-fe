<template>
  <v-card outlined>
    <FormComponentDetailHeader
      title="多行文字"
      :is-table-field="isTableField"
      @back="onBack"
    />
    <v-divider />

    <FormComponentPropsCard name="标题">
      <v-text-field
        v-model="item.title"
        outlined
        dense
        placeholder="请输入标题"
      />
    </FormComponentPropsCard>
    <v-divider />

    <FormComponentLayout
      v-if="!isTableField"
      :item="item"
    />
    <v-divider />

    <FormComponentSizeAdjuster
      :item="item"
      :is-table-field="isTableField"
    />
    <v-divider />

    <FormComponentPropsCard name="默认文本">
      <v-textarea
        v-model="item.defaultValue"
        placeholder="请输入默认文本"
        outlined
        dense
        :rows="3"
        @change="onDefaultValueChange"
      />
    </FormComponentPropsCard>

    <FormComponentPropsCard name="默认行数">
      <v-text-field
        v-model="item.rowNumber"
        type="number"
        outlined
        dense
        :min="1"
        :max="20"
      />
    </FormComponentPropsCard>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';

import { MultiplyLineInputModel } from './MultiplyLineInputModel';

export default Vue.extend({
  name: 'MultiplyLineInputDetail',
  props: {
    item: {
      type: MultiplyLineInputModel,
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
    onDefaultValueChange(value: string) {
      this.item.value = value;
    },
  },
});
</script>
