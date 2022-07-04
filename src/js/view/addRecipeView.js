import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');

  _data;
  _errorMessage = '';
  _message = 'Recipe was successfully uploaded';

  constructor() {
    super();

    this._showModal();
    this._closeModal();
    this._delIngr();
  }

  addHandlerUploadBtn(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const newRecipe = Object.fromEntries(new FormData(this));

      handler(newRecipe);
    });
  }

  _delIngr() {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--ingrs');
      if (!btn) return;

      if (btn.classList.contains('btn--del-ingr')) btn.parentElement.remove();

      if (btn.classList.contains('btn--add-ingr')) {
        const index = this.querySelectorAll('.upload__ingredient').length + 1;
        const markup = `
          <div class="upload__ingredient">
            <label>Ingredient ${index}</label>
            <input
              type="text"
              name="ingredient-${index}-quantity"
              placeholder="Quantity"
            />
            <input type="text" name="ingredient-${index}-unit" placeholder="Unit" />
            <input
              value="salt"
              type="text"
              name="ingredient-${index}-description"
              placeholder="Description"
            />
            <button class="btn--tiny btn--ingrs btn--del-ingr">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--ingrs btn--add-ingr">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        `;

        btn.parentElement.insertAdjacentHTML('afterend', markup);
        btn.remove();
        return;
      }

      this.querySelectorAll('.upload__ingredient').forEach((ingr, i, arr) => {
        ingr.querySelector('label').textContent = `Ingredient ${i + 1}`;
        ingr
          .querySelectorAll('input')
          .forEach(input => (input.name = input.name.replace(/[0-9]/g, i + 1)));

        if (arr.length === i + 1 && !ingr.querySelector('.btn--add-ingr')) {
          ingr.insertAdjacentHTML(
            'beforeend',
            `
              <button class="btn--tiny btn--ingrs btn--add-ingr">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            `
          );
        }
      });
    });
  }

  toggleHidden() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _showModal() {
    this._openBtn.addEventListener('click', this.toggleHidden.bind(this));
  }

  _closeModal() {
    this._overlay.addEventListener('click', this.toggleHidden.bind(this));
    this._closeBtn.addEventListener('click', this.toggleHidden.bind(this));
  }

  _generateMarkup() {}
}

export default new addRecipeView();
