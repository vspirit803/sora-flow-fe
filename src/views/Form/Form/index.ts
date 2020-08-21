import { VueConstructor } from 'vue/types/umd';

import {
  Description,
  DescriptionDetail,
  FormComponentDetailHeader,
  FormComponentLayout,
  FormComponentPropsCard,
  FormComponentSizeAdjuster,
  MultiplyLineInput,
  MultiplyLineInputCore,
  MultiplyLineInputDetail,
  MultiplySelect,
  MultiplySelectCore,
  MultiplySelectDetail,
  SingleLineInput,
  SingleLineInputCore,
  SingleLineInputDetail,
  SingleSelect,
  SingleSelectCore,
  SingleSelectDetail,
  Table,
  TableDetail,
} from './components';

export * from './components';
export * from './Form';
export * from './FormRow';

export default {
  install(Vue: VueConstructor): void {
    Vue.component('FormComponentLayout', FormComponentLayout);
    Vue.component('FormComponentSizeAdjuster', FormComponentSizeAdjuster);
    Vue.component('FormComponentPropsCard', FormComponentPropsCard);
    Vue.component('FormComponentDetailHeader', FormComponentDetailHeader);

    Vue.component('MultiplyLineInput', MultiplyLineInput);
    Vue.component('MultiplyLineInputCore', MultiplyLineInputCore);
    Vue.component('MultiplyLineInputDetail', MultiplyLineInputDetail);

    Vue.component('SingleLineInput', SingleLineInput);
    Vue.component('SingleLineInputCore', SingleLineInputCore);
    Vue.component('SingleLineInputDetail', SingleLineInputDetail);

    Vue.component('SingleSelect', SingleSelect);
    Vue.component('SingleSelectCore', SingleSelectCore);
    Vue.component('SingleSelectDetail', SingleSelectDetail);

    Vue.component('MultiplySelect', MultiplySelect);
    Vue.component('MultiplySelectCore', MultiplySelectCore);
    Vue.component('MultiplySelectDetail', MultiplySelectDetail);

    Vue.component('Description', Description);
    Vue.component('DescriptionDetail', DescriptionDetail);

    Vue.component('Table', Table);
    Vue.component('TableDetail', TableDetail);
  },
};
