<template>
  <div class="form-designer d-flex">
    <v-card class="components-container-card flex-grow-0 flex-shrink-0 align-self-start pink lighten-1 ma-2">
      <v-container
        class="components-container grey lighten-5"
      >
        <v-row no-gutters>
          <draggable
            class="components d-flex flex-wrap"
            :list="componentList"
            :sort="false"
            :group="{ name: 'components', pull: 'clone', put: false }"
            @start="draggingType = 'tool'"
            @end="draggingType = ''"
          >
            <v-col
              v-for="eachTool of componentList"
              :key="eachTool.type"
              class="pa-0 text-center"
              cols="4"
              @click="onAddComponent(eachTool)"
            >
              <v-card
                class="component"
                outlined
                tile
              >
                {{ eachTool.text }}
              </v-card>
            </v-col>
          </draggable>
        </v-row>
      </v-container>
    </v-card>
    <v-card class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2">
      <draggable
        :value="form.rows"
        group="components"
        @change="formRowsChange"
        @start="draggingType = 'row'"
        @end="draggingType = ''"
      >
        <div
          v-for="(eachRow, rowIndex) of form.rows"
          :key="rowIndex"
        >
          <v-container class="pa-0">
            <v-row class="ma-0">
              <draggable
                :value="eachRow.components"
                :group="{
                  name: 'components',
                  put: eachRow.canAddComponent && draggingType !== 'row',
                }"
                class="easy-form-row"
                handle=".component-drag-handle"
                @start="draggingType = 'component'"
                @end="draggingType = ''"
                @change="payload => rowComponentsChange(payload, eachRow)"
              >
                <v-col
                  v-for="eachItem of eachRow.components"
                  :key="eachItem.symbol"
                  class="tool-item pa-0"
                  :class="{ 'tool-item-selected': eachItem === selectedItem }"
                  :cols="draggingType === 'component' || draggingType === 'tool' ? 3 : eachItem.size"
                  @click="select(eachItem)"
                >
                  <div
                    :is="eachItem.type"
                    :key="eachItem.symbol"
                    :item="eachItem"
                    @remove="remove"
                  />
                </v-col>
              </draggable>
            </v-row>
          </v-container>
        </div>
      </draggable>
    </v-card>
    <v-card class="component-detail-card flex-grow-0 flex-shrink-0 align-self-start blue lighten-2 ma-2">
      <div
        :is="selectedItem.type + 'Detail'"
        v-if="selectedItem"
        :key="selectedItem.symbol"
        class="component-detail"
        :item="selectedItem"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import './Form';

import { defineComponent, provide, Ref, ref } from '@vue/composition-api';
import draggable from 'vuedraggable';

import {
  ComponentFactory,
  FormComponentDataBase,
  FormComponentModel,
  formComponents,
  FormComponentType,
} from './Form/components';
import { Form } from './Form/Form';
import { FormRow } from './Form/FormRow';

