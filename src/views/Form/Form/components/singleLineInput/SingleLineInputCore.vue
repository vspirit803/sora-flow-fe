<template>
  <v-text-field
    :placeholder="item.placeholder"
    :value="item.default"
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
