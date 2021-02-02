<template>
  <div>
    <v-list-item>
      <v-list-item-title class="d-flex flex-row">
        <span class="align-self-center">{{ t('menu.menu') }}</span>
        <v-switch
          v-model="sortable"
          :label="t('menu.adjustOrder')"
          hide-details
          class="ml-8 mt-0 pt-0"
        />
      </v-list-item-title>
      <v-list-item-action class="flex-row justify-end flex-basis-100">
        <IconButton
          icon
          text
          color="primary"
          :title="`${t('add')}${t('menu.menuItem')}`"
          @click.stop="createMenu(undefined, 'item')"
        >
          <v-icon>mdi-file-plus</v-icon>
        </IconButton>
        <IconButton
          icon
          text
          color="primary"
          :title="`${t('add')}${t('menu.subMenu')}`"
          @click.stop="createMenu(undefined, 'directory')"
        >
          <v-icon>mdi-folder-plus</v-icon>
        </IconButton>
      </v-list-item-action>
    </v-list-item>
    <v-divider />
    <v-list expand>
      <v-list-item-group color="primary">
        <!--一级菜单-->
        <draggable
          v-model="menus"
          handle=".menu-handle"
          @sort="onSort(menus)"
        >
          <template v-for="each of menus">
            <v-list-item
              v-if="each.type === 'item'"
              :key="each.id"
              link
            >
              <v-list-item-icon
                v-if="sortable"
                class="menu-handle mr-2"
              >
                <v-icon>mdi-drag</v-icon>
              </v-list-item-icon>
              <v-list-item-icon v-if="each.icon">
                <v-icon>{{ each.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ each.name }}</v-list-item-title>
              <v-list-item-action class="flex-row justify-end flex-basis-100">
                <IconButton
                  icon
                  text
                  color="primary"
                  :title="`${t('update')}${t('menu.menuItem')}`"
                  @click.stop="updateMenu(each)"
                >
                  <v-icon>mdi-file-document-edit</v-icon>
                </IconButton>
                <Confirm
                  v-slot="{ on, attrs }"
                  :message="t('menu.confirmDeleteMenuItem', [each.name])"
                  @confirm="deleteMenu(each)"
                >
                  <IconButton
                    icon
                    text
                    color="error"
                    :title="`${t('delete')}${t('menu.menuItem')}`"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-file-remove</v-icon>
                  </IconButton>
                </Confirm>
              </v-list-item-action>
            </v-list-item>
            <v-list-group
              v-else
              :key="each.id"
            >
              <template #activator>
                <v-list-item-icon
                  v-if="sortable"
                  class="menu-handle mr-2"
                >
                  <v-icon>mdi-drag</v-icon>
                </v-list-item-icon>
                <v-list-item-icon v-if="each.icon">
                  <v-icon>{{ each.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ each.name }}</v-list-item-title>
                <v-list-item-action class="flex-row justify-end flex-basis-100">
                  <IconButton
                    icon
                    text
                    color="primary"
                    :title="`${t('add')}${t('menu.menuItem')}`"
                    @click.stop="createMenu(each, 'item')"
                  >
                    <v-icon>mdi-file-plus</v-icon>
                  </IconButton>
                  <IconButton
                    icon
                    text
                    color="primary"
                    :title="`${t('add')}${t('menu.subMenu')}`"
                    @click.stop="createMenu(each, 'directory')"
                  >
                    <v-icon>mdi-folder-plus</v-icon>
                  </IconButton>
                  <IconButton
                    icon
                    text
                    color="primary"
                    :title="`${t('update')}${t('menu.menu')}`"
                    @click.stop="updateMenu(each)"
                  >
                    <v-icon>mdi-folder-edit</v-icon>
                  </IconButton>
                  <Confirm
                    v-slot="{ on, attrs }"
                    :message="t('menu.confirmDeleteMenu', [each.name])"
                    @confirm="deleteMenu(each)"
                  >
                    <IconButton
                      icon
                      text
                      color="error"
                      :title="`${t('delete')}${t('menu.menu')}`"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-folder-remove</v-icon>
                    </IconButton>
                  </Confirm>
                </v-list-item-action>
              </template>

              <!--二级菜单-->
              <draggable
                v-model="each.children"
                handle=".menu-handle"
                @sort="onSort(each.children)"
              >
                <template v-for="eachSub of each.children">
                  <v-list-item
                    v-if="eachSub.type === 'item'"
                    :key="eachSub.id"
                    class="pl-8"
                    link
                  >
                    <v-list-item-icon
                      v-if="sortable"
                      class="menu-handle mr-2"
                    >
                      <v-icon>mdi-drag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-icon v-if="eachSub.icon">
                      <v-icon>{{ eachSub.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ eachSub.name }}</v-list-item-title>
                    <v-list-item-action class="flex-row justify-end flex-basis-100">
                      <IconButton
                        icon
                        text
                        color="primary"
                        :title="`${t('update')}${t('menu.menuItem')}`"
                        @click.stop="updateMenu(eachSub)"
                      >
                        <v-icon>mdi-file-document-edit</v-icon>
                      </IconButton>
                      <Confirm
                        v-slot="{ on, attrs }"
                        :message="t('menu.confirmDeleteMenuItem', [eachSub.name])"
                        @confirm="deleteMenu(eachSub)"
                      >
                        <IconButton
                          icon
                          text
                          color="error"
                          :title="`${t('delete')}${t('menu.menuItem')}`"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-file-remove</v-icon>
                        </IconButton>
                      </Confirm>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-group
                    v-else
                    :key="eachSub.id"
                    sub-group
                  >
                    <template #activator>
                      <v-list-item-icon
                        v-if="sortable"
                        class="menu-handle mr-2"
                      >
                        <v-icon>mdi-drag</v-icon>
                      </v-list-item-icon>
                      <v-list-item-icon v-if="eachSub.icon">
                        <v-icon>{{ eachSub.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ eachSub.name }}</v-list-item-title>
                      <v-list-item-action class="flex-row justify-end flex-basis-100">
                        <IconButton
                          icon
                          text
                          color="primary"
                          :title="`${t('add')}${t('menu.menuItem')}`"
                          @click.stop="createMenu(eachSub, 'item')"
                        >
                          <v-icon>mdi-file-plus</v-icon>
                        </IconButton>
                        <IconButton
                          icon
                          text
                          color="primary"
                          :title="`${t('update')}${t('menu.menu')}`"
                          @click.stop="updateMenu(eachSub)"
                        >
                          <v-icon>mdi-folder-edit</v-icon>
                        </IconButton>
                        <Confirm
                          v-slot="{ on, attrs }"
                          :message="t('menu.confirmDeleteMenu', [eachSub.name])"
                          @confirm="deleteMenu(eachSub)"
                        >
                          <IconButton
                            icon
                            text
                            color="error"
                            :title="`${t('delete')}${t('menu.menu')}`"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-folder-remove</v-icon>
                          </IconButton>
                        </Confirm>
                      </v-list-item-action>
                    </template>

                    <!--三级菜单-->
                    <draggable
                      v-model="eachSub.children"
                      handle=".menu-handle"
                      @sort="onSort(eachSub.children)"
                    >
                      <v-list-item
                        v-for="eachSubSub of eachSub.children"
                        :key="eachSubSub.id"
                        link
                      >
                        <v-list-item-icon
                          v-if="sortable"
                          class="menu-handle mr-2"
                        >
                          <v-icon>mdi-drag</v-icon>
                        </v-list-item-icon>
                        <v-list-item-icon v-if="eachSubSub.icon">
                          <v-icon>{{ eachSubSub.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ eachSubSub.name }}</v-list-item-title>
                        <v-list-item-action class="flex-row justify-end flex-basis-100">
                          <IconButton
                            icon
                            text
                            color="primary"
                            :title="`${t('update')}${t('menu.menuItem')}`"
                            @click.stop="updateMenu(eachSubSub)"
                          >
                            <v-icon>mdi-file-document-edit</v-icon>
                          </IconButton>
                          <Confirm
                            v-slot="{ on, attrs }"
                            :message="t('menu.confirmDeleteMenuItem', [eachSubSub.name])"
                            @confirm="deleteMenu(eachSubSub)"
                          >
                            <IconButton
                              icon
                              text
                              color="error"
                              :title="`${t('delete')}${t('menu.menuItem')}`"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon>mdi-file-remove</v-icon>
                            </IconButton>
                          </Confirm>
                        </v-list-item-action>
                      </v-list-item>
                    </draggable>
                  </v-list-group>
                </template>
              </draggable>
            </v-list-group>
          </template>
        </draggable>
      </v-list-item-group>
    </v-list>

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
                  v-model="menuModel.name"
                  :label="t('menu.name')"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="menuModel.icon"
                  :label="t('menu.icon')"
                />
              </v-col>
              <v-col
                v-if="menuModel.type === 'item'"
                cols="12"
              >
                <v-text-field
                  v-model="menuModel.url"
                  :label="t('menu.url')"
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
            @click="submit"
          >
            {{ t('submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';
import draggable from 'vuedraggable';

import { CreateMenuDto, MenusService, MenuTreeItem, UpdateMenuDto } from '@/service';
import { useStore } from '@/use';

export default defineComponent({
  name: 'Menu',
  components: { draggable },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const menus: Ref<Array<MenuTreeItem>> = ref([]);
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const menuModel: Ref<CreateMenuDto | UpdateMenuDto> = ref({
      name: '',
      icon: '',
      url: '',
      type: 'directory',
    }) as Ref<CreateMenuDto | UpdateMenuDto>;
    const sortable = ref(false);

    async function refresh() {
      const { data } = await MenusService.getMenus();
      menus.value = data;
      dialogVisible.value = false;
    }

    onMounted(() => {
      refresh();
    });

    function createMenu(parent: { id: string } | undefined, type: 'directory' | 'item') {
      dialogTitle.value = `${t('add')}${type === 'directory' ? t('menu.menu') : t('menu.menuItem')}`;
      menuModel.value = {
        name: '',
        icon: '',
        url: '',
        type,
        parentId: parent?.id,
      };
      dialogVisible.value = true;
    }

    function updateMenu({
      id,
      name,
      icon,
      url,
      type,
    }: {
      id: string;
      name: string;
      icon: string;
      url: string;
      type: 'directory' | 'item';
    }) {
      dialogTitle.value = `${t('update')}${type === 'directory' ? t('menu.menu') : t('menu.menuItem')}`;
      menuModel.value = {
        id,
        name,
        icon,
        url,
        type,
      };
      dialogVisible.value = true;
    }

    async function deleteMenu({ id }: { id: string }) {
      await MenusService.deleteMenu({ id });
      refresh();
    }

    async function submit() {
      if ('id' in menuModel.value) {
        await MenusService.updateMenu(menuModel.value);
        refresh();
      } else {
        await MenusService.createMenu(menuModel.value);
        refresh();
      }
    }

    async function onSort(menus: Array<{ id: string }>) {
      await MenusService.updateOrder({ menus: menus.map((each) => each.id) });
      store.dispatch('refreshMenus');
    }

    return {
      onSort,
      sortable,
      menus,
      createMenu,
      updateMenu,
      deleteMenu,
      dialogVisible,
      dialogTitle,
      submit,
      menuModel,
      ...useI18n(),
    };
  },
});
</script>

<style lang="less" scoped>
.flex-basis-100 {
  flex-basis: 100%;
}
</style>
