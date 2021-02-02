<template>
  <v-stepper v-model="currStep">
    <v-stepper-header>
      <v-stepper-step
        :complete="currStep > 1"
        step="1"
      >
        基本信息
      </v-stepper-step>
      <v-divider />
      <v-stepper-step
        :complete="currStep > 2"
        step="2"
      >
        填报人员
      </v-stepper-step>
      <v-divider />
      <v-stepper-step step="3">
        信息确认
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        class="pa-0"
        step="1"
      >
        <v-card>
          <v-card-text
            class="py-0"
            style="height: 350px; overflow: auto;"
          >
            <v-text-field
              v-model="newTask.title"
              label="任务名称"
            />
            <v-menu
              v-model="visibleTimePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="finalTime"
                  label="截止时间"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="finalTime"
                locale="zh-cn"
                @input="onFinalTimeChange"
              />
            </v-menu>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              text
              @click="$emit('cancel')"
            >
              {{ t('cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              text
              :disabled="!newTask.title || !newTask.finalTime"
              @click="currStep += 1"
            >
              下一步
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
      <v-stepper-content
        class="pa-0"
        step="2"
      >
        <v-card>
          <v-card-text
            class="py-0"
            style="height: 350px; overflow: auto;"
          >
            <DuplicateTree
              v-model="newTask.reporters"
              :items="departmentTree"
              text-key="name"
              value-key="id"
            />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              text
              @click="$emit('cancel')"
            >
              {{ t('cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="currStep -= 1"
            >
              上一步
            </v-btn>
            <v-btn
              color="primary"
              text
              :disabled="newTask.reporters.length===0"
              @click="currStep += 1"
            >
              下一步
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
      <v-stepper-content
        class="pa-0"
        step="3"
      >
        <v-card>
          <v-card-text
            class="py-0"
            style="height: 350px; overflow: auto;"
          >
            啦啦啦啦啦啦啦
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              text
              @click="$emit('cancel')"
            >
              {{ t('cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="currStep -= 1"
            >
              上一步
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="$emit('submit', newTask)"
            >
              确认
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, UnwrapRef } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import DuplicateTree from '@/components/DuplicateTree.vue';
import {
  ApplicationsService,
  ApplicationVo,
  CreateApplicationRecordCollectionTaskDto,
  DepartmentsService,
} from '@/service';
import { useRouter } from '@/use';

interface Account {
  id: string;
  name: string;
  nickname: string;
}

interface Department {
  id: string;
  name: string;
  members: Array<Account>;
  children: Array<Department>;
}

interface DepartmentTreeNode {
  id: string;
  name: string;
  children?: Array<DepartmentTreeNode>;
}

type NewTask = {
  -readonly [P in keyof CreateApplicationRecordCollectionTaskDto]: CreateApplicationRecordCollectionTaskDto[P];
};

function transformToDepartmentTree(department: Department): DepartmentTreeNode {
  return {
    id: department.id,
    name: department.name,
    children: [
      ...department.members.map(({ id, nickname }) => ({ id, name: nickname })),
      ...department.children.map((each) => transformToDepartmentTree(each)),
    ],
  };
}

const router = useRouter();
export default defineComponent({
  name: 'ApplicationCollectionTaskForm',
  props: { applicationId: { type: String, required: true } },
  components: { DuplicateTree },
  emits: ['cancel', 'submit'],
  setup(props) {
    const application: Ref<ApplicationVo | undefined> = ref();
    const finalTime = ref(new Date(Date.now() + 86400 * 1000 * 14).toISOString().slice(0, 10));
    const newTask = reactive<NewTask>({
      application: props.applicationId,
      finalTime: new Date(finalTime.value),
      title: '新采集任务',
      reporters: [],
    });

    const visibleTimePicker = ref(false);
    function onFinalTimeChange(date: string) {
      visibleTimePicker.value = false;
      newTask.finalTime = new Date(date);
    }

    onMounted(async () => {
      try {
        const { data } = await ApplicationsService.getApplication(props.applicationId);
        application.value = data;
        newTask.title = application.value.name;
      } catch {
        router.push({ name: 'NoApplication' });
      }
    });

    const departmentTree: Ref<Array<DepartmentTreeNode>> = ref([]);
    onMounted(async () => {
      const { data } = await DepartmentsService.getDepartments();
      departmentTree.value = data.map((each) => transformToDepartmentTree((each as unknown) as Department));
    });

    const currStep = ref(1);

    return {
      application,
      departmentTree,
      currStep,
      newTask,
      finalTime,
      visibleTimePicker,
      onFinalTimeChange,
      ...useI18n(),
    };
  },
});
</script>