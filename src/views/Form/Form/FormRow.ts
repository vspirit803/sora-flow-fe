import { FormComponentModel } from './components/base';
import { Form } from './Form';

export class FormRow {
  components: Array<FormComponentModel>;
  _form?: Form;
  constructor() {
    this.components = [];
  }

  get data() {
    return this.components.map((each) => each.data);
  }

  resize() {
    const totalSize = this.components.map((each) => each.size).reduce((prev, curr) => prev + curr);
    if (totalSize <= 12) {
      return;
    }
    let currTotalSize = 0;
    let i = 0;
    while (i < this.components.length && currTotalSize + this.components[i].size <= 12) {
      currTotalSize += this.components[i].size;
      i++;
    }
    const newRow = new FormRow();
    const componentsToMove = this.components.filter((value, index) => index >= i);
    this.form.addRow(newRow, this);
    componentsToMove.forEach((each) => {
      this.removeComponent(each);
      newRow.addComponent(each, undefined, true);
    });
  }

  /**
   * @param component 要添加的组件
   * @param reference 要添加哪个组件后面
   * @param keepSize 是否保留尺寸,保留则将超出的组件"挤"到下一行,否则平均分配尺寸
   */
  addComponent(component: FormComponentModel, reference?: FormComponentModel, keepSize?: boolean): void;
  /**
   * @param component 要添加的组件
   * @param reference 要添加到的index位置
   * @param keepSize 是否保留尺寸,保留则将超出的组件"挤"到下一行,否则平均分配尺寸
   */
  addComponent(component: FormComponentModel, reference?: number, keepSize?: boolean): void;
  addComponent(component: FormComponentModel, reference?: FormComponentModel | number, keepSize = false) {
    if (!this.canAddComponent) {
      throw new Error('一行最多只能有4个组件');
    }
    let index = this.components.length;
    if (reference !== undefined) {
      if (typeof reference === 'number') {
        index = reference - 1;
      } else {
        index = this.components.indexOf(reference);
      }
    }

    this.components.splice(index + 1, 0, component);
    component.row = this;

    if (this.components.reduce((prev, curr) => prev + curr.size, 0) > 12) {
      if (keepSize) {
        this.resize();
      } else {
        this.components.forEach((eachComponent) => {
          eachComponent.setSize(Math.floor(12 / this.components.length));
        });
      }
    }
  }

  removeComponent(component: FormComponentModel) {
    if (!this.components.includes(component) || component.row !== this) {
      throw new Error('无法移除不在此行的组件');
    }
    const index = this.components.indexOf(component);
    this.components.splice(index, 1);
    if (!this.components.length) {
      this.form.removeRow(this);
      this._form = undefined;
    }
  }

  get canAddComponent(): boolean {
    return this.components.length < 4;
  }

  get prevRow(): FormRow | undefined {
    return this.form.getPrevRow(this);
  }

  get nextRow(): FormRow | undefined {
    return this.form.getNextRow(this);
  }

  /**
   * 交换两个相邻组件的位置
   * @param component 要交换的组件
   * @param direction 要与左边/右边的交换
   */
  swapComponent(component: FormComponentModel, direction: 'left' | 'right') {
    const leftIndex =
      direction === 'left' ? this.components.indexOf(component) - 1 : this.components.indexOf(component);
    const [leftComponent] = this.components.splice(leftIndex, 1);
    this.components.splice(leftIndex + 1, 0, leftComponent);
  }

  set form(form: Form) {
    this._form = form;
  }

  get form(): Form {
    if (!this._form) {
      throw new Error('在使用form前必须先设置');
    }
    return this._form;
  }
}
