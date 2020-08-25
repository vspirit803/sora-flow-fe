<template>
  <v-text-field
    v-model="item.value"
    :placeholder="item.placeholder"
    dense
  />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { SingleLineInputModel } from './SingleLineInputModel';

export default defineComponent({
  name: 'SingleLineInputCore',
  props: {
    item: {
      type: SingleLineInputModel,
      required: true,
    },
  },
});
</script>
