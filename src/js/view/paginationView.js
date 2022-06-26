import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;

  addHandlerPaginationBtns(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;

      const goToPage = +btn.dataset.goTo;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results / this._data.resultsPerPage
    );

    // Only 1 page
    if (totalPages === 1) return '';

    // 1st page, others
    if (this._data.page === 1) {
      return `
        <button data-go-to="${
          this._data.page + 1
        }" class="btn--inline pagination__btn pagination__btn--next">
          <span>Page ${this._data.page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Last page
    if (this._data.page === totalPages) {
      return `
        <button data-go-to="${
          this._data.page - 1
        }" class="btn--inline pagination__btn pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${this._data.page - 1}</span>
        </button>
      `;
    }

    // Middle page
    return `
      <button data-go-to="${
        this._data.page - 1
      }" class="btn--inline pagination__btn pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>
      <button data-go-to="${
        this._data.page + 1
      }" class="btn--inline pagination__btn pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new paginationView();
