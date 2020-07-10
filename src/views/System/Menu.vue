<template>
  <div>
    <v-list-item>
      <v-list-item-title> 菜单 </v-list-item-title>
      <v-list-item-action class="flex-row">
        <v-btn
          icon
          text
          color="primary"
          title="添加菜单项"
          @click.stop="createMenu(undefined, 'item')"
        >
          <v-icon>mdi-file-plus</v-icon>
        </v-btn>
        <v-btn
          icon
          text
          color="primary"
          title="添加子菜单"
          @click.stop="createMenu(undefined, 'directory')"
        >
          <v-icon>mdi-folder-plus</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider />
    <v-list expand>
      <v-list-item-group
        color="primary"
      >
        <!--一级菜单-->
        <template v-for="each of menus">
          <v-list-item
            v-if="each.type === 'item'"
            :key="each.id"
            link
          >
            <v-list-item-icon v-if="each.icon">
              <v-icon>{{ each.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ each.name }}</v-list-item-title>
            <v-list-item-action class="flex-row">
              <v-btn
                icon
                text
                color="primary"
                title="编辑菜单项"
                @click.stop="updateMenu(each)"
              >
                <v-icon>mdi-file-document-edit</v-icon>
              </v-btn>
              <Confirm
                v-slot="{ on, attrs }"
                :message="`确认删除菜单[${each.name}]吗`"
                @confirm="deleteMenu(each)"
              >
                <v-btn
                  icon
                  text
                  color="error"
                  title="删除菜单项"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-file-remove</v-icon>
                </v-btn>
              </Confirm>
            </v-list-item-action>
          </v-list-item>
          <v-list-group
            v-else
            :key="each.id"
          >
            <template v-slot:activator>
              <v-list-item-icon v-if="each.icon">
                <v-icon>{{ each.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ each.name }}</v-list-item-title>
              <v-list-item-action class="flex-row">
                <v-btn
                  icon
                  text
                  color="primary"
                  title="添加菜单项"
                  @click.stop="createMenu(each, 'item')"
                >
                  <v-icon>mdi-file-plus</v-icon>
                </v-btn>
                <v-btn
                  icon
                  text
                  color="primary"
                  title="添加子菜单"
                  @click.stop="createMenu(each, 'directory')"
                >
                  <v-icon>mdi-folder-plus</v-icon>
                </v-btn>
                <v-btn
                  icon
                  text
                  color="primary"
                  title="编辑菜单"
                  @click.stop="updateMenu(each)"
                >
                  <v-icon>mdi-folder-edit</v-icon>
                </v-btn>
                <Confirm
                  v-slot="{ on, attrs }"
                  :message="`确认删除菜单[${each.name}]吗`"
                  @confirm="deleteMenu(each)"
                >
                  <v-btn
                    icon
                    text
                    color="error"
                    title="删除菜单"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-folder-remove</v-icon>
                  </v-btn>
                </Confirm>
              </v-list-item-action>
            </template>

            <!--二级菜单-->
            <template v-for="eachSub of each.children">
              <v-list-item
                v-if="eachSub.type === 'item'"
                :key="eachSub.id"
                link
              >
                <v-list-item-icon v-if="eachSub.icon">
                  <v-icon>{{ eachSub.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ eachSub.name }}</v-list-item-title>
                <v-list-item-action class="flex-row">
                  <v-btn
                    icon
                    text
                    color="primary"
                    title="编辑菜单项"
                    @click.stop="updateMenu(eachSub)"
                  >
                    <v-icon>mdi-file-document-edit</v-icon>
                  </v-btn>
                  <Confirm
                    v-slot="{ on, attrs }"
                    :message="`确认删除菜单[${eachSub.name}]吗`"
                    @confirm="deleteMenu(eachSub)"
                  >
                    <v-btn
                      icon
                      text
                      color="error"
                      title="删除菜单项"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-file-remove</v-icon>
                    </v-btn>
                  </Confirm>
                </v-list-item-action>
              </v-list-item>
              <v-list-group
                v-else
                :key="eachSub.id"
                sub-group
              >
                <template v-slot:activator>
                  <v-list-item-icon v-if="eachSub.icon">
                    <v-icon>{{ eachSub.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ eachSub.name }}</v-list-item-title>
                  <v-list-item-action class="flex-row">
                    <v-btn
                      icon
                      text
                      color="primary"
                      title="添加菜单项"
                      @click.stop="createMenu(eachSub, 'item')"
                    >
                      <v-icon>mdi-file-plus</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      text
                      color="primary"
                      title="编辑菜单"
                      @click.stop="updateMenu(eachSub)"
                    >
                      <v-icon>mdi-folder-edit</v-icon>
                    </v-btn>
                    <Confirm
                      v-slot="{ on, attrs }"
                      :message="`确认删除菜单[${eachSub.name}]吗`"
                      @confirm="deleteMenu(eachSub)"
                    >
                      <v-btn
                        icon
                        text
                        color="error"
                        title="删除菜单"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-folder-remove</v-icon>
                      </v-btn>
                    </Confirm>
                  </v-list-item-action>
                </template>

                <!--三级菜单-->
                <v-list-item
                  v-for="eachSubSub of eachSub.children"
                  :key="eachSubSub.id"
                  link
                >
                  <v-list-item-icon v-if="eachSubSub.icon">
                    <v-icon>{{ eachSubSub.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ eachSubSub.name }}</v-list-item-title>
                  <v-list-item-action class="flex-row">
                    <v-btn
                      icon
                      text
                      color="primary"
                      title="编辑菜单项"
                      @click.stop="updateMenu(eachSubSub)"
                    >
                      <v-icon>mdi-file-document-edit</v-icon>
                    </v-btn>
                    <Confirm
                      v-slot="{ on, attrs }"
                      :message="`确认删除菜单[${eachSubSub.name}]吗`"
                      @confirm="deleteMenu(eachSubSub)"
                    >
                      <v-btn
                        icon
                        text
                        color="error"
                        title="删除菜单项"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-file-remove</v-icon>
                      </v-btn>
                    </Confirm>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list-group>
        </template>
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
                  label="名称"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="menuModel.icon"
                  label="icon"
                />
              </v-col>
              <v-col
                v-if="menuModel.type === 'item'"
                cols="12"
              >
                <v-text-field
                  v-model="menuModel.url"
                  label="url"
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
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import { CreateMenuDto, MenusService, UpdateMenuDto } from '@/service';

type test = 'directory' | 'item';

export default defineComponent({
  name: 'Menu',
  setup() {
    const menus = ref([]);
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const menuModel: Ref<CreateMenuDto | UpdateMenuDto> = ref({
      name: '',
      icon: '',
      url: '',
      type: 'directory',
    }) as Ref<CreateMenuDto | UpdateMenuDto>;

    async function refresh() {
      const { data } = await MenusService.getMenus();
      menus.value = data;
      dialogVisible.value = false;
    }

    onMounted(() => {
      refresh();
    });

    function createMenu(parent: { id: string }, type: 'directory' | 'item') {
      dialogTitle.value = `创建${type === 'directory' ? '菜单' : '菜单项'}`;
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
      dialogTitle.value = `编辑${type === 'directory' ? '菜单' : '菜单项'}`;
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

    return { menus, createMenu, updateMenu, deleteMenu, dialogVisible, dialogTitle, submit, menuModel };
  },
});
</script>

<style lang="less" scoped>
/** */
</style>
