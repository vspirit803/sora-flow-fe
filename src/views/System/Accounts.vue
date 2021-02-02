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
      <template #item.actions="{ item }">
        <IconButton
          color="primary"
          :title="t('update')"
          @click="onUpdateAccount(item)"
        >
          <v-icon>
            mdi-account-edit
          </v-icon>
        </IconButton>
        <Confirm
          v-slot="{ on, attrs }"
          :message="t('account.confirmDelete', [item.nickname])"
          @confirm="onDeleteAccount(item)"
        >
          <IconButton
            class="ml-2"
            color="error"
            v-bind="attrs"
            :title="t('delete')"
            v-on="on"
          >
            <v-icon>mdi-account-remove</v-icon>
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
            <template #activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                @click="onCreateAccount"
              >
                <v-icon class="mr-2">
                  mdi-account-plus
                </v-icon>
                {{ t('add') }}
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
                              :label="t('account.username')"
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
                              :label="t('account.nickname')"
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
                              :label="t('account.password')"
                              :error-messages="errors"
                              :success="valid"
                              type="password"
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
                    {{ t('cancel') }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="invalid || !validated"
                    @click="passes(submitAccount)"
                  >
                    {{ t('submit') }}
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
import { computed, defineComponent, nextTick, onMounted, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import { Account, AccountsService, CreateAccountDto, MenuTreeItem, UpdateAccountDto } from '@/service';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};

export default defineComponent({
  name: 'Accounts',
  setup() {
    const { t } = useI18n();
    const obs: Ref<Obs> = ref() as Ref<Obs>;
    const accountList: Ref<Array<Account>> = ref([]);
    const authorizedOperations: Ref<Array<string>> = ref([]);
    const menuTree: Ref<Array<MenuTreeItem>> = ref([]);
    const dialogVisible = ref(false);
    const accountModel: Ref<CreateAccountDto | UpdateAccountDto> = ref({
      name: '',
      nickname: '',
      password: '',
    });
    const headers = [
      { text: t('account.username'), value: 'name', divider: true },
      { text: t('account.nickname'), value: 'nickname', divider: true },
      { text: t('actions'), value: 'actions', width: 300 },
    ];
    function isCreateAccountDto(dto: CreateAccountDto | UpdateAccountDto): dto is CreateAccountDto {
      return !('id' in dto);
    }

    const isCreateAccount = computed(() => isCreateAccountDto(accountModel.value));
    const dialogTitle = computed(() => (isCreateAccount.value ? t('add') : t('update')));

    async function refreshAccountList() {
      const { data } = await AccountsService.getAccounts();
      accountList.value = data;
    }

    onMounted(async () => {
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

    async function onUpdateAccount({ id, name, nickname }: { id: string; name: string; nickname: string }) {
      accountModel.value = { id, name, nickname };
      dialogVisible.value = true;
      nextTick().then(obs.value.validate);
    }

    async function onCreateAccount() {
      accountModel.value = { name: '', nickname: '', password: '' };
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
      headers,
      isCreateAccount,
      refreshAccountList,
      ...useI18n(),
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
