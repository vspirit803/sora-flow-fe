<template>
  <div class="login">
    <v-row
      justify="center"
      class="ma-0"
    >
      <v-col
        :lg="3"
        :md="6"
        :sm="12"
      >
        <ValidationObserver
          ref="obs"
          v-slot="{ invalid, validated, passes }"
        >
          <v-form
            class="login-form"
            @keyup.enter.native="passes(submit)"
          >
            <ValidateVTextField
              v-model="name"
              name="name"
              :label="t('account.username')"
              rules="required"
            />
            <ValidateVTextField
              v-model="password"
              name="password"
              type="password"
              :label="t('account.password')"
              rules="required"
            />
          </v-form>
          <v-btn
            color="primary"
            :disabled="invalid || !validated"
            @click="submit"
          >
            {{ t('login') }}
          </v-btn>
        </ValidationObserver>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import ValidateVTextField from '@/components/ValidateField/ValidateVTextField.vue';
import { useRouter, useStore } from '@/use';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};

export default defineComponent({
  name: 'Login',
  components: { ValidateVTextField },
  setup() {
    const store = useStore();
    const name = ref('');
    const password = ref('');
    const router = useRouter();
    const obs: Ref<Obs> = ref() as Ref<Obs>;

    const organizations = computed(() => {
      return store.state.organizations;
    });

    async function selectOrganization({ id }: { id: string; name: string }) {
      await store.dispatch('authOrganization', { id });
      if (router.currentRoute.name !== 'Tasks') {
        router.push({ name: 'Tasks' });
      }
    }

    async function submit() {
      await store.dispatch('auth', { name: name.value, password: password.value });

      const organizations = store.state.organizations;
      if (organizations.length === 0) {
        console.log('没有组织');
      } /*if (organizations.length === 1) */ else {
        await selectOrganization(organizations[0]);
      }
    }

    return { submit, name, password, organizations, selectOrganization, obs, ...useI18n() };
  },
});
</script>

<style lang="less" scoped>
.login-form {
  margin-top: calc(50vh - 200px);
}
</style>
