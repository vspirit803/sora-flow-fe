<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      disable-pagination
      hide-default-footer
      no-data-text="暂无数据"
    >
      <template
        v-for="each of headers"
        v-slot:[getSlotName(each)]
      >
        <!-- <v-chip
          :key="each.name"
          dark
        >
          {{ value }}
        </v-chip> -->
        <!-- <v-text-field 
          :key="each.name"
          v-model="item[each.value]"
        /> -->
        <div
          :is="each.type + 'Core'"
          :key="each.name"
          :item="each.item"
        />
      </template>
    </v-data-table>
  </FormComponent>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { FormComponent } from '../base/';
import {
  DescriptionModel,
  FormComponentModel,
  MultiplyLineInputModel,
  MultiplySelectModel,
  SingleLineInputModel,
  SingleSelectModel,
} from '../index';
import { TableModel } from './TableModel';

export default defineComponent({
  name: 'Table',
  components: { FormComponent },
  props: {
    item: {
      type: TableModel,
      required: true,
    },
  },
  setup(props, context) {
    const item = props.item;
    const headers = item.fields.map((each) => ({
      text: each.title,
      value: each.title,
      type: each.type,
      width: 150,
      item: each,
    }));
    // const headers = [
    //   { text: '姓名', value: 'name' },
    //   { text: '关系', value: 'relation' },
    //   { text: '年龄', value: 'age' },
    //   { text: '工作单位', value: 'workCompany' },
    //   { text: '工作岗位', value: 'workRole' },
    // ];
    // const items: Array<any> = [
    //   { name: '刘小平', relation: '父子', age: 55, workCompany: '射洪县建筑公司', workRole: '病退' },
    // ];
    const items: Array<any> = [Object.fromEntries(headers.map((each) => [each.value, '']))];

    function remove() {
      context.emit('remove', item);
    }

    return {
      remove,
      headers,
      items,
      getSlotName(header: { text: string; value: string }) {
        return `item.${header.value}`;
      },

      getItem(type: string) {
        let newItem: FormComponentModel;
        switch (type) {
          case 'Description':
            newItem = new DescriptionModel();
            break;
          case 'SingleLineInput':
            newItem = new SingleLineInputModel();
            break;
          case 'MultiplyLineInput':
            newItem = new MultiplyLineInputModel();
            break;
          case 'SingleSelect':
            newItem = new SingleSelectModel();
            break;
          case 'MultiplySelect':
            newItem = new MultiplySelectModel();
            break;
          case 'Table':
            newItem = new TableModel();
            break;
          default:
            return;
        }
        return newItem;
      },
    };
  },
});
</script>
