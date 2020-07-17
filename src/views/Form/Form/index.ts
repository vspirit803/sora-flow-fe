import Vue from 'vue';

import {
  Description,
  DescriptionDetail,
  FormComponentPropsCard,
  FormComponentSizeAdjuster,
  MultiplyLineInput,
  MultiplyLineInputDetail,
  MultiplySelect,
  MultiplySelectDetail,
  SingleLineInput,
  SingleLineInputDetail,
  SingleSelect,
  SingleSelectDetail,
} from './components';

Vue.component('FormComponentSizeAdjuster', FormComponentSizeAdjuster);
Vue.component('FormComponentPropsCard', FormComponentPropsCard);

Vue.component('MultiplyLineInput', MultiplyLineInput);
Vue.component('MultiplyLineInputDetail', MultiplyLineInputDetail);

Vue.component('SingleLineInput', SingleLineInput);
Vue.component('SingleLineInputDetail', SingleLineInputDetail);

Vue.component('SingleSelect', SingleSelect);
Vue.component('SingleSelectDetail', SingleSelectDetail);

Vue.component('MultiplySelect', MultiplySelect);
Vue.component('MultiplySelectDetail', MultiplySelectDetail);

Vue.component('Description', Description);
Vue.component('DescriptionDetail', DescriptionDetail);
