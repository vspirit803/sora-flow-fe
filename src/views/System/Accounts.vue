<template>
  <v-card class="accounts-container ma-4" outlined>
    <v-data-table :headers="headers" fixed-header :items="accountList">
      <template v-slot:item.roles="{ item }">
        <v-chip color="primary" class="mr-2" v-for="eachRole of item.roles" :key="eachRole.id">
          {{ eachRole.text }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" class="mr-2" @click="onUpdateAccount(item)" title="修改账号">
          mdi-account-edit
        </v-icon>
        <Confirm v-slot="{ on, attrs }" :message="`确认删除账号[${item.nickname}]吗`" @confirm="onDeleteAccount(item)">
          <v-btn icon text color="error" title="删除账号" v-bind="attrs" v-on="on">
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
        </Confirm>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog eager persistent v-model="dialogVisible" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="onCreateAccount">新增账号</v-btn>
            </template>
            <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes }">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ dialogTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form>
                      <v-row>
                        <v-col cols="12">
                          <ValidationProvider name="name" rules="required" v-slot="{ errors, valid }">
                            <v-text-field
                              label="账号"
                              :error-messages="errors"
                              :success="valid"
                              :readonly="!isCreateAccount"
                              v-model="accountModel.name"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider name="nickname" rules="required" v-slot="{ errors, valid }">
                            <v-text-field
                              label="昵称"
                              :error-messages="errors"
                              :success="valid"
                              v-model="accountModel.nickname"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            name="password"
                            :rules="isCreateAccount ? 'required' : null"
                            v-slot="{ errors, valid }"
                          >
                            <v-text-field
                              label="密码"
                              :error-messages="errors"
                              :success="valid"
                              type="password"
                              v-model="accountModel.password"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider name="roles" rules="required" v-slot="{ errors, valid }">
                            <v-select
                              chips
                              :error-messages="errors"
                              :success="valid"
                              v-model="accountModel.roles"
                              item-value="id"
                              :items="roleList"
                              label="角色"
                              multiple
                            ></v-select>
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogVisible = false">取消</v-btn>
                  <v-btn color="primary" text :disabled="invalid || !validated" @click="passes(submitAccount)">
                    提交
                  </v-btn>
                </v-card-actions>
              </v-card>
            </ValidationObserver>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import Confirm from '@/components/Confirm.vue';
import {
  Account,
  AccountsService,
  CreateAccountDto,
  MenuTreeItem,
  ProfileService,
  Role,
  RoleService,
  UpdateAccountDto,
} from '@/service';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};

export default defineComponent({
  name: 'Accounts',
  components: { Confirm },
  setup(props, { root }) {
    const obs: Ref<Obs> = ref() as Ref<Obs>;
    const accountList: Ref<Array<Account>> = ref([]);
    const authorizedOperations: Ref<Array<string>> = ref([]);
    const menuTree: Ref<Array<MenuTreeItem>> = ref([]);
    const dialogVisible = ref(false);
    const accountModel: Ref<CreateAccountDto | UpdateAccountDto> = ref({
      name: '',
      nickname: '',
      password: '',
      roles: [],
    });
    const roleList: Ref<Array<Role>> = ref([]);
    const headers = [
      { text: '账号', value: 'name' },
      { text: '昵称', value: 'nickname' },
      { text: '角色', value: 'roles' },
      { text: '操作', value: 'actions' },
    ];
    function isCreateAccountDto(dto: CreateAccountDto | UpdateAccountDto): dto is CreateAccountDto {
      return !('id' in dto);
    }

    const isCreateAccount = computed(() => isCreateAccountDto(accountModel.value));
    const dialogTitle = computed(() => (isCreateAccount.value ? '新增账号' : '修改账号'));

    async function refreshAccountList() {
      const { data } = await ProfileService.getAccounts();
      accountList.value = data;
    }

    onMounted(async () => {
      const { data: roles } = await RoleService.getRoles();
      roleList.value = roles;
      await refreshAccountList();
    });

    async function submitAccount() {
      if (isCreateAccountDto(accountModel.value)) {
        //新增账号
        await AccountsService.createAccount(accountModel.value);
      } else {
        //修改账号
        const { ...data } = accountModel.value;
        if (!data.password) {
          data.password = undefined;
        }
        await AccountsService.updateAccount(data);
      }
      dialogVisible.value = false;
      refreshAccountList();
    }

    async function onUpdateAccount({
      id,
      name,
      nickname,
      roles,
    }: {
      id: string;
      name: string;
      nickname: string;
      roles: Array<{ id: string }>;
    }) {
      accountModel.value = { id, name, nickname, roles: roles.map((each) => each.id) };
      dialogVisible.value = true;
      root.$nextTick().then(obs.value.validate);
    }

    async function onCreateAccount() {
      accountModel.value = { name: '', nickname: '', roles: [], password: '' };
      dialogVisible.value = true;
      obs.value.reset();
    }

    async function onDeleteAccount({ id }: Account) {
      await AccountsService.deleteAccount({ id });
      refreshAccountList();
    }
    return {
      accountList,
      accountModel,
      authorizedOperations,
      obs,
      menuTree,
      onUpdateAccount,
      onCreateAccount,
      onDeleteAccount,
      submitAccount,
      dialogVisible,
      dialogTitle,
      roleList,
      headers,
      isCreateAccount,
    };
  },
});
</script>

<style lang="less" scoped>
.accounts-container {
  height: calc(100vh - 64px - 32px);

  /deep/ .v-data-table .v-data-table__wrapper {
    max-height: calc(100vh - 64px - 32px - 64px - 61px);
  }
}
</style>
