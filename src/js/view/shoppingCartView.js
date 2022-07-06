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

  _generateMarkup() {
    return `
    <tbody>
      <tr>
        <th>Quantity</th>
        <th>Unit</th>
        <th>Description</th>
      </tr>
      ${this._generateMarkupProducts()}
    </tbody>
    `;
  }

  _generateMarkupProducts() {
    return this._data
      .map(ingr => {
        return `
          <tr>
            <td>${ingr.quantity ? ingr.quantity : '—'}</td>
            <td>${ingr.unit ? ingr.unit : '—'}</td>
            <td>${ingr.description}</td>
          </tr>
        `;
      })
      .join('');
  }
}

export default new shoppingCartView();
