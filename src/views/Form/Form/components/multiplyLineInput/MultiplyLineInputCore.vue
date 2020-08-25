<template>
  <v-textarea
    v-model="item.value"
    :placeholder="item.placeholder"
    outlined
    dense
    :rows="item.rowNumber"
  />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { MultiplyLineInputModel } from './MultiplyLineInputModel';

export default defineComponent({
  name: 'MultiplyLineInputCore',
  props: {
    item: {
      type: MultiplyLineInputModel,
      required: true,
    },
  },
});
</script>
