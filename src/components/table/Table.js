import { ExcelComponent } from '../../core/ExcelComponent';
import { shouldResize } from './table.functions';
import { resizeHandler } from './table.resize';
import { createTable } from './table.template';
import { TableSelection } from './TableSelection';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });
  }

  toHTML() {
    return createTable(20);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');
    console.log($cell);
    this.selection.select($cell);
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    }
  }
}

// 560 мс  Сценарии
// 4844 мс  Отрисовка
// 1286 мс  Отображение
// 1633 мс  Система
// 4451 мс  Бездействует
// 12775 мс  Всего
// -----------------------------------
// 256 мс  Сценарии
// 2709 мс  Отрисовка
// 768 мс  Отображение
// 994 мс  Система
// 8569 мс  Бездействует
// 13296 мс  Всего
// -----------------------------------
// 139 мс  Сценарии
// 379 мс  Отрисовка
// 85 мс  Отображение
// 454 мс  Система
// 14637 мс  Бездействует
// 15695 мс  Всего
