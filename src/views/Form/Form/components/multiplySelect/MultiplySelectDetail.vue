<template>
  <v-card outlined>
    <FormComponentDetailHeader
      title="多项选择"
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
          :key="each.value"
          v-model="each.text"
          outlined
          dense
          class="mt-0 pt-0 mb-2"
          hide-details
        >
          <template slot="prepend">
            <v-icon
              title="拖动排序"
              class="drag-handle"
            >
              mdi-drag
            </v-icon>
            <v-icon
              title="删除选项"
              @click="deleteOption(each)"
            >
              mdi-delete
            </v-icon>
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-icon
                  :color="each.color"
                  v-bind="attrs"
                  title="选项颜色"
                  v-on="on"
                >
                  mdi-format-color-fill
                </v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="eachColor of optionColors"
                  :key="eachColor"
                  :input-value="each.color === eachColor"
                  @click="each.color = eachColor"
                >
                  <v-list-item-title :class="eachColor + '--text'">
                    {{ eachColor }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
        chips
        dense
        clearable
        outlined
        multiple
        :items="item.options"
        item-text="text"
        item-value="value"
        @change="onDefaultValueChange"
      />
    </FormComponentPropsCard>
    <v-divider />

    <FormComponentPropsCard name="模式">
      <v-radio-group
        v-model="item.mode"
        row
      >
        <v-radio
          value="dropdown"
          label="下拉选择"
        />
        <v-radio
          value="tiled"
          label="平铺选择"
        />
      </v-radio-group>
    </FormComponentPropsCard>
    <v-divider />

    <FormComponentPropsCard
      v-if="item.mode==='tiled'"
      name="选项布局"
    >
      <v-radio-group
        v-model="item.direction"
        row
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
import { defineComponent } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { optionColors } from '../base';
import { MultiplySelectModel } from './MultiplySelectModel';

export default defineComponent({
  name: 'MultiplySelectDetail',
  components: { draggable },
  props: {
    item: {
      type: MultiplySelectModel,
      required: true,
    },
    isTableField: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    function addOption() {
      props.item.addOption();
    }
    function deleteOption(item: { value: string }) {
      props.item.options = props.item.options.filter((each) => each !== item);
    }
    function onBack() {
      if (props.isTableField) {
        context.emit('back');
      }
    }
    function onDefaultValueChange(value: Array<string>) {
      props.item.value = [...value];
    }
    return { addOption, deleteOption, onBack, onDefaultValueChange, optionColors };
  },
});
</script>
