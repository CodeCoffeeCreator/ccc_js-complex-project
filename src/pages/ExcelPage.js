import { Excel } from '../components/excel/Excel';
import { Formula } from '../components/formula/Formula';
import { Header } from '../components/header/Header';
import { Table } from '../components/table/Table';
import { Toolbar } from '../components/toolbar/Toolbar';
import { Page } from '../core/pages/Page';
import { StateProcessor } from '../core/pages/StateProcessor';
import { createStore } from '../core/store/createStore';
import { normalizeInitialState } from '../redux/initialState';
import { rootReducer } from '../redux/rootReducer';
import { LocalStorageClient } from '../shared/LocalStorageClient';

export class ExcelPage extends Page {
  constructor(param) {
    super(param);

    this.storeSub = null;
    this.processor = new StateProcessor(new LocalStorageClient(this.params));
  }

  async getRoot() {
    // const params = this.params ? this.params : Date.now().toString();

    // const state = storage(storageName(params));
    const state = await this.processor.get();
    const store = createStore(rootReducer, normalizeInitialState(state));

    // const stateListener = debounce((state) => {
    //   storage(storageName(params), state);
    // }, 300);

    this.storeSub = store.subscribe(this.processor.listen);

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
    this.storeSub.unsubscribe();
  }
}
