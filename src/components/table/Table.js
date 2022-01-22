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
      const type = $resizer.data.resize;
      const sideProp = type === 'col' ? 'bottom' : 'right';
      let value;

      $resizer.css({
        opacity: 1,
        [sideProp]: '-3000px',
      });

      document.onmousemove = (e) => {
        if (type === 'col') {
          const delta = e.pageX - coords.right;
          value = coords.width + delta;
          $resizer.css({ right: -delta + 'px' });
        } else {
          const delta = e.pageY - coords.bottom;
          value = coords.height + delta;
          $resizer.css({ bottom: -delta + 'px' });
        }
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;

        if (type === 'col') {
          $parent.css({ width: value + 'px' });
          this.$root
            .findAll(`[data-col="${$parent.data.col}"]`)
            .forEach((el) => (el.style.width = value + 'px'));
        } else {
          $parent.css({ height: value + 'px' });
        }

        $resizer.css({
          opacity: 0,
          bottom: 0,
          right: 0,
        });
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
