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
        :items="departments"
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
      outlined
      class="department-detail"
    />
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
              <v-col cols="12">
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { CreateDepartmentDto, DepartmentsService, DepartmentVo, ProfileService, UpdateDepartmentDto } from '@/service';
import { useStore } from '@/use';

export default defineComponent({
  name: 'Department',
  components: { draggable },
  setup() {
    const store = useStore();
    const departments: Ref<Array<DepartmentVo>> = ref([]);
    const departmentModel: Ref<CreateDepartmentDto | UpdateDepartmentDto> = ref({
      name: '',
      supervisor: '',
    });
    const accountList: Ref<Array<Account>> = ref([]);

    function isCreateDepartmentDto(dto: CreateDepartmentDto | UpdateDepartmentDto): dto is CreateDepartmentDto {
      return !('id' in dto);
    }

    const dialogVisible = ref(false);
    const dialogTitle = computed(() => (isCreateDepartmentDto(departmentModel.value) ? '新增部门' : '修改部门'));

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
        supervisor,
      };
      dialogVisible.value = true;
    }

    async function submit() {
      if (isCreateDepartmentDto(departmentModel.value)) {
        await DepartmentsService.createDepartment(departmentModel.value);
      } else {
        await DepartmentsService.updateDepartment(departmentModel.value);
      }
      dialogVisible.value = false;
      refresh();
    }

    onMounted(async () => {
      await refresh();
      const { data: accounts } = await ProfileService.getAccounts();
      accountList.value = accounts;
    });

    return {
      accountList,
      departments,
      departmentModel,
      onCreateDepartment,
      onEditDepartment,
      dialogVisible,
      dialogTitle,
      submit,
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
      height: calc(100% - 68px);
      overflow: auto;
    }
  }

  .department-detail {
    width: calc(100% - 320px);
  }
}
</style>
