import icons from 'url:./../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _data;
  _errorMessage = 'No recipes for this query. Try something else';

  addHandlerRender(handler) {
    const btn = document.querySelector('.search__btn');

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const query = document.querySelector('.search__field').value;

      handler(query);
    });
  }

  _generateMarkup() {
    return this._data.map(rec => previewView.render(rec, true)).join('');
  }
}

export default new resultsView();
