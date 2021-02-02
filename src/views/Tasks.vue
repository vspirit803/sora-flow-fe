<template>
  <div class="task ma-4">
    <v-expansion-panels :value="0">
      <v-expansion-panel key="applicationRecordReportTasks">
        <v-expansion-panel-header>
          {{ t('task.reportTasks') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            fixed-header
            :items="applicationRecordReportTasks"
            hide-default-footer
          >
            <template #item.finalTime="{ item }">
              {{ d(new Date(item.finalTime)) }}
            </template>
            <template #item.actions="{ item }">
              <v-btn
                text
                color="primary"
                :to="{
                  name: 'ApplicationRecordReport',
                  params: {
                    task: item.id,
                  }
                }"
              >
                {{ t('task.report') }}
              </v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import { Task, TasksService } from '@/service';
import { useStore } from '@/use';

export default defineComponent({
  name: 'Tasks',
  setup() {
    const { t } = useI18n();
    //所有待办
    const allTasks: Ref<Array<Task>> = ref([]);
    const headers = [
      { text: t('task.title'), value: 'metadata.title', divider: true, width: 200 },
      { text: t('task.finalTime'), value: 'finalTime', divider: true, width: 200 },
      { text: t('actions'), value: 'actions', width: 200 },
    ];

    //应用记录采集待办
    const applicationRecordReportTasks = computed(() =>
      allTasks.value.filter((eachTask) => eachTask.type === 'ApplicationRecordReport'),
    );

    function refreshTasks() {
      TasksService.getTasks({ status: 'processing' }).then((response) => {
        allTasks.value = response.data;
      });
    }

    refreshTasks();

    watch(
      () => useStore().state.organizationId,
      () => {
        refreshTasks();
      },
    );

    return {
      allTasks,
      applicationRecordReportTasks,
      headers,
      ...useI18n(),
    };
  },
});
</script>
<style lang="less" scoped>
.tasks {
  height: 200px;
}
</style>
