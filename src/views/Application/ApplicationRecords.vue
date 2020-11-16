<!--
  应用记录展示
-->
<template>
  <v-card
    v-if="application && records.length"
    flat
  >
    <div>
      <!-- 列筛选按钮 -->
      <v-menu
        transition="slide-x-transition"
        bottom
        right
        :close-on-content-click="false"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="deep-orange"
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            选择列
          </v-btn>
        </template>
        <v-list
          dense
          style="width: 180px;"
        >
          <v-list-item-group
            v-model="selectedDataHeaders"
            color="primary"
            multiple
          >
            <template v-for="eachOption of allHeaders">
              <v-list-item
                :key="eachOption.field.id"
                :value="eachOption"
              >
                <template #default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="eachOption.text" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox :input-value="active" />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <!-- 刷新按钮 -->
      <v-btn
        icon
        text
        color="primary"
        title="刷新列表"
        @click="refreshRecords"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <v-simple-table class="table">
      <thead>
        <tr>
          <th
            :rowspan="2"
            class="table-cell sticky-column sticky-header"
          >
            填表人
          </th>

          <template v-for="eachField of selectedDataHeaders">
            <th
              v-if="eachField.field.type !== 'Table'"
              :key="eachField.value"
              :rowspan="2"
              class="table-cell sticky-header"
            >
              {{ eachField.text }}
            </th>
            <th
              v-else
              :key="eachField.value"
              :colspan="eachField.field.fields.length"
              class="table-cell sticky-header"
              :style="{'min-width': eachField.width + 'px',
                       'text-align': 'center',
              }"
            >
              {{ eachField.text }}
            </th>
          </template>
        </tr>
        <tr>
          <template v-for="eachField of selectedDataHeaders.filter(eachField => eachField.field.type === 'Table')">
            <th
              v-for="eachNestedField of eachField.field.fields"
              :key="eachNestedField.id"
              class="table-cell sticky-subheader"
            >
              {{ eachNestedField.title }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="eachRecord of records">
          <tr
            v-for="index of calculateRowNumber(eachRecord)"
            :key="eachRecord.id + index"
          >
            <td
              v-if="index === 1"
              :key="eachRecord.id"
              class="table-cell sticky-column"
              :rowspan="calculateRowNumber(eachRecord)"
            >
              {{ eachRecord.account.nickname }}
            </td>
            <template v-for="eachField of selectedDataHeaders">
              <!-- 表中主字段 -->
              <td
                v-if="eachField.field.type !== 'Table' && index === 1"
                :key="eachField.field.id"
                class="table-cell"
                :rowspan="calculateRowNumber(eachRecord)"
              >
                <template v-if="!eachRecord.data[eachField.field.id]" />
                <template v-else-if="eachField.field.type ==='SingleSelect'">
                  {{ eachField.field.options.find((eachOption) => eachOption.value === eachRecord.data[eachField.field.id]).text }}
                </template>
                <template v-else-if="eachField.field.type ==='MultiplySelect'">
                  {{ eachRecord.data[eachField.field.id].map((eachValue) => (eachField.field.options.find((eachOption) => eachOption.value === eachValue).text)) }}
                </template>
                <template v-else>
                  {{ eachRecord.data[eachField.field.id] }}
                </template>
              </td>
              <!-- 表格字段 -->
              <template v-else-if="eachField.field.type === 'Table' && eachRecord.data[eachField.field.id].length && (index - 1) % (calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length) === 0">
                <td
                  v-for="eachNestedField of eachField.field.fields"
                  :key="eachNestedField.id"
                  class="table-cell"
                  :rowspan="calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length"
                >
                  <template v-if="!eachRecord.data[eachField.field.id][(index-1) / (calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length )].data[eachNestedField.id]" />
                  <template v-else-if="eachField.field.type ==='SingleSelect'">
                    {{ eachNestedField.field.options.find((eachOption) => eachOption.value === eachRecord.data[eachField.field.id][(index-1) / (calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length )].data[eachNestedField.id]).text }}
                  </template>
                  <template v-else-if="eachField.field.type ==='MultiplySelect'">
                    {{ eachRecord.data[eachField.field.id][(index-1) / (calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length )].data[eachNestedField.id].map((eachValue) => (eachNestedField.field.options.find((eachOption) => eachOption.value === eachValue).text)) }}
                  </template>
                  <template v-else>
                    {{ eachRecord.data[eachField.field.id][(index-1) / (calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length )].data[eachNestedField.id] }}
                  </template>
                </td>
              </template>
              <!-- 表格字段为空 -->
              <template v-else-if="eachField.field.type === 'Table' && !eachRecord.data[eachField.field.id].length && index === 1">
                <td
                  v-for="eachNestedField of eachField.field.fields"
                  :key="eachNestedField.id"
                  class="table-cell"
                  :rowspan="calculateRowNumber(eachRecord) / eachRecord.data[eachField.field.id].length"
                />
              </template>
            </template>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import { ApplicationRecord, ApplicationRecordsService, ApplicationsService, ApplicationVo } from '@/service';
import { useRouter } from '@/use';
import { lcms } from '@/utils/gcd';

import { FormComponentModelDataBase, TableData } from '../Form/Form';

export default defineComponent({
  name: 'ApplicationRecords',
  props: { id: { type: String, required: true } },
  setup(props) {
    const application: Ref<ApplicationVo | undefined> = ref();
    const records: Ref<Array<ApplicationRecord>> = ref([]);
    /**所有表头 */
    const headers = computed(() => [
      { text: '填写人', value: 'account.nickname', width: 150, class: 'fillter' },
      ...selectedDataHeaders.value,
    ]);
    /**数据的表头 */
    const allHeaders = ref(
      [] as Array<{ text: string; value: string; field: FormComponentModelDataBase; width: number }>,
    );
    const selectedDataHeaders = ref(
      [] as Array<{ text: string; value: string; field: FormComponentModelDataBase; width: number }>,
    );

    onMounted(async () => {
      refreshRecords();

      try {
        const { data } = await ApplicationsService.getApplication(props.id);
        application.value = data;

        const fields = data.formModel.reduce((prev, curr) => [...prev, ...curr], []);
        allHeaders.value = fields
          .filter((eachField) => eachField.type !== 'Description')
          .map((eachField) => ({
            text: eachField.title!,
            value: `data.${eachField.id}`,
            field: eachField,
            width: eachField.type !== 'Table' ? 120 : (eachField as TableData).fields.length * 100,
            sortable: eachField.type !== 'Table',
          }));
        selectedDataHeaders.value = allHeaders.value;
      } catch {
        useRouter().push({ name: 'NoApplication' });
      }
    });

    async function refreshRecords() {
      const { data } = await ApplicationRecordsService.getApplicationRecords(props.id);
      records.value = data;
    }

    function calculateRowNumber(record: ApplicationRecord): number {
      const rows: Array<number> = [];
      Object.keys(record.data).forEach((eachKey) => {
        rows.push(Array.isArray(record.data[eachKey]) ? record.data[eachKey].length : 1);
      });
      return lcms(rows);
    }

    return {
      application,
      refreshRecords,
      records,
      headers,
      allHeaders,
      selectedDataHeaders,
      headerOptions: computed(() => allHeaders.value.map((eachField) => ({ text: eachField.text, field: eachField }))),
      calculateRowNumber,
    };
  },
});
</script>
<style lang="less" scoped>
.table {
  border-collapse: collapse;
}
.table /deep/ .v-data-table__wrapper {
  height: 100%;
  overflow: auto;
}

.table-cell {
  border: thin solid rgba(0, 0, 0, 0.12);
  min-width: 120px;
}

.sticky-header {
  position: sticky;
  background: white;
  z-index: 3;
  top: 0;
}

.sticky-subheader {
  position: sticky;
  background: white;
  z-index: 3;
  top: 48px;
}

.sticky-header:first-child {
  left: 0;
  z-index: 3;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 3;
  background: white;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

.sticky-header:first-child.sticky-column {
  z-index: 5;
}
</style>