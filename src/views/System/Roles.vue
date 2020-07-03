<template>
  <div class="roles-container d-flex ma-4">
    <v-card outlined class="role-list-card flex-grow-0">
      <v-card-title class="d-flex justify-space-between">
        <span>角色列表</span><v-btn text @click="onCreateRole">新增角色</v-btn>
      </v-card-title>
      <v-list class="py-2 role-list">
        <v-list-item
          v-for="eachRole of roleList"
          :key="eachRole.id"
          link
          @click="onSelectRole(eachRole)"
          :input-value="selectedRole === eachRole.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="eachRole.text"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="flex-row">
            <v-btn icon text color="primary" title="编辑角色" @click.stop="onUpdateRole(eachRole)">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
            <Confirm
              v-slot="{ on, attrs }"
              :message="`确认删除角色[${eachRole.name}]吗`"
              @confirm="onDeleteRole(eachRole)"
            >
              <v-btn icon text color="error" title="删除角色" v-bind="attrs" v-on="on">
                <v-icon>mdi-account-remove</v-icon>
              </v-btn>
            </Confirm>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card outlined class="role-detail">
      <v-card-title class="d-flex justify-space-between">
        <span>角色权限</span><v-btn v-if="selectedRole" text @click="submitAuthorizedOperations">确定</v-btn>
      </v-card-title>
      <div class="py-2 menu-tree">
        <v-treeview
          :items="menuTree"
          v-model="authorizedOperations"
          open-all
          open-on-click
          selectable
          selection-type="leaf"
          transition
        ></v-treeview>
      </div>
    </v-card>

    <v-dialog v-model="dialogVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="名称" required v-model="roleModel.name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="显示名称" v-model="roleModel.text"></v-text-field>
              </v-col>
              <v-col v-if="roleModel.type === 'item'" cols="12">
                <v-text-field label="url" required v-model="roleModel.url"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogVisible = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="submitRole">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import Confirm from '@/components/Confirm.vue';
import { CreateRoleDto, MenuService, RoleService, UpdateRoleDto } from '@/service';

type test = 'directory' | 'item';

export default defineComponent({
  name: 'Roles',
  components: { Confirm },
  setup() {
    const roleList: Ref<Array<any>> = ref([]);
    const selectedRole = ref('');
    const authorizedOperations: Ref<Array<string>> = ref([]);
    const menuTree: Ref<Array<any>> = ref([]);
    const dialogVisible = ref(false);
    const roleModel: Ref<UpdateRoleDto | CreateRoleDto> = ref({});
    function isCreateRoleDto(dto: UpdateRoleDto | CreateRoleDto): dto is CreateRoleDto {
      return !('id' in dto);
    }

    const dialogTitle = computed(() => (isCreateRoleDto(roleModel.value) ? '新增角色' : '修改角色'));

    async function refreshRoleList() {
      const { data } = await RoleService.getRoles();
      roleList.value = data;
    }

    async function onSelectRole(role: { id: string; name: string }) {
      selectedRole.value = role.id;
      const { data } = await RoleService.getRoleDetail(role.id);
      authorizedOperations.value = data.authorizedOperations;
    }

    onMounted(async () => {
      const { data: menuTreeData } = await MenuService.getMenus();
      menuTree.value = menuTreeData;

      await refreshRoleList();
      if (roleList.value.length) {
        onSelectRole(roleList.value[0]);
      }
    });

    async function submitAuthorizedOperations() {
      const id = selectedRole.value;
      await RoleService.updateRole({ id, authorizedOperations: authorizedOperations.value });
    }

    async function submitRole() {
      if (isCreateRoleDto(roleModel.value)) {
        //新增角色
        await RoleService.createRole(roleModel.value);
      } else {
        //更新角色
        await RoleService.updateRole(roleModel.value);
      }
      dialogVisible.value = false;
      refreshRoleList();
    }

    async function onUpdateRole({ id, name, text }: { id: string; name?: string; text?: string }) {
      roleModel.value = { id, name, text };
      dialogVisible.value = true;
    }

    async function onCreateRole() {
      roleModel.value = { name: '', text: '' };
      dialogVisible.value = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function onDeleteRole({ id, name, text }: { id: string; name?: string; text?: string }) {
      await RoleService.deleteRole({ id });
      refreshRoleList();
    }
    return {
      roleList,
      onSelectRole,
      selectedRole,
      authorizedOperations,
      menuTree,
      submitAuthorizedOperations,
      onUpdateRole,
      onCreateRole,
      onDeleteRole,
      submitRole,
      dialogVisible,
      dialogTitle,
      roleModel,
    };
  },
});
</script>

<style lang="less" scoped>
.roles-container {
  height: calc(100vh - 64px - 32px);

  .role-list-card {
    width: 280px;

    .role-list {
      height: calc(100% - 68px);
      overflow: auto;
    }
  }

  .role-detail {
    width: 480px;

    .menu-tree {
      height: calc(100% - 68px);
      overflow: auto;
    }
  }
}
</style>