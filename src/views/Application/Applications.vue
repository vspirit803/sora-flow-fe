<template>
  <div class="applications d-flex ma-4">
    <v-card
      outlined
      class="application-list-card flex-grow-0"
    >
      <v-card-title class="d-flex justify-space-between">
        <span>应用列表</span>
        <v-btn
          color="primary"
          icon
        >
          <v-icon>
            mdi-layers-plus
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-list class="py-2 application-list">
        <v-list-item-group
          v-model="applicationId"
          color="primary"
        >
          <v-list-item
            v-for="application of applications"
            :key="application.id"
            :value="application.id"
            link
          >
            <v-list-item-content>
              <v-list-item-title v-text="application.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <router-view
      @onApplicationChanged="refreshApplicationList"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api';

import { Application, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

export default defineComponent({
  name: 'Applications',
  setup() {
    const applications: Ref<Array<Application>> = ref([]);
    const applicationId: Ref<string | undefined> = ref();
    onMounted(() => {
      refreshApplicationList();
    });

    async function refreshApplicationList() {
      const { data } = await ApplicationsService.getApplications();
      applications.value = data;
    }

    watch(applicationId, async () => {
      if (applicationId.value) {
        useRouter().push({ name: 'Application', params: { id: applicationId.value } });
      }
    });

    return {
      applications,
      applicationId,
      refreshApplicationList,
    };
  },
});
</script>

<style lang="less" scoped>
.applications {
  height: calc(100vh - 64px - 32px);

  .application-list-card {
    width: 280px;

    .application-list {
      height: calc(100% - 68px);
      overflow: auto;
    }
  }
}
</style>
