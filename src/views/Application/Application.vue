<template>
  <v-card
    outlined
    class="application-detail flex-grow-1 ml-2"
  >
    <v-skeleton-loader
      :loading="!application"
      type="article"
      class="mx-2"
    >
      <v-card-title>
        <v-chip v-if="!editName">
          {{ applicationName }}
          <v-btn
            class="ml-2"
            color="primary"
            title="编辑表单名称"
            icon
            @click="editName = true"
          >
            <v-icon>
              mdi-square-edit-outline
            </v-icon>
          </v-btn>
        </v-chip>
        <div
          v-else
          style="width: 200px;"
        >
          <v-text-field
            v-model="applicationName"
            hide-details
            dense
            label="应用名称"
            append-icon="mdi-check-circle"
            @click:append="onSubmitApplicationName"
          />
        </div>
        <v-btn
          class="ml-2"
          color="primary"
          title="编辑表单模型"
          icon
          :to="{ name: 'FormDesigner', params: { id } }"
        >
          <v-icon>
            mdi-wrench
          </v-icon>
        </v-btn>
        <v-btn
          class="ml-2"
          color="primary"
          title="填写表单"
          icon
          :to="{ name: 'FormFiller', params: { id } }"
        >
          <v-icon>
            mdi-pencil-plus
          </v-icon>
        </v-btn>

        <!-- 选项卡 -->
        <v-tabs
          v-model="tab"
          class="ml-8"
          :height="36"
          style="width: unset;"
        >
          <v-tab href="#overview">
            概览
          </v-tab>
          <v-tab
            href="#all"
            @change="refreshRecords"
          >
            所有数据
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tab">
        <v-tab-item value="overview">
          <v-card flat>
            <v-card-text>概览 未完成</v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="all">
          <v-card flat>
            <!-- 数据表格 -->
            <v-data-table
              class="data-table"
              :headers="headers"
              :items="records"
            >
              <template v-slot:top>
                <!-- 列筛选按钮 -->
                <v-menu
                  transition="slide-x-transition"
                  bottom
                  right
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
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
                      <template v-for="eachOption of dataHeaders">
                        <v-list-item
                          :key="eachOption.field.id"
                          :value="eachOption"
                        >
                          <template v-slot:default="{ active }">
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
              </template>
              <template v-slot:item.createdAt="{ value }">
                {{ new Date(value).toLocaleString() }}
              </template>
              <template v-slot:item.updatedAt="{ value }">
                {{ new Date(value).toLocaleString() }}
              </template>
              <template
                v-for="eachField of dataHeaders"
                v-slot:[`item.${eachField.value}`]="{ item: currRow,value }"
              >
                <template v-if="eachField.field.type ==='SingleSelect'">
                  {{ eachField.field.options.find((eachOption)=>eachOption.value===value).text }}
                </template>
                <template v-else-if="eachField.field.type ==='MultiplySelect'">
                  {{ value.map((eachValue)=>(eachField.field.options.find((eachOption)=>eachOption.value===eachValue).text)) }}
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-skeleton-loader>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api';

import { Application, ApplicationRecord, ApplicationRecordsService, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

import { FormModel } from '../Form/Form';

const router = useRouter();
export default defineComponent({
  name: 'Application',
  props: { id: { type: String, required: true } },
  beforeRouteUpdate(to, from, next) {
    this.onRouteUpdate(to.params.id);
    next();
  },
  setup(props, context) {
    const application: Ref<
      | (Application & {
          creator: { id: string; name: string };
          lastModifier?: { id: string; name: string };
          formModel: FormModel;
        })
      | undefined
    > = ref(undefined);
    const editName = ref(false);
    const applicationName = ref('');
    const records: Ref<Array<ApplicationRecord>> = ref([]);
    const tab = ref('overview');
    /**所有表头 */
    const headers = computed(() => [
      { text: '填写人', value: 'account.nickname', width: 150 },
      ...selectedDataHeaders.value,
    ]);
    /**数据的表头 */
    const dataHeaders = ref([] as Array<{ text: string; value: string; field: any; width: number }>);
    const fieldsMap: Ref<any> = ref(null);
    const selectedDataHeaders = ref([] as Array<{ text: string; value: string; field: any; width: number }>);
    onMounted(() => {
      onRouteUpdate(props.id);
    });

    async function onRouteUpdate(id: string) {
      application.value = undefined;
      tab.value = 'overview';
      try {
        const { data } = await ApplicationsService.getApplication(id);
        application.value = data;
        applicationName.value = data.name;
      } catch {
        router.push({ name: 'NoApplication' });
      }
    }

    async function onSubmitApplicationName() {
      if (application.value!.name === applicationName.value) {
        editName.value = false;
        return;
      }
      await ApplicationsService.updateApplication({ id: props.id, name: applicationName.value });
      application.value!.name = applicationName.value;
      context.emit('onApplicationChanged');
      editName.value = false;
    }

    watch(application, (newVal) => {
      if (!newVal) {
        return;
      }
      records.value = [];
      const fields = newVal!.formModel.reduce((prev, curr) => [...prev, ...curr]);
      dataHeaders.value = fields
        .filter((eachField) => eachField.type !== 'Description' && eachField.type !== 'Table')
        .map((eachField) => ({
          text: eachField.title!,
          value: `data.${eachField.id}`,
          field: eachField,
          width: 120,
        }));

      fieldsMap.value = {};
      fields
        .filter((eachField) => eachField.type !== 'Description' && eachField.type !== 'Table')
        .forEach((eachField) => {
          fieldsMap.value[eachField.id!] = eachField;
        });
      selectedDataHeaders.value = dataHeaders.value;
    });

    async function refreshRecords() {
      const { data } = await ApplicationRecordsService.getApplicationRecords(props.id);
      records.value = data;
    }

    return {
      application,
      onSubmitApplicationName,
      tab,
      editName,
      applicationName,
      onRouteUpdate,
      refreshRecords,
      records,
      headers,
      dataHeaders,
      fieldsMap,
      selectedDataHeaders,
      headerOptions: computed(() => dataHeaders.value.map((eachField) => ({ text: eachField.text, field: eachField }))),
    };
  },
});
</script>
<style lang="less" scoped>
.data-table {
  /deep/ th:first-child,
  /deep/ td:first-child {
    position: sticky;
    left: 0;
    border-right: thin solid rgba(0, 0, 0, 0.12);
    background: white;

    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  }
}
</style>