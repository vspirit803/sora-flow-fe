<template>
  <div class="login">
    <v-row justify="center" class="ma-0">
      <v-col :lg="3" :md="6" :sm="12">
        <v-form class="login-form">
          <v-text-field v-model="name" label="账号" required></v-text-field>
          <v-text-field v-model="password" type="password" label="密码" required></v-text-field>
          <v-btn class="mr-4" @click="submit">登录</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';

import { useRouter, useStore } from '@/use';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const name = ref('');
    const password = ref('');
    const router = useRouter();

    const organizations = computed(() => {
      return store.state.organizations;
    });

    async function selectOrganization({ id }: { id: string; name: string }) {
      store.dispatch('authOrganization', { id });
    }

    async function submit() {
      await store.dispatch('auth', { name: name.value, password: password.value });

      const organizations = store.state.organizations;
      if (organizations.length === 0) {
        console.log('没有组织');
      } /*if (organizations.length === 1) */ else {
        await selectOrganization(organizations[0]);
        router.push({ name: 'Home' });
      }
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
