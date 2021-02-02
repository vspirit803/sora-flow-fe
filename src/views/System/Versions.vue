<template>
  <div class="roles-container d-flex ma-4">
    <v-card
      outlined
      class="role-list-card flex-grow-0"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>{{ t('version.versionList') }}</span>
        <v-btn
          color="primary"
          @click="onCreateVersion"
        >
          <v-icon class="mr-2">
            mdi-puzzle-plus
          </v-icon>
          {{ t('add') }}
        </v-btn>
      </v-card-title>
      <v-list class="py-2 role-list">
        <v-list-item
          v-for="eachVersion of versionList"
          :key="eachVersion.id"
          link
          :input-value="selectedVersionId === eachVersion.id"
          @click="onSelectVersion(eachVersion)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="eachVersion.name" />
          </v-list-item-content>
          <v-list-item-action class="flex-row">
            <v-btn
              icon
              text
              color="primary"
              :title="t('update')"
              @click.stop="onUpdateVersion(eachVersion)"
            >
              <v-icon>mdi-puzzle-edit</v-icon>
            </v-btn>
            <Confirm
              v-slot="{ on, attrs }"
              :message="t('role.confirmDelete', [eachVersion.name])"
              @confirm="onDeleteVersion(eachVersion)"
            >
              <v-btn
                icon
                text
                color="error"
                :title="t('delete')"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-puzzle-remove</v-icon>
              </v-btn>
            </Confirm>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card
      outlined
      class="role-detail"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>{{ t('version.versionPermissions') }}</span>
        <v-btn
          v-if="selectedVersionId"
          color="primary"
          @click="submitAuthorizedOperations"
        >
          {{ t('submit') }}
        </v-btn>
      </v-card-title>
      <div class="py-2 menu-tree">
        <v-treeview
          v-model="authorizedOperations"
          :items="menuTree"
          open-all
          open-on-click
          selectable
          selection-type="leaf"
          transition
        />
      </div>
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
                  v-model="versionModel.name"
                  :label="t('version.name')"
                  required
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
            @click="submitRole"
          >
            {{ t('submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import {
  CreateVersionDto,
  MenusService,
  MenuTreeItem,
  RolesService,
  UpdateVersionDto,
  Version,
  VersionsService,
} from '@/service';
import { useStore } from '@/use';

export default defineComponent({
  name: 'Versions',
  setup() {
    const { t } = useI18n();
    const versionList: Ref<Array<Version>> = ref([]);
    const selectedVersionId = ref('');
    const authorizedOperations: Ref<Array<string>> = ref([]);
    const menuTree: Ref<Array<MenuTreeItem>> = ref([]);
    const dialogVisible = ref(false);
    const versionModel: Ref<UpdateVersionDto | CreateVersionDto> = ref({ name: '', authorizedOperations: [] });
    const store = useStore();
    function isCreateVersionDto(dto: UpdateVersionDto | CreateVersionDto): dto is CreateVersionDto {
      return !('id' in dto);
    }

    const dialogTitle = computed(
      () => `${isCreateVersionDto(versionModel.value) ? t('add') : t('update')} ${t('version.version')}`,
    );

    async function refreshRoleList() {
      const { data } = await VersionsService.getVersions();
      versionList.value = data;
    }

    async function onSelectVersion(version: Version) {
      selectedVersionId.value = version.id;
      const { data } = await RolesService.getRoleDetail(version.roleId);
      authorizedOperations.value = data.authorizedOperations;
    }

    onMounted(async () => {
      const { data: menuTreeData } = await MenusService.getMenus();
      menuTree.value = menuTreeData;

      await refreshRoleList();
      if (versionList.value.length) {
        onSelectVersion(versionList.value[0]);
      }
    });

    async function submitAuthorizedOperations() {
      const id = selectedVersionId.value;
      await VersionsService.updateVersion({ id, authorizedOperations: authorizedOperations.value });
      store.dispatch('refreshMenus');
    }

    async function submitRole() {
      if (isCreateVersionDto(versionModel.value)) {
        //新增版本
        await VersionsService.createVersion(versionModel.value);
      } else {
        //更新版本
        await VersionsService.updateVersion(versionModel.value);
      }
      dialogVisible.value = false;
      refreshRoleList();
    }

    async function onUpdateVersion({ id, name }: Version) {
      versionModel.value = { id, name };
      dialogVisible.value = true;
    }

    async function onCreateVersion() {
      versionModel.value = { name: '', authorizedOperations: [] };
      dialogVisible.value = true;
    }

    async function onDeleteVersion({ id }: Version) {
      await VersionsService.deleteVersion({ id });
      refreshRoleList();
    }
    return {
      versionList,
      onSelectVersion,
      selectedVersionId,
      authorizedOperations,
      menuTree,
      submitAuthorizedOperations,
      onUpdateVersion,
      onCreateVersion,
      onDeleteVersion,
      submitRole,
      dialogVisible,
      dialogTitle,
      versionModel,
      ...useI18n(),
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
