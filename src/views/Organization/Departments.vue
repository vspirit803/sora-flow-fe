<template>
  <div class="departments d-flex ma-4">
    <v-card
      outlined
      class="department-list-card flex-grow-0 flex-shrink-0 mr-2"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>{{ t('organization.department.departmentList') }}</span>
        <v-btn
          color="primary"
          icon
          :title="t('add')"
          @click="onCreateDepartment()"
        >
          <v-icon>mdi-domain-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-treeview
        activatable
        :active.sync="activeKeys"
        :items="departments"
        class="department-list"
      >
        <template #append="{ item }">
          <v-btn
            color="primary"
            class="mr-2"
            icon
            :title="t('update')"
            @click="onEditDepartment(item)"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="mr-2"
            icon
            :title="t('add')"
            @click="onCreateDepartment(item)"
          >
            <v-icon>mdi-domain-plus</v-icon>
          </v-btn>
        </template>
      </v-treeview>
    </v-card>
    <v-card
      v-if="selectedDepartment"
      outlined
      class="department-detail"
    >
      {{ t('organization.department.supervisor') }}: {{ selectedDepartment.supervisor.nickname }}
      <br>
      <v-data-table
        :headers="[
          { text: '账号', value: 'name', divider: true, width: 480},
          { text: '昵称', value: 'nickname', divider: true, width: 480},
          { text: '操作', value: 'actions', width: 320 },
        ]"
        fixed-header
        :items="selectedDepartment.members"
      >
        <template #item.name="{ item }">
          {{ item.name }}
          <v-icon
            v-if="item.id === selectedDepartment.supervisor.id"
            class="ml-4"
            color="primary"
            :title="t('organization.department.supervisor')"
          >
            mdi-account-star
          </v-icon>
        </template>
        <template #item.roles="{ item }">
          <v-chip
            v-for="eachRole of item.roles"
            :key="eachRole.id"
            color="primary"
            class="mr-2"
          >
            {{ eachRole.text }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <Confirm
            v-if="item.id !== selectedDepartment.supervisor.id"
            v-slot="{ on, attrs }"
            :message="`确认将[${item.nickname}]移出部门吗`"
            @confirm="onDeleteMember(item)"
          >
            <IconButton
              class="ml-2"
              color="error"
              v-bind="attrs"
              :title="t('organization.department.removeMember')"
              v-on="on"
            >
              <v-icon>mdi-account-remove</v-icon>
            </IconButton>
          </Confirm>
          <Confirm
            v-if="item.id !== selectedDepartment.supervisor.id"
            v-slot="{ on, attrs }"
            :message="`确认将[${item.nickname}]设为部门负责人吗`"
            @confirm="onChangeSupervisor(item)"
          >
            <IconButton
              class="ml-2"
              color="primary"
              v-bind="attrs"
              :title="t('organization.department.setAsSupervisor')"
              v-on="on"
            >
              <v-icon>mdi-account-star</v-icon>
            </IconButton>
          </Confirm>
        </template>
        <template #top>
          <v-toolbar flat>
            <v-btn
              icon
              text
              color="primary"
              :title="t('refresh')"
              @click="refreshSelectedDepartment"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              @click="addMembersDialogVisible=true"
            >
              <v-icon class="mr-2">
                mdi-account-plus
              </v-icon>
              {{ t('add') }}
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
    <v-card
      v-else
      outlined
      class="department-detail"
    >
      请选择一个部门
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="departmentModel.name"
                  label="名称"
                  required
                />
              </v-col>
              <v-col
                v-if="isCreateDepartment"
                cols="12"
              >
                <v-select
                  v-model="departmentModel.supervisor"
                  color="primary"
                  item-text="nickname"
                  item-value="id"
                  :items="accountList"
                  :label="t('organization.department.supervisor')"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialogVisible = false"
          >
            {{ t('cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit"
          >
            {{ t('submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addMembersDialogVisible"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ `${t('add')} ${t('organization.department.member')}` }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="newMembers"
                  multiple
                  color="primary"
                  item-text="nickname"
                  item-value="id"
                  :items="availableAccountList"
                  label="新成员"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="addMembersDialogVisible = false"
          >
            {{ t('cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onAddMembers"
          >
            {{ t('submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import {
  CreateDepartmentDto,
  Department,
  DepartmentsService,
  DepartmentVo,
  ProfileService,
  UpdateDepartmentDto,
} from '@/service';

interface Account {
  nickname: string;
  id: string;
}

export default defineComponent({
  name: 'Department',
  setup() {
    const { t } = useI18n();
    const departments: Ref<Array<DepartmentVo>> = ref([]);
    const departmentModel: Ref<CreateDepartmentDto | UpdateDepartmentDto> = ref({
      name: '',
      supervisor: '',
    });
    const accountList: Ref<Array<Account>> = ref([]);

    function isCreateDepartmentDto(dto: CreateDepartmentDto | UpdateDepartmentDto): dto is CreateDepartmentDto {
      return !('id' in dto);
    }

    const isCreateDepartment = computed(() => isCreateDepartmentDto(departmentModel.value));

    const dialogVisible = ref(false);
    const dialogTitle = computed(
      () => `${isCreateDepartment.value ? t('add') : t('update')} ${t('organization.department.department')}`,
    );

    async function refresh() {
      const { data } = await DepartmentsService.getDepartments();
      departments.value = data;
    }

    function onCreateDepartment({ id }: { id?: string } = {}) {
      departmentModel.value = {
        parentId: id,
        name: '',
        supervisor: '',
      };
      dialogVisible.value = true;
    }

    function onEditDepartment({ id, name, supervisor }: { id: string; name: string; supervisor: string }) {
      departmentModel.value = {
        id,
        name,
      };
      dialogVisible.value = true;
    }

    async function submit() {
      if (isCreateDepartmentDto(departmentModel.value)) {
        await DepartmentsService.createDepartment(departmentModel.value);
      } else {
        await DepartmentsService.updateDepartment(departmentModel.value);
        if (departmentModel.value.id === selectedKey.value) {
          refreshSelectedDepartment();
        }
      }
      dialogVisible.value = false;
      refresh();
    }

    const activeKeys = ref<Array<string>>([]);
    const selectedKey = ref('');
    watch(activeKeys, (newVal, oldVal) => {
      if (!newVal.length) {
        activeKeys.value = oldVal;
      }
      selectedKey.value = activeKeys.value[0];
    });

    const selectedDepartment = ref<Department | undefined>(undefined);
    const availableAccountList: Ref<Array<Account>> = ref([]);

    async function refreshSelectedDepartment() {
      newMembers.value = [];
      const { data } = await DepartmentsService.getDepartment(selectedKey.value);
      selectedDepartment.value = data;

      if (data.parentId) {
        // 有父部门则取父部门成员
        const { data: accounts } = await DepartmentsService.findMembers(data.parentId);
        availableAccountList.value = accounts;
      } else {
        //否则取所有成员
        availableAccountList.value = accountList.value;
      }
    }

    watch(selectedKey, refreshSelectedDepartment);

    onMounted(async () => {
      await refresh();
      const { data: accounts } = await ProfileService.getAccounts();
      accountList.value = accounts;
    });

    async function onDeleteMember(member: { id: string }) {
      await DepartmentsService.removeMember(selectedKey.value, member.id);
      refreshSelectedDepartment();
    }

    async function onChangeSupervisor(member: { id: string }) {
      await DepartmentsService.updateDepartment({ id: selectedDepartment.value!.id, supervisor: member.id });
      refreshSelectedDepartment();
    }

    const newMembers = ref<Array<string>>([]);
    const addMembersDialogVisible = ref(false);
    async function onAddMembers() {
      await DepartmentsService.addMembers(selectedKey.value, newMembers.value);
      addMembersDialogVisible.value = false;
      refreshSelectedDepartment();
    }

    return {
      accountList,
      departments,
      departmentModel,
      onCreateDepartment,
      onEditDepartment,
      dialogVisible,
      dialogTitle,
      submit,
      activeKeys,
      selectedDepartment,
      refreshSelectedDepartment,
      onDeleteMember,
      onChangeSupervisor,
      newMembers,
      onAddMembers,
      addMembersDialogVisible,
      availableAccountList,
      isCreateDepartment,
      ...useI18n(),
    };
  },
});
</script>

<style lang="less" scoped>
.flex-basis-100 {
  flex-basis: 100%;
}
.departments {
  height: calc(100vh - 64px - 32px);

  .department-list-card {
    width: 320px;

    .department-list {
      max-height: calc(100% - 68px);
      overflow: auto;
      cursor: pointer;
      user-select: none;
    }
  }

  .department-detail {
    width: calc(100% - 320px);
  }
}
</style>
