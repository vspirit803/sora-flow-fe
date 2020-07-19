<template>
  <v-textarea
    :placeholder="item.placeholder"
    :value="item.default"
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
