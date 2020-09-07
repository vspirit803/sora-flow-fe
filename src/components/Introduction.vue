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
          <span
            v-for="(tech, i) in technologyStack.frontEnd"
            :key="i"
            class="subheading mx-3"
          >
            {{ tech }}
          </span>
        </v-row>
        <v-row justify="center">
          <span
            v-for="(tech, i) in technologyStack.backEnd"
            :key="i"
            class="subheading mx-3"
          >
            {{ tech }}
          </span>
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
      frontEnd: ['Vuejs', 'Vue Composition Api', 'Vue Router', 'Vuex', 'Vuetify'],
      backEnd: ['Node.js', 'NestJS', 'MongoDB'],
    },
    next: ['表单表格字段展示', '各处表格增加筛选', '表单选项增加动态获取', '增加流程相关功能'],
  }),
});
</script>
