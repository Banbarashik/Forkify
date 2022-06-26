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

  _generateMarkup() {}
}

export default new addRecipeView();
