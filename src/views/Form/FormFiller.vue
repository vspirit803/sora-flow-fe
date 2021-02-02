<template>
  <div class="form-designer d-flex">
    <v-card
      v-if="!form"
      class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2"
    >
      <v-skeleton-loader
        :loading="true"
        type="article"
      />
    </v-card>
    <v-card
      v-else
      class="form-card flex-grow-1 flex-shrink-1 purple lighten-1 pa-2 form-preview"
    >
      <v-btn @click="onSubmit">
        {{ t('submit') }}
      </v-btn>
      <div
        v-for="eachRow of form.rows"
        :key="eachRow.id"
      >
        <v-container class="pa-0">
          <v-row class="ma-0 easy-form-row">
            <v-col
              v-for="eachItem of eachRow.components"
              :key="eachItem.id"
              class="component pa-0"
              :cols="eachItem.size"
            >
              <div
                :is="eachItem.type"
                :key="eachItem.id"
                :item="eachItem"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import { ApplicationRecordsService, ApplicationsService } from '@/service';
import { useRouter } from '@/use';

import { Form, FormComponentModel } from './Form';

export default defineComponent({
  name: 'FormFiller',
  props: { id: { type: String, required: true } },
  setup(props) {
    const form: Ref<Form | undefined> = ref();
    const selectedItem: Ref<FormComponentModel | null> = ref(null);
    provide('selectedItem', selectedItem);
    const formStatus = ref('filling');
    provide('formStatus', formStatus);

    const appId = props.id;
    ApplicationsService.getApplication(appId).then(({ data }) => {
      form.value = new Form(data.formModel);
    });

    async function onSubmit() {
      const data = form.value!.valueData;
      await ApplicationRecordsService.createApplicationRecord(appId, { data });
      useRouter().back();
    }

    return {
      formStatus,
      form,
      onSubmit,
      ...useI18n(),
    };
  },
});
</script>

<style lang="less" scoped>
.components-container-card {
  width: 300px;

  .components-container {
    width: 300px;
    position: fixed;

    .components {
      width: 100%;
      .component {
        user-select: none;
      }
    }
  }
}

.component-detail-card {
  width: 340px;

  .component-detail {
    width: 340px;
    position: fixed;
    max-height: calc(100vh - 64px - 8px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.form-card {
  /**给一个较小的宽度,利用flex-grow自动撑大 */
  width: 200px;

  .easy-form-row {
    width: 100%;
    display: flex;
    background-color: aliceblue;
    cursor: move !important;
    margin: 10px 0px;
    padding: 5px;

    .component {
      border: 1px dashed blue;
    }

    .component-selected {
      background: turquoise;
    }
  }

  &.form-preview {
    .easy-form-row {
      margin: 0;
      padding: 0;
      cursor: unset !important;

      .component {
        border-style: solid;
      }

      .component-selected {
        background: unset;
      }
    }
  }
}
</style>
