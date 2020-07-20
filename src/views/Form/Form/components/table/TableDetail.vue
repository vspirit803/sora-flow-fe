<template>
  <div>
    <FormComponentSizeAdjuster :item="item" />
    <FormComponentPropsCard name="表格字段">
      <v-list>
        <v-list-item-group color="primary">
          <draggable
            v-model="item.fields"
            handle=".field-handle"
          >
            <template v-for="(eachField, index) in item.fields">
              <v-list-item
                :key="index"
                class="table-field"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="eachField.title" />
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row">
                  <v-icon
                    color="primary"
                    title="编辑字段"
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
              v-for="(item, index) in [{title:'第一个'},{title:'第二个'}]"
              :key="index"
              @click=";"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>


        <!-- <IconButton
          block
          color="primary"
          text
          title="添加字段"
        >
          <v-icon>mdi-table-plus</v-icon>
        </IconButton> -->
      </v-list>
    </FormComponentPropsCard>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

import { FormComponentModel } from '../base';
import { TableModel } from './TableModel';

export default Vue.extend({
  name: 'TableDetail',
  components: { draggable },
  props: {
    item: {
      type: TableModel,
      required: true,
    },
  },
  methods: {
    onChange(...params: any[]) {
      console.log(params);
    },
    onRemoveField(field: FormComponentModel) {
      this.item.onRemoveField(field);
    },
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