<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <Menu />
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn to="/">Home</v-btn>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <vue-custom-scrollbar>
        <keep-alive> <router-view></router-view> </keep-alive>
      </vue-custom-scrollbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

import { provideStore } from '@/use';
import Menu from '@/views/Menu.vue';
export default defineComponent({
  name: 'App',
  components: { Menu },
  setup() {
    provideStore();
    return { drawer: ref(false) };
  },
});
</script>
