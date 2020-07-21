<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <span>{{ item.title }}</span>
    <v-data-table
      :headers="[...headers,{ text: '操作',
                              value: 'actions',
                              width: 80,
                              align:'center', 
                              sortable: false,
                              filterable: false}]"
      :items="items"
      class="my-table elevation-1"
      disable-pagination
      hide-default-footer
      no-data-text="暂无数据"
    >
      <template
        v-for="each of headers"
        v-slot:[getSlotName(each)]
      >
        <div
          :is="each.type + 'Core'"
          :key="each.name"
          :item="each.item"
        />
      </template>
      <template
        v-slot:item.actions
      >
        <IconButton 
          icon
          text
          color="primary"
          title="删除行"
        >
          <v-icon>mdi-table-row-remove</v-icon>
        </IconButton>
      </template>
      <template v-slot:footer>
        <IconButton 
          icon
          text
          block
          color="primary"
          title="添加新行"
        >
          <v-icon>mdi-table-row-plus-after</v-icon>
        </IconButton>
      </template>
    </v-data-table>
  </FormComponent>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { FormComponent } from '../base/';
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
    const headers = computed(() =>
      item.fields.map((each) => ({
        text: each.title,
        value: each.title,
        type: each.type,
        item: each,
        width: each.size * 30,
      })),
    );
    // const items = computed(() => [Object.fromEntries(headers.value.map((each) => [each.value, '']))]);
    const items = [{}];

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
    };
  },
});
</script>
<style lang="less" scoped>
.my-table {
  /deep/ th:last-child,
  /deep/ td:last-child {
    position: sticky;
    right: 0;
    border-left: thin solid rgba(0, 0, 0, 0.12);
    background: white;

    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  }

  /deep/ .v-data-table__wrapper {
    overflow-x: scroll;
  }
}
</style>