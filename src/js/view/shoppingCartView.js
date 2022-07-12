import fracty from 'fracty';
import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class shoppingCartView extends View {
  _parentElement = document.querySelector('.shoppingCart__table');
  _data;
  _errorMessage =
    'No products yet. Find a nice recipe and add its ingredients to the cart :)';

  addHandlerDelProduct(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--del-product');
      if (!btn) return;

      const productEl = btn.closest('tr');
      const productArr = productEl.textContent
        .trim()
        .split('\n')
        .map(el => el.trim());
      const [quantity, unit, description] = productArr;

      const productObj = {
        quantity: quantity === '—' ? null : eval(quantity),
        unit: unit === '—' ? '' : unit,
        description,
      };

      handler(productObj);
    });
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
            <td>${ingr.quantity ? fracty(ingr.quantity).toString() : '—'}</td>
            <td>${ingr.unit ? ingr.unit : '—'}</td>
            <td>${ingr.description}</td>
            <td>
              <button class="btn--tiny btn--del-product">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }
}

export default new shoppingCartView();
