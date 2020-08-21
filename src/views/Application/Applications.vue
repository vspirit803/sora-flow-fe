<template>
  <div class="applications d-flex ma-4">
    <v-card
      outlined
      class="application-list-card flex-grow-0"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>应用列表</span>
        <v-dialog
          v-model="dialogVisible"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              title="添加应用"
              v-bind="attrs"
              v-on="on"
              @click="onCreateApplication"
            >
              <v-icon>mdi-layers-plus</v-icon>
            </v-btn>
          </template>
          <ValidationObserver
            ref="obs"
            v-slot="{ invalid, validated, passes }"
          >
            <v-card>
              <v-card-title class="headline grey lighten-2">
                新增应用
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        name="name"
                        rules="required"
                      >
                        <v-text-field
                          v-model="applicationModel.name"
                          label="名称"
                          :error-messages="errors"
                          :success="valid"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider />
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
                  @click="passes(submitCreateApplication)"
                >
                  提交
                </v-btn>
              </v-card-actions>
            </v-card>
          </ValidationObserver>
        </v-dialog>
      </v-card-title>
      <v-skeleton-loader
        :loading="isPending"
        type="list-item@3"
        class="py-2 application-list"
      >
        <v-list class="py-2 application-list">
          <v-list-item-group color="primary">
            <v-hover
              v-for="application of applications"
              v-slot:default="{ hover }"
              :key="application.id"
            >
              <v-list-item
                link
                :to="{ name: 'Application', params: { id: application.id } }"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="application.name" />
                </v-list-item-content>
                <v-list-item-action
                  v-show="hover"
                  class="ma-0"
                >
                  <Confirm
                    v-slot="{ on, attrs }"
                    :message="`确认删除应用[${application.name}]吗`"
                    @confirm="onDeleteApplication(application)"
                  >
                    <v-btn
                      class="ml-2"
                      color="error"
                      v-bind="attrs"
                      icon
                      v-on="on"
                      @click.prevent=""
                    >
                      <v-icon>mdi-layers-remove</v-icon>
                    </v-btn>
                  </Confirm>
                </v-list-item-action>
              </v-list-item>
            </v-hover>
          </v-list-item-group>
        </v-list>
      </v-skeleton-loader>
    </v-card>
    <router-view @onApplicationChanged="refreshApplicationList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, Ref, ref } from '@vue/composition-api';

import { Application, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

type Obs = {
  reset: () => void;
  validate: () => Promise<boolean>;
};
export default defineComponent({
  name: 'Applications',
  setup() {
    const obs: Ref<Obs> = ref() as Ref<Obs>;
    const router = useRouter();
    const applications: Ref<Array<Application>> = ref([]);
    const dialogVisible = ref(false);
    const applicationModel = ref({ name: '' });
    const isPending = ref(true);
    onMounted(async () => {
      //关闭抽屉
      const drawer = inject('drawer') as Ref<boolean>;
      drawer.value = false;
      await refreshApplicationList();
      if (applications.value.length && !router.currentRoute.params.id) {
        router.push({ name: 'Application', params: { id: applications.value[0].id } });
      }
    });

    async function refreshApplicationList() {
      isPending.value = true;
      const { data } = await ApplicationsService.getApplications();
      applications.value = data;
      isPending.value = false;
    }

    async function submitCreateApplication() {
      await ApplicationsService.createApplication(applicationModel.value);
      dialogVisible.value = false;
      refreshApplicationList();
    }

    function onCreateApplication() {
      applicationModel.value.name = '';
      obs.value?.reset();
    }

    async function onDeleteApplication(application: Application) {
      await ApplicationsService.deleteApplication(application);
      if (router.currentRoute.params.id === application.id) {
        router.push({ name: 'NoApplication' });
      }
      refreshApplicationList();
    }

    return {
      obs,
      applications,
      refreshApplicationList,
      dialogVisible,
      onCreateApplication,
      submitCreateApplication,
      applicationModel,
      onDeleteApplication,
      isPending,
    };
  },
});
</script>

<style lang="less" scoped>
.applications {
  height: calc(100vh - 64px - 32px);

  .application-list-card {
    width: 240px;

    .application-list {
      height: calc(100% - 68px);
      overflow: auto;
    }
  }
}
</style>
