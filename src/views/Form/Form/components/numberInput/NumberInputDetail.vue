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

    <FormComponentSizeAdjuster
      :item="item"
      :is-table-field="isTableField"
    />
    <v-divider />

    <FormComponentLayout
      v-if="!isTableField"
      :item="item"
    />
    <v-divider />

    <FormComponentPropsCard name="默认值">
      <ValidationProvider
        v-slot="{ errors, valid }"
        ref="validator"
        name="defaultValue"
        rules="decimal"
      >
        <v-text-field
          :value="item.defaultValue"
          placeholder="请输入默认值"
          :error-messages="errors"
          :success="valid"
          @input="onDefaultValueChange"
        />
      </ValidationProvider>
    </FormComponentPropsCard>
  </v-card>
</template>
<script lang="ts">
import { nextTick } from '@vue/composition-api';
import Vue from 'vue';

import { NumberInputModel } from './NumberInputModel';

export default Vue.extend({
  name: 'NumberInputDetail',
  props: {
    item: {
      type: NumberInputModel,
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
    async onDefaultValueChange(value: string) {
      this.item.defaultValue = (value as unknown) as number;
      nextTick(async () => {
        const validateResult = await (this.$refs.validator as any).validate();
        if (!validateResult.valid) {
          return;
        }
        this.item.defaultValue = parseFloat(value) || undefined;
        this.item.value = parseFloat(value) || undefined;
      });
    },
  },
});
</script>
