import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { email, integer, max, required } from 'vee-validate/dist/rules';
import Vue from 'vue';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('required', {
  ...required,
  message: 'This field is required',
});

extend('max', {
  ...max,
  message: 'This field must be {length} characters or less',
});

extend('email', {
  ...email,
  message: 'This field must be a valid email',
});

extend('integer', integer);
extend('decimal', {
  validate: (value, { decimals = '*', separator = '.' }: Record<string, any> = {}) => {
    if (value === null || value === undefined || value === '') {
      return {
        valid: false,
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

    return {
      valid: regex.test(value),
    };
  },
  message: 'The {_field_} field must contain only decimal values',
});
