import { Excel } from '../components/excel/Excel';
import { Formula } from '../components/formula/Formula';
import { Header } from '../components/header/Header';
import { Table } from '../components/table/Table';
import { Toolbar } from '../components/toolbar/Toolbar';
import { Page } from '../core/Page';
import { createStore } from '../core/store/createStore';
import { debounce, storage } from '../core/utils';
import { normalizeInitialState } from '../redux/initialState';
import { rootReducer } from '../redux/rootReducer';

function storageName(param) {
  return 'excel:' + param;
}

class StateProcessor {
  constructor(client, delay = 300) {
    this.client = client;
    this.listen = debounce(this.listen.bind(this), delay);
  }

  listen(state) {
    this.client.save(state);
  }

  get() {
    return this.client.get();
  }
}

class LocalStorageClient {
  constructor(name) {
    this.name = storageName(name);
  }

  save(state) {
    storage(this.name, state);
    return Promise.resolve();
  }

  get() {
    // return Promise.resolve(storage(this.name));
    return new Promise((resolve) => {
      const state = storage(this.name);
      setTimeout(() => {
        resolve(state);
      }, 2000);
    });
  }
}

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
