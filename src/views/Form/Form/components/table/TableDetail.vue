<template>
  <v-card
    v-if="!selectedField"
    outlined
  >
    <FormComponentDetailHeader
      title="表格"
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

    <FormComponentSizeAdjuster :item="item" />
    <v-divider />

    <FormComponentPropsCard name="表格字段">
      <v-list>
        <v-list-item-group color="primary">
          <draggable
            v-model="item.fields"
            handle=".field-handle"
          >
            <template v-for="eachField of item.fields">
              <v-list-item
                :key="eachField.id"
                class="table-field"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="eachField.title" />
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-icon
                    color="primary"
                    title="编辑字段"
                    @click="onEditField(eachField)"
                  >
                    mdi-table-edit
                  </v-icon>
                  <v-icon
                    class="field-handle"
                    color="primary"
                    title="拖动顺序"
                  >
                    mdi-drag
                  </v-icon>
                  <v-icon
                    color="primary"
                    title="移除字段"
                    @click="onRemoveField(eachField)"
                  >
                    mdi-trash-can
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </draggable>
        </v-list-item-group>

        <v-menu
          top
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <IconButton
              block
              color="primary"
              text
              title="添加字段"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-table-plus</v-icon>
            </IconButton>
          </template>

          <v-list>
            <v-list-item
              v-for="(eachComponent) in components"
              :key="eachComponent.name"
              @click="onAddField(eachComponent)"
            >
              <v-list-item-title>{{ eachComponent.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list>
    </FormComponentPropsCard>

    <FormComponentPropsCard name="默认行数">
      <v-text-field
        v-model="item.rowNumber"
        type="number"
        outlined
        dense
        :min="1"
        :max="20"
      />
    </FormComponentPropsCard>
  </v-card>
  <div v-else>
    <div
      :is="selectedField.type + 'Detail'"
      :item="selectedField"
      is-table-field
      @back="selectedField=undefined"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { FormComponentModel } from '../base';
import { formComponents, FormComponentType } from '../FormComponents';
import { TableModel } from './TableModel';

export default defineComponent({
  name: 'TableDetail',
  components: { draggable },
  props: {
    item: {
      type: TableModel,
      required: true,
    },
  },
  setup(props) {
    const item = props.item;
    const enabledComponents = formComponents.filter((each) => each.enabledInTable);
    const selectedField: Ref<FormComponentModel | undefined> = ref();

    function onAddField(field: { type: FormComponentType; text: string }) {
      item.addField(field.type);
    }
    function onEditField(field: FormComponentModel) {
      selectedField.value = field;
    }

    return {
      onRemoveField(field: FormComponentModel) {
        item.onRemoveField(field);
      },
      onAddField,
      components: enabledComponents,
      selectedField,
      onEditField,
    };
  },
});
</script>

<style lang="less" scoped>
.table-field {
  border-bottom: gray;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
}
</style>