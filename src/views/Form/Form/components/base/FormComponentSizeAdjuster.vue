<template>
  <div>
    <v-label>
      宽度 (%)
    </v-label>
    <v-btn-toggle
      mandatory
      :value="item.size"
    >
      <v-btn
        v-for="each of sizeList"
        :key="each"
        :value="each"
        @click="item.changeSize(each)"
      >
        {{
          Math.round((each / 12) * 100)
        }}
      </v-btn>
    </v-btn-toggle>
    <!-- </v-col> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponentModel } from './FormComponentModel';
import { sizeList } from './sizeList';

export default Vue.extend({
  name: 'FormComponentSizeAdjuster',
  components: {},
  props: {
    item: {
      type: FormComponentModel,
      required: true,
    },
  },
  data() {
    return {
      sizeList,
    };
  },
});
</script>
