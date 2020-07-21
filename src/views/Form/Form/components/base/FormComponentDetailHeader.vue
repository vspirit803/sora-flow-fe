<!--表单详情的头-->
<template>
  <div class="text-h6 font-weight-bold ml-4 detail-header">
    <template v-if="isTableField">
      <v-btn
        icon
        @click="onBack"
      >
        <v-icon>mdi-chevron-left-box</v-icon>
      </v-btn>
      <span>表格. </span>
    </template>
    <span>{{ title }}</span>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FormComponentDetailHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    isTableField: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onBack() {
      if (this.isTableField) {
        this.$emit('back');
      }
    },
  },
});
</script>
<style lang="less" scoped>
.detail-header {
  height: 36px;
}
</style>