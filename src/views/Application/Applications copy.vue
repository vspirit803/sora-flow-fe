<template>
  <div class="applications">
    <v-container>
      <v-row>
        <v-col
          v-for="application of applications"
          :key="application.id"
          :cols="3"
        >
          <v-card>
            <v-card-title>{{ application.name }}</v-card-title>
            <v-card-subtitle>{{ application.status }}</v-card-subtitle>
            <v-card-actions>
              <v-spacer />
              
              <Confirm
                v-slot="{ on, attrs }"
                :message="`确认删除应用[${application.name}]吗`"
              >
                <IconButton
                  class="ml-2"
                  color="error"
                  v-bind="attrs"
                  title="删除应用"
                  v-on="on"
                >
                  <v-icon>mdi-delete</v-icon>
                </IconButton>
              </Confirm>
              <IconButton
                color="primary"
                title="查看详情"
                @click="onShowDetails(application)"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </IconButton>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';

import { Application, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

export default defineComponent({
  name: 'Applications',
  setup() {
    const applications: Ref<Array<Application>> = ref([]);

    onMounted(async () => {
      const { data } = await ApplicationsService.getApplications();
      applications.value = data;
    });

    function onShowDetails(application: Application) {
      useRouter().push({ name: 'Application', params: { id: application.id } });
    }
    return { applications, onShowDetails };
  },
});
</script>
