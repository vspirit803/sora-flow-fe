<template>
  <v-card
    class="organizations-container ma-4"
    outlined
  >
    <v-data-table
      :headers="headers"
      fixed-header
      :items="organizationList"
    >
      <template #item.actions="{ item }">
        <IconButton
          :title="`${t('update')}${t('organization.organization')}`"
          color="primary"
          @click="onUpdateOrganization(item)"
        >
          <v-icon>
            mdi-home-edit
          </v-icon>
        </IconButton>
        <Confirm
          v-slot="{ on, attrs }"
          :message="t('confirmDelete', [item.name])"
          @confirm="onDeleteOrganization(item)"
        >
          <IconButton
            class="ml-2"
            color="error"
            v-bind="attrs"
            :title="`${t('delete')}${t('organization.organization')}`"
            v-on="on"
          >
            <v-icon>mdi-home-remove</v-icon>
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
            @click="refreshOrganizationList"
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
                @v-bind="attrs"
                @click="onCreateOrganization"
              >
                <v-icon class="mr-2">
                  mdi-home-plus
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
                              v-model="organizationModel.name"
                              :label="t('organization.name')"
                              :error-messages="errors"
                              :success="valid"
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="versionId"
                            rules="required"
                          >
                            <v-select
                              v-model="organizationModel.versionId"
                              color="primary"
                              :error-messages="errors"
                              :success="valid"
                              item-text="name"
                              item-value="id"
                              :items="versionList"
                              :label="t('organization.version')"
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            name="supervisorId"
                          >
                            <v-select
                              v-model="organizationModel.supervisorId"
                              color="primary"
                              :error-messages="errors"
                              :success="valid"
                              item-text="name"
                              item-value="id"
                              :items="accountList"
                              :label="t('organization.supervisor')"
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
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import {
  Account,
  AccountsService,
  CreateOrganizationDto,
  MenuTreeItem,
  Organization,
  OrganizationsService,
  UpdateOrganizationDto,
  Version,
  VersionsService,
} from '@/service';
import { diff } from '@/utils';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};

export default defineComponent({
  name: 'Organizations',
  setup(props, { root }) {
    const { t } = useI18n();
    const obs: Ref<Obs> = ref() as Ref<Obs>;
    const organizationList: Ref<Array<Organization>> = ref([]);
    const authorizedOperations: Ref<Array<string>> = ref([]);
    const versionList: Ref<Array<Version>> = ref([]);
    const accountList: Ref<Array<Account>> = ref([]);
    const menuTree: Ref<Array<MenuTreeItem>> = ref([]);
    const dialogVisible = ref(false);
    const organizationModel: Ref<CreateOrganizationDto | UpdateOrganizationDto> = ref({
      name: '',
      supervisorId: '',
      versionId: '',
    });
    let oldModel: UpdateOrganizationDto;
    const headers = [
      { text: t('organization.name'), value: 'name', divider: true },
      { text: t('organization.version'), value: 'version.name', divider: true },
      { text: t('organization.supervisor'), value: 'supervisor.nickname', divider: true },
      { text: t('organization.totalMembers'), value: 'totalMembers', divider: true },
      { text: t('actions'), value: 'actions' },
    ];
    function isCreateOrganizationDto(dto: CreateOrganizationDto | UpdateOrganizationDto): dto is CreateOrganizationDto {
      return !('id' in dto);
    }

    const isCreate = computed(() => isCreateOrganizationDto(organizationModel.value));
    const dialogTitle = computed(() => `${isCreate.value ? t('add') : t('update')} ${t('organization.organization')}`);

    async function refreshOrganizationList() {
      const { data } = await OrganizationsService.getOrganizations();
      organizationList.value = data;
    }

    onMounted(async () => {
      const { data: versions } = await VersionsService.getVersions();
      versionList.value = versions;
      const { data: accounts } = await AccountsService.getAccounts();
      accountList.value = accounts;
      await refreshOrganizationList();
    });

    async function submitAccount() {
      if (isCreateOrganizationDto(organizationModel.value)) {
        //新增账号
        await OrganizationsService.createOrganization(organizationModel.value);
      } else {
        //修改账号
        const diffData = diff(organizationModel.value, oldModel);
        //没有数据变化
        if (!Object.keys(diffData).length) {
          dialogVisible.value = false;
          return;
        }
        const { id } = organizationModel.value;
        await OrganizationsService.updateOrganization({ ...diffData, id });

        // const { ...data } = organizationModel.value;
        // await OrganizationsService.updateOrganization(data);
      }
      dialogVisible.value = false;
      refreshOrganizationList();
    }

    async function onUpdateOrganization({ id, name, supervisorId, versionId }: Organization) {
      oldModel = { id, name, supervisorId, versionId };
      organizationModel.value = { id, name, supervisorId, versionId };
      dialogVisible.value = true;
      root.$nextTick().then(obs.value.validate);
    }

    async function onCreateOrganization() {
      organizationModel.value = { name: '', supervisorId: '', versionId: '' };
      dialogVisible.value = true;
      obs.value.reset();
    }

    async function onDeleteOrganization({ id }: Organization) {
      await OrganizationsService.deleteOrganization({ id });
      refreshOrganizationList();
    }
    return {
      organizationList,
      organizationModel,
      authorizedOperations,
      obs,
      menuTree,
      onUpdateOrganization,
      onCreateOrganization,
      onDeleteOrganization,
      submitAccount,
      dialogVisible,
      dialogTitle,
      headers,
      isCreate,
      refreshOrganizationList,
      versionList,
      accountList,
      ...useI18n(),
    };
  },
});
</script>

<style lang="less" scoped>
.organizations-container {
  height: calc(100vh - 64px - 32px);

  /deep/ .v-data-table .v-data-table__wrapper {
    max-height: calc(100vh - 64px - 32px - 64px - 61px);
  }
}
</style>
