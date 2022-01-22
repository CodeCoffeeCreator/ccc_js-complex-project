import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import { $ } from '../../core/dom';

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

  onMousedown(event) {
    if (event.target.dataset.resize) {
      const $resizer = $(event.target);
      const $parent = $resizer.closest('[data-type="resizable"]');
      const coords = $parent.getCoords();
      const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`);

      document.onmousemove = (e) => {
        const delta = e.pageX - coords.right;
        const value = coords.width + delta;
        $parent.$el.style.width = value + 'px';
        cells.forEach((el) => (el.style.width = value + 'px'));
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
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
