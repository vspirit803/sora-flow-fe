<template>
  <v-card
    class="accounts-container ma-4"
    outlined
  >
    <v-data-table
      :headers="headers"
      fixed-header
      :items="accountList"
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
        <IconButton
          color="primary"
          title="修改账号"
          @click="onUpdateAccount(item)"
        >
          <v-icon class="mr-2">
            mdi-account-edit
          </v-icon>
        </IconButton>
        <Confirm
          v-slot="{ on, attrs }"
          :message="`确认删除账号[${item.nickname}]吗`"
          @confirm="onDeleteAccount(item)"
        >
          <IconButton
            class="ml-2"
            color="error"
            v-bind="attrs"
            title="删除账号"
            v-on="on"
          >
            <v-icon>mdi-account-remove</v-icon>
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
            @click="refreshAccountList"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-dialog
            v-model="dialogVisible"
            eager
            persistent
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                @click="onCreateAccount"
              >
                <v-icon class="mr-2">
                  mdi-account-plus
                </v-icon>新增账号
              </v-btn>
            </template>
            <ValidationObserver
              ref="obs"
              v-slot="{ invalid, validated, passes }"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ dialogTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form>
                      <v-row>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="name"
                            rules="required"
                          >
                            <v-text-field
                              v-model="accountModel.name"
                              label="账号"
                              :error-messages="errors"
                              :success="valid"
                              :readonly="!isCreateAccount"
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="nickname"
                            rules="required"
                          >
                            <v-text-field
                              v-model="accountModel.nickname"
                              label="昵称"
                              :error-messages="errors"
                              :success="valid"
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="password"
                            :rules="isCreateAccount ? 'required' : null"
                          >
                            <v-text-field
                              v-model="accountModel.password"
                              label="密码"
                              :error-messages="errors"
                              :success="valid"
                              type="password"
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="roles"
                            rules="required"
                          >
                            <v-select
                              v-model="accountModel.roles"
                              chips
                              color="primary"
                              :error-messages="errors"
                              :success="valid"
                              item-value="id"
                              :items="roleList"
                              label="角色"
                              multiple
                            />
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    text
                    @click="dialogVisible = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="invalid || !validated"
                    @click="passes(submitAccount)"
                  >
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

import {
  Account,
  AccountsService,
  CreateAccountDto,
  MenuTreeItem,
  ProfileService,
  Role,
  RolesService,
  UpdateAccountDto,
} from '@/service';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};

export default defineComponent({
  name: 'Accounts',
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
      { text: '账号', value: 'name', divider: true },
      { text: '昵称', value: 'nickname', divider: true },
      { text: '角色', value: 'roles', divider: true },
      { text: '操作', value: 'actions', width: 300 },
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
      const { data: roles } = await RolesService.getRoles();
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
      refreshAccountList,
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
