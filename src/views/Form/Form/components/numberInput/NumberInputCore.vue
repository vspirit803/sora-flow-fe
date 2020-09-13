<template>
  <ValidationProvider
    v-slot="{ errors, valid }"
    name="value"
    rules="decimal"
  >
    <v-text-field
      v-model="item.value"
      :placeholder="item.placeholder"
      dense
      :error-messages="errors"
      :success="valid"
    />
  </ValidationProvider>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { NumberInputModel } from './NumberInputModel';

export default defineComponent({
  name: 'NumberInputCore',
  props: {
    item: {
      type: NumberInputModel,
      required: true,
    },
  },
});
</script>
