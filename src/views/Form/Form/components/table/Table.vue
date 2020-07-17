<template>
  <FormComponent
    :item="item"
    @remove="remove"
  >
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.calories="{ item }">
        <v-chip
          :color="getColor(item.calories)"
          dark
        >
          {{ item.calories }}
        </v-chip>
      </template>
    </v-data-table>
  </FormComponent>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { FormComponent } from '../base/';
import { TableModel } from './TableModel';

export default defineComponent({
  name: 'Table',
  components: { FormComponent },
  props: {
    item: {
      type: TableModel,
      required: true,
    },
  },
  setup(props, context) {
    const item = props.item;
    const headers = [
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
    ];
    const items: Array<any> = [];
    function remove() {
      context.emit('remove', item);
    }

    return { remove, headers, items };
  },
});
</script>
