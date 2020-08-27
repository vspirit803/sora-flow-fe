<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <v-footer app>
      <v-spacer />
      <div>蜀ICP备20016613号-1</div>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import HelloWorld from '@/components/HelloWorld.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
});
</script>
