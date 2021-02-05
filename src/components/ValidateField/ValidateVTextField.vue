<template>
  <ValidationProvider
    v-slot="{ errors, valid }"
    :name="attrs.name || attrs.label"
    :rules="rules"
  >
    <v-text-field
      v-model="innerValue"
      :error-messages="errors"
      :success="valid"
      v-bind="attrs"
      v-on="listeners"
    />
  </ValidationProvider>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { ValidationProvider } from 'vee-validate';

export default defineComponent({
  name: 'ValidateVTextField',
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [Object, String],
      default: '',
    },
    value: {
      type: null,
      required: true,
    },
  },
  setup(props, { emit, attrs, listeners }) {
    const innerValue = ref(props.value);

    watch(innerValue, (newVal) => {
      emit('input', newVal);
    });

    watch(
      computed(() => props.value),
      (newVal) => {
        innerValue.value = newVal;
      },
    );

    return { innerValue, attrs, listeners };
  },
});
</script>
