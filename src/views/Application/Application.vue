<template>
  <v-card
    outlined
    class="application-detail flex-grow-1 ml-2"
  >
    <v-skeleton-loader
      v-if="!application"
      loading
      type="article"
      class="mx-2"
    />
    <template v-else>
      <v-card-title>
        <v-chip v-if="!editName">
          {{ applicationName }}
          <v-btn
            v-if="application.status === 'Designing'"
            class="ml-2"
            color="primary"
            title="编辑表单名称"
            icon
            @click="editName = true"
          >
            <v-icon>
              mdi-square-edit-outline
            </v-icon>
          </v-btn>
        </v-chip>
        <div
          v-else
          style="width: 200px;"
        >
          <v-text-field
            v-model="applicationName"
            hide-details
            dense
            label="应用名称"
            append-icon="mdi-check-circle"
            @click:append="onSubmitApplicationName"
          />
        </div>
        <v-btn
          class="ml-2"
          color="primary"
          title="编辑表单模型"
          icon
          :to="{ name: 'FormDesigner', params: { id } }"
        >
          <v-icon>
            mdi-wrench
          </v-icon>
        </v-btn>
        <v-btn
          class="ml-2"
          color="primary"
          title="填写表单"
          icon
          :to="{ name: 'FormFiller', params: { id } }"
        >
          <v-icon>
            mdi-pencil-plus
          </v-icon>
        </v-btn>

        <!-- 选项卡 -->
        <v-tabs
          v-model="tab"
          class="ml-8"
          :height="36"
          style="width: unset;"
        >
          <v-tab href="#overview">
            概览
          </v-tab>
          <v-tab href="#all">
            所有数据
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tab">
        <v-tab-item value="overview">
          <v-card flat>
            <v-card-text>概览 未完成</v-card-text>
            {{ application.status === 'Designing' ? '设计中' : '已发布' }}
          </v-card>
        </v-tab-item>
        <v-tab-item value="all">
          <ApplicationRecords :id="id" />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import { ApplicationsService, ApplicationVo } from '@/service';
import { useRouter } from '@/use';

import ApplicationRecords from './ApplicationRecords.vue';

const router = useRouter();
export default defineComponent({
  name: 'Application',
  props: { id: { type: String, required: true } },
  components: { ApplicationRecords },
  beforeRouteUpdate(to, from, next) {
    this.onRouteUpdate(to.params.id);
    next();
  },
  emits: ['onApplicationChanged'],
  setup(props, context) {
    const application: Ref<ApplicationVo | undefined> = ref();
    const editName = ref(false);
    const applicationName = ref('');
    const tab = ref('overview');

    onMounted(() => {
      onRouteUpdate(props.id);
    });

    async function onRouteUpdate(id: string) {
      application.value = undefined;
      tab.value = 'overview';
      try {
        const { data } = await ApplicationsService.getApplication(id);
        application.value = data;
        applicationName.value = data.name;
      } catch {
        router.push({ name: 'NoApplication' });
      }
    }

    async function onSubmitApplicationName() {
      if (application.value!.name === applicationName.value) {
        editName.value = false;
        return;
      }
      await ApplicationsService.updateApplication({ id: props.id, name: applicationName.value });
      application.value!.name = applicationName.value;
      context.emit('onApplicationChanged');
      editName.value = false;
    }

    return {
      application,
      onSubmitApplicationName,
      tab,
      editName,
      applicationName,
      onRouteUpdate,
    };
  },
});
</script>
<style lang="less" scoped>
</style>