export default defineComponent({
  name: 'FormDesigner',
  components: { draggable },
  setup() {
    const form = ref(new Form());
    const selectedItem: Ref<FormComponentModel | null> = ref(null);
    provide('selectedItem', selectedItem);
    const draggingType = '';
    const componentList = Object.seal(formComponents);

    function select(item: FormComponentModel | null) {
      selectedItem.value = item;
    }

    /**
     * 添加一个组件到表单,生成一个新的行存放
     */
    function addComponentToForm({ added }: { added: { element: { type: FormComponentType }; newIndex: number } }) {
      const {
        newIndex,
        element: { type },
      } = added;
      const newItem = ComponentFactory.create({ type });
      if (!newItem) {
        return;
      }
      const newRow = new FormRow();
      newRow.addComponent(newItem);
      form.value.addRow(newRow, newIndex);
      select(newItem);
    }

    function moveRowToNewIndex(row: FormRow, oldIndex: number, newIndex: number) {
      form.value.rows.splice(oldIndex, 1);
      form.value.rows.splice(newIndex, 0, row);
    }

    /**
     * 表单的行发生变化
     */
    function formRowsChange({
      added,
      moved,
    }: {
      added?: { element: { type: FormComponentType } | FormComponentModel; newIndex: number };
      moved?: { element: FormRow; oldIndex: number; newIndex: number };
    }) {
      if (added) {
        if (added.element instanceof FormComponentModel) {
          const { element: component, newIndex } = added;
          const newRow = new FormRow();
          const currRow = component.row;
          const oldIndex = form.value.rows.indexOf(currRow);
          component.remove();
          newRow.addComponent(component);
          form.value.addRow(newRow, currRow.components.length === 0 && newIndex > oldIndex ? newIndex - 1 : newIndex);
        } else {
          addComponentToForm({
            added: added as { element: { type: FormComponentType }; newIndex: number },
          });
        }
      } else {
        moveRowToNewIndex(moved!.element, moved!.oldIndex, moved!.newIndex);
      }
    }

    function remove(component: FormComponentModel) {
      if (selectedItem.value === component) {
        selectedItem.value = null;
      }
    }

    /**
     * 添加一个组件到已有行
     */
    function addComponentToRow(
      { added }: { added: { element: { type: FormComponentType }; newIndex: number } },
      row: FormRow,
    ) {
      const {
        element: { type },
      } = added;
      const { newIndex } = added;
      const newItem = ComponentFactory.create({ type });
      if (!newItem) {
        return;
      }
      row.addComponent(newItem, newIndex);
      select(newItem);
    }

    /**
     * 行内的组件发生变化
     */
    function rowComponentsChange(
      {
        added,
        // removed,
        moved,
      }: {
        added?: { element: { type: FormComponentType } | FormComponentModel; newIndex: number };
        // removed?: { element: FormComponentModel; oldIndex: number };
        moved?: { element: FormComponentModel; oldIndex: number; newIndex: number };
      },
      row: FormRow,
    ) {
      if (added) {
        if (added.element instanceof FormComponentModel) {
          const component = added.element;
          component.remove();
          row.addComponent(component, added.newIndex);
        } else {
          addComponentToRow({ added: added as { element: { type: FormComponentType }; newIndex: number } }, row);
        }
      } else if (moved) {
        const { element: component, oldIndex, newIndex } = moved;
        row.components.splice(oldIndex, 1);
        row.components.splice(newIndex, 0, component);
      }
    }

    function onAddComponent({ type }: { type: FormComponentType }) {
      const newRow = new FormRow();
      const newItem = ComponentFactory.create({ type });
      newRow.addComponent(newItem);
      form.value.addRow(newRow, selectedItem.value?.row);
      select(newItem);
    }

    return {
      form,
      componentList,
      select,
      onAddComponent,
      addComponentToForm,
      moveRowToNewIndex,
      formRowsChange,
      remove,
      rowComponentsChange,
      addComponentToRow,
      selectedItem,
      draggingType,
    };
  },
});
</script>

<style lang="less" scoped>
.form-designer {
  /** */
}

.components-container-card {
  width: 300px;

  .components-container {
    width: 300px;
    position: fixed;

    .components {
      width: 100%;
      .component {
        user-select: none;
      }
    }
  }
}

.form-card {
  /**给一个较小的宽度,利用flex-grow自动撑大 */
  width: 200px;
}

.component-detail-card {
  width: 320px;

  .component-detail {
    width: 320px;
    position: fixed;
    max-height: calc(100vh - 64px - 8px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.main {
  flex-grow: 1;
  min-height: 20px;
  margin: 5px 5px;
  overflow: hidden;
}

.easy-form-row {
  width: 100%;
  display: flex;
  margin: 10px 0px;
  padding: 5px;
  background-color: aliceblue;
  cursor: move !important;
}

.tool-item {
  border: 1px dashed blue;
}

.tool-item-selected {
  background: turquoise;
}
</style>
