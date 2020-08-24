<template>
  <div class="form-designer d-flex">
    <v-fab-transition>
      <v-btn
        v-if="hasEdited"
        fab
        right
        fixed
        class="btn-save"
        :loading="isOnSaving"
        @click="onSave"
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-card class="components-container-card flex-grow-0 flex-shrink-0 align-self-start ma-2">
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
    <v-card
      v-if="!form"
      class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2"
    >
      <v-skeleton-loader
        :loading="true"
        type="article"
      />
    </v-card>
    <v-card
      v-else
      class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2"
      :class="{'form-preview':formStatus==='preview'}"
    >
      <v-radio-group
        v-model="formStatus"
        row
      >
        <v-radio
          label="设计"
          value="designing"
        />
        <v-radio
          label="预览"
          value="preview"
        />
      </v-radio-group>
      <draggable
        v-if="form"
        :disabled="formStatus==='preview'"
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
                  class="component pa-0"
                  :class="{ 'component-selected': eachItem === selectedItem }"
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
import { defineComponent, inject, onMounted, provide, Ref, ref, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ApplicationsService } from '@/service';

import { ComponentFactory, Form, FormComponentModel, formComponents, FormComponentType, FormRow } from './Form';

export default defineComponent({
  name: 'FormDesigner',
  components: { draggable },
  props: { id: { type: String, required: true } },
  setup(props) {
    const form: Ref<Form | undefined> = ref();
    const selectedItem: Ref<FormComponentModel | null> = ref(null);
    provide('selectedItem', selectedItem);
    const draggingType = '';
    const componentList = Object.seal(formComponents);
    const isOnSaving = ref(false);
    const hasEdited = ref(false);
    const formStatus = ref('designing');
    provide('formStatus', formStatus);

    function select(item: FormComponentModel | null) {
      selectedItem.value = item;
    }

    const appId = props.id;
    ApplicationsService.getApplication(appId).then(({ data }) => {
      form.value = new Form(data.formModel);
      watch(
        form,
        () => {
          console.log('表单变化了');
          hasEdited.value = true;
        },
        { deep: true },
      );
    });

    onMounted(() => {
      //关闭抽屉
      const drawer = inject('drawer') as Ref<boolean>;
      drawer.value = false;
    });

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
      form.value!.addRow(newRow, newIndex);
      select(newItem);
    }

    function moveRowToNewIndex(row: FormRow, oldIndex: number, newIndex: number) {
      form.value!.rows.splice(oldIndex, 1);
      form.value!.rows.splice(newIndex, 0, row);
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
          const oldIndex = form.value!.rows.indexOf(currRow);
          component.remove();
          newRow.addComponent(component);
          form.value!.addRow(newRow, currRow.components.length === 0 && newIndex > oldIndex ? newIndex - 1 : newIndex);
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
      form.value!.addRow(newRow, selectedItem.value?.row);
      select(newItem);
    }

    function onSave() {
      isOnSaving.value = true;
      ApplicationsService.updateApplication({ id: props.id, formModel: form.value!.model }).finally(() => {
        isOnSaving.value = false;
        hasEdited.value = false;
      });
    }

    return {
      formStatus,
      form,
      componentList,
      select,
      onAddComponent,
      addComponentToForm,
      formRowsChange,
      remove,
      rowComponentsChange,
      selectedItem,
      draggingType,
      onSave,
      isOnSaving,
      hasEdited,
    };
  },
});
</script>

<style lang="less" scoped>
.form-designer {
  /** */

  .btn-save {
    z-index: 9999;
    margin-top: -28px;
  }
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

.component-detail-card {
  width: 340px;

  .component-detail {
    width: 340px;
    position: fixed;
    max-height: calc(100vh - 64px - 8px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.form-card {
  /**给一个较小的宽度,利用flex-grow自动撑大 */
  width: 200px;

  .easy-form-row {
    width: 100%;
    display: flex;
    background-color: aliceblue;
    cursor: move !important;
    margin: 10px 0px;
    padding: 5px;

    .component {
      border: 1px dashed blue;
    }

    .component-selected {
      background: turquoise;
    }
  }

  &.form-preview {
    .easy-form-row {
      margin: 0;
      padding: 0;
      cursor: unset !important;

      .component {
        border-style: solid;
      }

      .component-selected {
        background: unset;
      }
    }
  }
}
</style>
