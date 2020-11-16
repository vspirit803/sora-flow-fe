<template>
  <div class="task ma-4">
    <v-expansion-panels :value="0">
      <v-expansion-panel key="applicationRecordReportTasks">
        <v-expansion-panel-header>
          待填表单
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="[
              { text: '标题', value: 'metadata.title', divider: true, width: 200},
              { text: '截止时间', value: 'finalTime', divider: true, width: 200},
              { text: '操作', value: 'actions', width: 200 },
            ]"
            fixed-header
            :items="applicationRecordReportTasks"
            hide-default-footer
          >
            <template #item.finalTime="{ item }">
              {{ new Date(item.finalTime).toLocaleDateString() }}
            </template>
            <template #item.actions="{ item }">
              <v-btn
                text
                color="primary"
                @click="onClickReport(item)"
              >
                填报
              </v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from '@vue/composition-api';

import { Task, TasksService } from '@/service';
import { useRouter } from '@/use';

export default defineComponent({
  name: 'Tasks',
  setup() {
    //所有待办
    const allTasks: Ref<Array<Task>> = ref([]);
    //应用记录采集待办
    const applicationRecordReportTasks = computed(() =>
      allTasks.value.filter((eachTask) => eachTask.type === 'ApplicationRecordReport'),
    );

    TasksService.getTasks({ status: 'processing' }).then((response) => {
      allTasks.value = response.data;
    });

    function onClickReport(task: Task) {
      useRouter().push({
        name: 'ApplicationRecordReport',
        params: {
          task: task.id,
        },
      });
    }

    return {
      allTasks,
      applicationRecordReportTasks,
      onClickReport,
    };
  },
});
</script>
<style lang="less" scoped>
.tasks {
  height: 200px;
}
</style>
