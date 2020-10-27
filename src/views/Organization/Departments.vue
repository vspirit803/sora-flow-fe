<template>
  <div class="departments d-flex ma-4">
    <v-card
      outlined
      class="department-list-card flex-grow-0 flex-shrink-0 mr-2"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>部门列表</span>
        <v-btn
          color="primary"
          icon
          title="添加部门"
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
        <template v-slot:append="{ item }">
          <v-btn
            color="primary"
            class="mr-2"
            icon
            title="编辑部门"
            @click="onEditDepartment(item)"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="mr-2"
            icon
            title="添加部门"
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
      负责人: {{ selectedDepartment.supervisor.nickname }}
      <br>
      <v-data-table
        :headers="[
          { text: '账号', value: 'name', divider: true },
          { text: '昵称', value: 'nickname', divider: true },
          { text: '操作', value: 'actions', width: 320 },
        ]"
        fixed-header
        :items="selectedDepartment.members"
      >
        <template v-slot:item.roles="{ item }">
          <v-chip
            v-for="eachRole of item.roles"
            :key="eachRole.id"
            color="primary"
            class="mr-2"
          >
            {{ eachRole.text }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <Confirm
            v-if="item.id!==selectedDepartment.supervisor.id"
            v-slot="{ on, attrs }"
            :message="`确认将[${item.nickname}]移出部门吗`"
            @confirm="onDeleteMember(item)"
          >
            <IconButton
              class="ml-2"
              color="error"
              v-bind="attrs"
              title="移除成员"
              v-on="on"
            >
              <v-icon>mdi-account-remove</v-icon>
            </IconButton>
          </Confirm>
          <Confirm
            v-if="item.id!==selectedDepartment.supervisor.id"
            v-slot="{ on, attrs }"
            :message="`确认将[${item.nickname}]设为部门负责人吗`"
            @confirm="onChangeSupervisor(item)"
          >
            <IconButton
              class="ml-2"
              color="primary"
              v-bind="attrs"
              title="设为负责人"
              v-on="on"
            >
              <v-icon>mdi-account</v-icon>
            </IconButton>
          </Confirm>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-btn
              icon
              text
              color="primary"
              title="刷新列表"
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
              </v-icon>新增成员
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
                  label="负责人"
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
            取消
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit"
          >
            提交
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
          <span class="headline">新增成员</span>
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
            取消
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onAddMembers"
          >
            提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

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
  components: { draggable },
  setup() {
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
    const dialogTitle = computed(() => (isCreateDepartment.value ? '新增部门' : '修改部门'));

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
