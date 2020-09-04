<template>
  <div class="flex-grow-1 ml-2">
    <v-container style="height: 100%;">
      <v-row
        justify="space-around"
        align="center"
        style="height: 100%;"
      >
        <v-col>
          <v-sheet class="text-center">
            请选择应用
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({ name: 'NoApplication' });
</script>