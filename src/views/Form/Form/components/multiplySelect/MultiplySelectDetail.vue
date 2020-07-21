<template>
  <div>
    <FormComponentPropsCard name="标题">
      <v-text-field
        v-model="item.title"
        placeholder="请输入标题"
      />
    </FormComponentPropsCard>
    
    <FormComponentSizeAdjuster :item="item" />

    <FormComponentPropsCard name="选项内容">
      <draggable
        v-model="item.options"
        handle=".drag-handle"
      >
        <v-text-field
          v-for="each of item.options"
          :key="each.symbol"
          v-model="each.value"
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
      <v-btn @click="addOption">
        增加选项
      </v-btn>
    </FormComponentPropsCard>

    <FormComponentPropsCard name="默认值">
      <v-select
        v-model="item.default"
        chips
        dense
        outlined
        multiple
        :items="item.options"
        item-text="value"
        item-value="value"
      />
    </FormComponentPropsCard>

    <FormComponentPropsCard name="排列方向">
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
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

import { MultiplySelectModel } from './MultiplySelectModel';

export default Vue.extend({
  name: 'MultiplySelectDetail',
  components: { draggable },
  props: {
    item: {
      type: MultiplySelectModel,
      required: true,
    },
  },
  methods: {
    addOption() {
      this.item.addOption();
    },
    deleteOption(item: { value: string }) {
      this.item.options = this.item.options.filter((each) => each !== item);
    },
  },
});
</script>
