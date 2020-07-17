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
          v-for="index of item.options.length"
          :key="index"
          v-model="item.options[index - 1]"
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
              @click="deleteOption(index - 1)"
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
    deleteOption(index: number) {
      this.item.options.splice(index, 1);
    },
  },
});
</script>
