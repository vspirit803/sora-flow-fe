<template>
  <v-card
    outlined
    class="application-detail flex-grow-1 ml-2"
  >
    <v-skeleton-loader
      v-if="!application"
      loading
      type="article,table"
      class="mx-2"
    />
    <template v-else>
      <v-card-title>
        <v-chip v-if="!editName">
          {{ applicationName }}
          <v-btn
            v-if="application.status === 'Designing'"
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
        <template v-if="application.status === 'Designing'">
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
          <v-dialog
            v-model="visiblePuslishApplicationDialog"
            max-width="300px"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                发布应用
              </v-btn>
            </template>
            <v-card>
              <v-card-title>发布后将不可修改应用</v-card-title>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  text
                  @click="visiblePuslishApplicationDialog = false"
                >
                  取消
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="publishApplication"
                >
                  发布
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-else>
          <v-dialog
            v-model="visibleCreateApplicationCollectionTaskDialog"
            max-width="400px"
            scrollable
            persistent
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="ml-2"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                发起新的采集任务
              </v-btn>
            </template>
            <ApplicationCollectionTaskForm
              :application-id="id"
              @cancel="visibleCreateApplicationCollectionTaskDialog = false"
              @submit="onCreateCollectionTask"
            />
          </v-dialog>
        </template>
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
          <v-tab href="#all">
            所有数据
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tab">
        <v-tab-item value="overview">
          <v-card flat>
            <v-data-table
              :headers="[
                { text: '标题', value: 'title', divider: true, width: 200},
                { text: '状态', value: 'status',divider: true, width: 200 },
                { text: '截止时间', value: 'finalTime', divider: true, width: 200},
                { text: '进度', value: 'progress', divider: true, width: 200},
                { text: '操作', value: 'actions', width: 200 },
              ]"
              fixed-header
              :items="applicationRecordCollectionTasks"
              hide-default-footer
            >
              <template #item.finalTime="{ item }">
                {{ new Date(item.finalTime).toLocaleDateString() }}
              </template>
              <template #item.progress="{ item }">
                <v-tooltip
                  bottom
                  content-class="pa-0"
                  :open-delay="200"
                  :close-delay="200"
                >
                  <template #activator="{ on, attrs }">
                    <v-progress-linear
                      v-bind="attrs"
                      :value="item.tasks.filter((each) => each.status === 'completed').length / item.tasks.length * 100"
                      height="25"
                      v-on="on"
                    >
                      <strong>{{ item.tasks.filter((each) => each.status === 'completed').length }} / {{ item.tasks.length }}</strong>
                    </v-progress-linear>
                  </template>
                  <v-card class="pa-4 pb-1">
                    <p> 预计填报数: {{ item.tasks.length }}</p>
                    <p>
                      完成填报数: {{ item.tasks.filter((each) => each.status === 'completed').length }}
                    </p>
                  </v-card>
                </v-tooltip>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  text
                  color="primary"
                  disabled
                >
                  查看详情
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item value="all">
          <ApplicationRecords :id="id" />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import {
  ApplicationRecordCollectionTask,
  ApplicationRecordCollectionTasksService,
  ApplicationsService,
  ApplicationVo,
  CreateApplicationRecordCollectionTaskDto,
} from '@/service';
import { useRouter } from '@/use';

import ApplicationCollectionTaskForm from './ApplicationCollectionTaskForm.vue';
import ApplicationRecords from './ApplicationRecords.vue';

const router = useRouter();
export default defineComponent({
  name: 'Application',
  props: { id: { type: String, required: true } },
  components: { ApplicationRecords, ApplicationCollectionTaskForm },
  beforeRouteUpdate(to, from, next) {
    this.onRouteUpdate(to.params.id);
    next();
  },
  emits: ['onApplicationChanged'],
  setup(props, context) {
    const application: Ref<ApplicationVo | undefined> = ref();
    const editName = ref(false);
    const applicationName = ref('');

    const applicationRecordCollectionTasks: Ref<Array<ApplicationRecordCollectionTask>> = ref([]);

    const tab = ref('overview');

    onMounted(() => {
      onRouteUpdate(props.id);
    });

    async function onRouteUpdate(id: string) {
      application.value = undefined;
      tab.value = 'overview';
      try {
        const { data } = await ApplicationsService.getApplication(id);

        const { data: tasks } = await ApplicationRecordCollectionTasksService.getApplicationRecordCollectionTasks({
          application: id,
        });
        applicationRecordCollectionTasks.value = tasks;

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

    const visiblePuslishApplicationDialog = ref(false);
    async function publishApplication() {
      try {
        await ApplicationsService.updateApplication({ id: props.id, status: 'Published' });
        visiblePuslishApplicationDialog.value = false;
        await onRouteUpdate(props.id);
      } catch (error) {
        console.log(error);
      }
    }

    const visibleCreateApplicationCollectionTaskDialog = ref(false);

    async function onCreateCollectionTask(newTask: CreateApplicationRecordCollectionTaskDto) {
      try {
        await ApplicationRecordCollectionTasksService.createApplicationRecordCollectionTask(newTask);
        visibleCreateApplicationCollectionTaskDialog.value = false;
      } catch (error) {
        console.log(error);
      }
    }

    return {
      application,
      onSubmitApplicationName,
      tab,
      editName,
      applicationName,
      onRouteUpdate,
      publishApplication,
      visiblePuslishApplicationDialog,
      visibleCreateApplicationCollectionTaskDialog,
      onCreateCollectionTask,
      applicationRecordCollectionTasks,
    };
  },
});
</script>
<style lang="less" scoped>
</style>