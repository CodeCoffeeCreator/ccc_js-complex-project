import { DomListener } from './DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name;

    this.prepare();
  }

  prepare() {}

  toHTML() {
    return '';
  }

  init() {
    this.initDOMListeners(console.log(this.listeners));
  }

  destroy() {
    this.removeDOMListeners();
  }
}
