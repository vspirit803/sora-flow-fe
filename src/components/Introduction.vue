<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4 mt-16">
        <h1 class="display-2 font-weight-bold mb-3">
          Sora Flow
        </h1>
        <p class="subheading font-weight-regular">
          一个无代码表单设计器 + 流程管理的应用
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          技术栈
        </h2>
        <v-row
          justify="center"
          class="mb-3"
        >
          <a
            v-for="(tech, i) in technologyStack.frontEnd"
            :key="i"
            class="subheading mx-3"
            :href="tech.link"
            target="blank"
          >
            {{ tech.name }}
          </a>
        </v-row>
        <v-row justify="center">
          <a
            v-for="(tech, i) in technologyStack.backEnd"
            :key="i"
            class="subheading mx-3"
            :href="tech.link"
            target="blank"
          >
            {{ tech.name }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          接下来
        </h2>

        <v-row justify="center">
          <v-timeline dense>
            <v-timeline-item
              v-for="each of next"
              :key="each"
            >
              {{ each }}
            </v-timeline-item>
          </v-timeline>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Introduction',
  data: () => ({
    technologyStack: {
      frontEnd: [
        { name: 'Vuejs', link: 'https://github.com/vuejs/vue' },
        { name: 'Vue Composition Api', link: 'https://github.com/vuejs/composition-api' },
        { name: 'Vue Router', link: 'https://github.com/vuejs/vue-router' },
        { name: 'Vuex', link: 'https://github.com/vuejs/vuex' },
        { name: 'vue-i18n', link: 'https://github.com/kazupon/vue-i18n' },
      ],
      backEnd: [
        { name: 'Node.js', link: 'https://nodejs.org/' },
        { name: 'NestJS', link: 'https://github.com/nestjs/nest' },
        { name: 'MongoDB', link: 'https://www.mongodb.com/' },
      ],
    },
    next: ['本地化', '各处表格增加筛选', '表单选项增加动态获取', '增加流程相关功能'],
  }),
});
</script>
