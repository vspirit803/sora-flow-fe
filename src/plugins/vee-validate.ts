import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { email, max, required } from 'vee-validate/dist/rules';
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
