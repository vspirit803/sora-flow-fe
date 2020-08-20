<template>
  <v-card
    outlined
    class="application-detail flex-grow-1 ml-2"
  >
    <v-skeleton-loader
      :loading="!application"
      type="article"
      class="application-detail flex-grow-1 ml-2"
    >
      <v-card-title>
        <v-chip
          v-if="!editName"
        >
          {{ applicationName }}
          <v-btn
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
        >
          <v-icon>
            mdi-wrench
          </v-icon>
        </v-btn>

        <!-- 选项卡 -->
        <v-tabs
          v-model="tab"
          class="ml-8"
          :height="36"
          style="width: unset;"
        >
          <v-tab
            href="#tab-overview"
          >
            概览 
          </v-tab>
          <v-tab
            href="#所有数据"
          >
            所有数据 
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tab">
        <v-tab-item
          value="tab-overview"
        >
          <v-card flat>
            <v-card-text>概览 未完成</v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
          value="所有数据"
        >
          <v-card flat>
            <v-card-text>所有数据 未完成</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-skeleton-loader>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import { Application, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

const router = useRouter();
export default defineComponent({
  name: 'Application',
  props: { id: { type: String, required: true } },
  beforeRouteUpdate(to, from, next) {
    this.onRouteUpdate(to.params.id);
    next();
  },
  setup(props, context) {
    const application: Ref<Application | undefined> = ref(undefined);
    const editName = ref(false);
    const applicationName = ref('');
    onMounted(() => {
      onRouteUpdate(props.id);
    });

    async function onRouteUpdate(id: string) {
      application.value = undefined;
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

    return { application, onSubmitApplicationName, tab: ref(''), editName, applicationName, onRouteUpdate };
  },
});
</script>
