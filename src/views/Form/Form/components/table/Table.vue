<template>
  <FormComponent
    :item="item"
    @remove="onRemove"
  >
    <span class="mt-1">{{ item.title }}</span>
    <v-data-table
      :headers="[...headers,{ text: '操作',
                              value: 'actions',
                              width: 80,
                              align:'center', 
                              sortable: false,
                              filterable: false}]"
      :items="item.value"
      class="my-table elevation-1"
      disable-pagination
      hide-default-footer
      no-data-text="暂无数据"
    >
      <template
        v-for="each of headers"
        v-slot:[`item.${each.value}`]="{ item: currRow }"
      >
        <div
          :is="each.type + 'Core'"
          :key="each.value"
          :item="currRow[each.value]"
        />
      </template>
      <template
        v-slot:item.actions="{item: currRow}"
      >
        <IconButton 
          icon
          text
          color="primary"
          title="删除行"
          @click="onRemoveRow(currRow)"
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
          @click="onAddRow"
        >
          <v-icon>mdi-table-row-plus-after</v-icon>
        </IconButton>
      </template>
    </v-data-table>
  </FormComponent>
</template>
<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from '@vue/composition-api';

import { FormComponent, FormComponentModel } from '../base/';
import { ComponentFactory } from '../ComponentFactory';
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
        value: each.id,
        type: each.type,
        sortable: false,
        divider: true,
        width: each.size * 30,
      })),
    );
    const items: Ref<Record<string, FormComponentModel>[]> = ref([]);

    watch(
      computed(() => item.fields),
      () => {
        const list = [];
        for (let i = 0; i < item.rowNumber; i++) {
          const currRow: Record<string, FormComponentModel> = {};
          item.fields.forEach((each) => {
            const id = each.id;
            currRow[id] = ComponentFactory.create(each.model);
          });
          list.push(currRow);
        }
        item.value = list;
      },
      { deep: true },
    );
    watch(
      computed(() => item.rowNumber),
      (newVal, oldVal) => {
        if (newVal > oldVal) {
          // 行数增加
          for (let i = 0; i < newVal - oldVal; i++) {
            const currRow: Record<string, FormComponentModel> = {};
            item.fields.forEach((each) => {
              const id = each.id;
              currRow[id] = ComponentFactory.create(each.model);
            });
            item.value.push(currRow);
          }
        } else {
          //行数减少
          for (let i = 0; i < oldVal - newVal; i++) {
            item.value.pop();
          }
        }
      },
    );

    //增加行
    function onAddRow() {
      const currRow: Record<string, FormComponentModel> = {};
      item.fields.forEach((each) => {
        const id = each.id;
        currRow[id] = ComponentFactory.create(each.model);
      });
      item.value.push(currRow);
    }

    //删除行
    function onRemoveRow(currRow: Record<string, FormComponentModel>) {
      item.value = item.value.filter((each) => each !== currRow);
    }

    function onRemove() {
      context.emit('remove', item);
    }

    return { onAddRow, onRemoveRow, onRemove, headers, items };
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