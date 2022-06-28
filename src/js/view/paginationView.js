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
    const curPage = this._data.page;
    const totalPages = Math.ceil(
      this._data.results / this._data.resultsPerPage
    );

    // Only 1 page
    if (totalPages === 1) return '';
    // 1st page, others
    if (this._data.page === 1)
      return this._generateMarkupButton(curPage, 'next');
    // Last page
    if (this._data.page === totalPages)
      return this._generateMarkupButton(curPage, 'prev');
    // Middle page
    return this._generateMarkupButton(curPage, 'both');
  }

  _generateMarkupButton(curPage, direction) {
    if (direction === 'prev') {
      return `
      <button data-go-to="${
        curPage - 1
      }" class="btn--inline pagination__btn pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
      <span>Page ${curPage - 1}</span>
      </button>
    `;
    }

    if (direction === 'next') {
      return `
      <button data-go-to="${
        curPage + 1
      }" class="btn--inline pagination__btn pagination__btn--next">
      <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    }

    if (direction === 'both') {
      return (
        this._generateMarkupButton(curPage, 'prev') +
        this._generateMarkupButton(curPage, 'next')
      );
    }
  }
}

export default new paginationView();
