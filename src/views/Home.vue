<template>
  <div class="home">
    <Introduction />
    <v-footer app>
      <v-spacer />
      <a href="https://beian.miit.gov.cn/">
        蜀ICP备20016613号-1
      </a>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Introduction from '@/components/Introduction.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Introduction,
  },
});
</script>
