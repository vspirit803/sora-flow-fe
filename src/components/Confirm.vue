<template>
  <v-menu
    v-model="visible"
    :close-on-content-click="false"
  >
    <template #activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }" />
    </template>

    <v-card>
      <v-card-subtitle> {{ message }}</v-card-subtitle>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          x-small
          @click="cancel"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          x-small
          @click="confirm"
        >
          {{ t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

export default defineComponent({
  name: 'Confirm',
  props: { message: { type: String, default: '' } },
  setup(props, context) {
    const visible = ref(false);

    function cancel() {
      visible.value = false;
      context.emit('cancel');
    }

    function confirm() {
      visible.value = false;
      context.emit('confirm');
    }
    return { cancel, confirm, visible, ...useI18n() };
  },
});
</script>
