<template>
  <div class="form-designer d-flex">
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
      class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2 form-preview"
    >
      <v-btn @click="onSubmit">
        {{ applicationRecordReportTask.metadata.applicationRecord ? '更新': '提交' }}
      </v-btn>
      <div
        v-for="eachRow of form.rows"
        :key="eachRow.id"
      >
        <v-container class="pa-0">
          <v-row class="ma-0 easy-form-row">
            <v-col
              v-for="eachItem of eachRow.components"
              :key="eachItem.id"
              class="component pa-0"
              :cols="eachItem.size"
            >
              <div
                :is="eachItem.type"
                :key="eachItem.id"
                :item="eachItem"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref } from '@vue/composition-api';

import { ApplicationRecordReportTask, ApplicationRecordsService, ApplicationsService, TasksService } from '@/service';
import { useRouter } from '@/use';

import { Form, FormComponentModel } from './Form/Form';

export default defineComponent({
  name: 'ApplicationRecordReport',
  props: {
    task: { type: String, required: true },
  },
  setup(props) {
    const form: Ref<Form | undefined> = ref();
    const selectedItem: Ref<FormComponentModel | undefined> = ref();
    provide('selectedItem', selectedItem);
    const formStatus = ref('filling');
    provide('formStatus', formStatus);
    const applicationRecordReportTask: Ref<ApplicationRecordReportTask | undefined> = ref();

    TasksService.getTasks({ id: props.task }).then(({ data }) => {
      applicationRecordReportTask.value = data[0] as ApplicationRecordReportTask;
      if (applicationRecordReportTask.value!.metadata.applicationRecord) {
        //已经有对应的填报记录了
        Promise.all([
          ApplicationsService.getApplication(applicationRecordReportTask.value!.metadata.application),
          ApplicationRecordsService.getApplicationRecords(applicationRecordReportTask.value!.metadata.application, {
            id: applicationRecordReportTask.value!.metadata.applicationRecord,
          }),
        ]).then(
          ([
            {
              data: { formModel },
            },
            {
              data: [{ data: formValue }],
            },
          ]) => {
            form.value = new Form(formModel, formValue);
          },
        );
      } else {
        //没有对应的填报记录
        ApplicationsService.getApplication(applicationRecordReportTask.value!.metadata.application).then(
          ({ data: { formModel } }) => {
            form.value = new Form(formModel);
          },
        );
      }
    });

    async function onSubmit() {
      const data = form.value!.valueData;
      if (applicationRecordReportTask.value!.metadata.applicationRecord) {
        //已有记录,修改
        await ApplicationRecordsService.updateApplicationRecord(
          applicationRecordReportTask.value!.metadata.application,
          {
            id: applicationRecordReportTask.value!.metadata.applicationRecord,
            data,
          },
        );
      } else {
        //没有记录,新增
        await ApplicationRecordsService.createApplicationRecord(
          applicationRecordReportTask.value!.metadata.application,
          {
            data,
            task: applicationRecordReportTask.value!.id,
          },
        );
      }
      useRouter().back();
    }

    return {
      formStatus,
      form,

      applicationRecordReportTask,
      onSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
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
