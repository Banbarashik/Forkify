import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class shoppingCartView extends View {
  _parentElement = document.querySelector('.shoppingCart__list');
  _data;
  _errorMessage =
    'No products yet. Find a nice recipe and add its ingredients to the cart :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {}
}

export default new shoppingCartView();
