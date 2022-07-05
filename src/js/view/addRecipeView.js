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

    this._parentElement.addEventListener('click', this._addIngr.bind(this));
    this._parentElement.addEventListener('click', this._delIngr.bind(this));
  }

  addHandlerUploadBtn(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const newRecipe = Object.fromEntries(new FormData(this));

      handler(newRecipe);
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

  _addIngr(e) {
    const btn = e.target.closest('.btn--add-ingr');
    if (!btn) return;

    // Index for the new&last field
    const index =
      this._parentElement.querySelectorAll('.upload__ingredient').length + 1;

    // Add a new field with the (+) btn
    btn.parentElement.insertAdjacentHTML(
      'afterend',
      this._generateMarkupIngrField(index)
    );

    // Remove the (+) btn from the previous field
    btn.remove();
  }

  _delIngr(e) {
    const btn = e.target.closest('.btn--del-ingr');
    if (!btn) return;

    // Delete the field
    btn.parentElement.remove();

    const ingrsArr = Array.from(
      this._parentElement.querySelectorAll('.upload__ingredient')
    );
    const lastIngr = ingrsArr[ingrsArr.length - 1];

    // Update the num where it's necessary
    ingrsArr.forEach((ingr, i) => {
      const label = ingr.querySelector('label');
      const inputs = ingr.querySelectorAll('input');

      label.textContent = `Ingredient ${i + 1}`;
      inputs.forEach(
        input => (input.name = input.name.replace(/[0-9]/g, i + 1))
      );
    });

    // Add (+) btn to the last field if there wasn't one yet
    if (!lastIngr.querySelector('.btn--add-ingr'))
      lastIngr.insertAdjacentHTML('beforeend', this._generateMarkupAddBtn());
  }

  _generateMarkup() {}

  _generateMarkupAddBtn() {
    return `
      <button type="button" class="btn--tiny btn--ingrs btn--add-ingr">
        <svg>
          <use href="${icons}#icon-plus-circle"></use>
        </svg>
      </button>
    `;
  }

  _generateMarkupIngrField(i) {
    return `
      <div class="upload__ingredient">
        <label>Ingredient ${i}</label>
        <input
          type="text"
          name="ingredient-${i}-quantity"
          placeholder="Quantity"
        />
        <input type="text" name="ingredient-${i}-unit" placeholder="Unit" />
        <input
          type="text"
          required
          name="ingredient-${i}-description"
          placeholder="Description"
        />
        <button type="button" class="btn--tiny btn--ingrs btn--del-ingr">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button type="button" class="btn--tiny btn--ingrs btn--add-ingr">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    `;
  }
}

export default new addRecipeView();
