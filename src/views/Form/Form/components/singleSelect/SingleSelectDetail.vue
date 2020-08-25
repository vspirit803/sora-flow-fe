<template>
  <v-card outlined>
    <FormComponentDetailHeader
      title="单项选择"
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

    <FormComponentPropsCard name="选项">
      <draggable
        v-model="item.options"
        handle=".drag-handle"
      >
        <v-text-field
          v-for="each of item.options"
          :key="each.symbol"
          v-model="each.value"
          outlined
          dense
          class="mt-0 pt-0 mb-2"
          hide-details
        >
          <template slot="prepend">
            <v-icon
              class="drag-handle"
            >
              mdi-drag
            </v-icon>
            <v-icon
              @click="deleteOption(each)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-text-field>
      </draggable>
      <v-btn
        block
        color="primary"
        @click="addOption"
      >
        增加选项
      </v-btn>
    </FormComponentPropsCard>
    <v-divider />

    <FormComponentPropsCard name="默认值">
      <v-select
        v-model="item.defaultValue"
        outlined
        dense
        clearable
        :items="item.options"
        item-text="value"
        item-value="value"
        @change="onDefaultValueChange"
      />
    </FormComponentPropsCard>
    <v-divider />

    <FormComponentPropsCard name="选项布局">
      <v-radio-group
        v-model="item.direction"
      >
        <v-radio
          value="vertical"
          label=" 垂直"
        />
        <v-radio
          value="horizontal"
          label=" 水平"
        />
      </v-radio-group>
    </FormComponentPropsCard>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

import { SingleSelectModel } from './SingleSelectModel';

export default Vue.extend({
  name: 'SingleSelectDetail',
  components: { draggable },
  props: {
    item: {
      type: SingleSelectModel,
      required: true,
    },
    isTableField: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    addOption() {
      this.item.addOption();
    },
    deleteOption(item: { value: string }) {
      this.item.options = this.item.options.filter((each) => each !== item);
    },
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
