<template>
  <div class="login">
    <v-row justify="center">
      <v-col :lg="3" :md="6" :sm="12">
        <v-form v-if="organizations.length === 0" ref="form" class="login-form">
          <v-text-field v-model="name" label="账号" required></v-text-field>
          <v-text-field v-model="password" type="password" label="密码" required></v-text-field>

          <v-btn class="mr-4" @click="submit">登录</v-btn>
        </v-form>
        <v-list v-else>
          <v-list-item-group>
            <v-list-item v-for="each of organizations" :key="each.id" @click="() => selectOrganization(each)">
              <v-list-item-content>
                <v-list-item-title v-text="each.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import axios from 'axios';

import { AuthService, ProfileService } from '@/service';

import { useStore } from '../use';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const name = ref('');
    const password = ref('');

    const organizations = computed(() => {
      return store.state.organizations;
    });

    async function submit() {
      const {
        data: { access_token: token },
      } = await AuthService.login({ name: name.value, password: password.value });
      store.commit('setToken', token);

      const { data: organizations } = await ProfileService.getOrganizations();
      store.commit('setOrganizations', organizations);
    }

    async function selectOrganization({ id }: { id: string; name: string }) {
      const {
        data: { access_token: token },
      } = await AuthService.loginOrganization({ organizationId: id });
      store.commit('setToken', token);

      const { data } = await axios.get('profile/organization');
      console.log(data);
    }

    return { submit, name, password, organizations, selectOrganization };
  },
});
</script>

<style lang="less" scoped>
.login-form {
  margin-top: calc(50vh - 200px);
}
</style>