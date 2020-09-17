<template>
  <ValidationProvider
    ref="validator"
    v-slot="{ errors, valid }"
    name="value"
    rules="decimal"
  >
    <v-text-field
      :value="item.value"
      :placeholder="item.placeholder"
      dense
      :error-messages="errors"
      :success="valid"
      @input="onValueChange"
    />
  </ValidationProvider>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from '@vue/composition-api';

import { NumberInputModel } from './NumberInputModel';

export default defineComponent({
  name: 'NumberInputCore',
  props: {
    item: {
      type: NumberInputModel,
      required: true,
    },
  },
  setup(props) {
    const validator = ref(null);

    function onValueChange(value: string) {
      props.item.value = (value as unknown) as number;
      nextTick(async () => {
        const validateResult = await (validator.value as any).validate();
        if (!validateResult.valid) {
          return;
        }
        props.item.value = parseFloat(value) || undefined;
      });
    }

    return { onValueChange, validator };
  },
});
</script>
