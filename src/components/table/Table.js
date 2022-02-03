import { $ } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import { isCell, shouldResize, matrix, nextSelector } from './table.functions';
import { resizeHandler } from './table.resize';
import { createTable } from './table.template';
import { TableSelection } from './TableSelection';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
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
    this.selectCell($cell);

    this.$on('formula:input', (text) => {
      this.selection.current.text(text);
    });

    this.$on('formula:done', () => {
      this.selection.current.focus();
    });

    this.$subscribe((state) => {
      console.log('TableState', state);
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    this.$dispatch({ type: 'TEST' });
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        const cells = matrix($target, this.selection.current).map((id) =>
          this.$root.find(`[data-id="${id}"]`)
        );
        this.selection.selectGroup(cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
    ];
    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  onInput(event) {
    this.$emit('table:input', $(event.target));
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
