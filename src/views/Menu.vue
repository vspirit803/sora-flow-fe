<template>
  <v-list expand>
    <!--一级菜单-->
    <template v-for="each of menus">
      <v-list-item
        v-if="each.type === 'item'"
        :key="each.id"
        link
        :to="each.url"
        @click="onSelect(each)"
      >
        <v-list-item-icon v-if="each.icon">
          <v-icon>{{ each.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ each.name }}</v-list-item-title>
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
        </template>

        <!--二级菜单-->
        <template v-for="eachSub of each.children">
          <v-list-item
            v-if="eachSub.type === 'item'"
            :key="eachSub.id"
            link
            :to="eachSub.url"
            @click="onSelect(eachSub)"
          >
            <v-list-item-icon v-if="eachSub.icon">
              <v-icon>{{ eachSub.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ eachSub.name }}</v-list-item-title>
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
            </template>

            <!--三级菜单-->
            <v-list-item
              v-for="eachSubSub of eachSub.children"
              :key="eachSubSub.id"
              :input-value="eachSubSub.name === currMenu"
              link
              :to="eachSubSub.url"
              @click="onSelect(eachSubSub)"
            >
              <v-list-item-icon v-if="eachSubSub.icon">
                <v-icon>{{ eachSubSub.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ eachSubSub.name }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list-group>
    </template>
  </v-list>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';

import { useStore } from '@/use';

export default defineComponent({
  name: 'Menu',
  setup() {
    const store = useStore();
    const menus = computed(() => store.state.menus);
    const currMenu = ref('');

    function onSelect(item: { id: string; name: string }) {
      currMenu.value = item.name;
    }
    return { menus, currMenu, onSelect };
  },
});
</script>

<style lang="less" scoped>
/** */
</style>
