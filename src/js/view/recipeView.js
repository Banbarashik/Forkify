import 'fractional';
import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _data;
  _errorMessage = 'We could not find that recipe. Please try another one!';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerShoppingCartBtn(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe__btn--shopping-cart');
      if (!btn) return;
      handler();
    });
  }

  addHandlerBookmarkBtn(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerServingBtns(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--servings');
      if (!btn) return;

      const newServings = +btn.dataset.changeTo;
      if (newServings > 0) handler(newServings);
    });
  }

  addHandlerWeekDayBtns(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--weekDay');
      if (!btn) return;

      const { dayNum } = btn.dataset;
      const dayName = btn.title.toLowerCase();
      handler(+dayNum, dayName);
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button data-change-to="${
            this._data.servings - 1
          }" class="btn--tiny btn--servings btn--decrease-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button data-change-to="${
            this._data.servings + 1
          }" class="btn--tiny btn--servings btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__days-buttons">
        <button data-day-num="0" title="Monday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('monday') ? 'active' : ''
        }">M</button>
        <button data-day-num="1" title="Tuesday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('tuesday') ? 'active' : ''
        }">T</button>
        <button data-day-num="2" title="Wednesday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('wednesday') ? 'active' : ''
        }">W</button>
        <button data-day-num="3" title="Thursday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('thursday') ? 'active' : ''
        }">T</button>
        <button data-day-num="4" title="Friday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('friday') ? 'active' : ''
        }">F</button>
        <button data-day-num="5" title="Saturday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('saturday') ? 'active' : ''
        }">S</button>
        <button data-day-num="6" title="Sunday" class="btn--tiny btn--weekDay ${
          this._data.days.includes('sunday') ? 'active' : ''
        }">S</button>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._generateMarkupIngredients()}
      </ul>
      <button class="btn--small recipe__btn recipe__btn--shopping-cart">
        Add to the shopping cart
      </button>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  }

  _generateMarkupIngredients() {
    return this._data.ingredients
      .map(ing => {
        return `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity ? new Fraction(ing.quantity).toString() : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit}</span>
              ${ing.description}
            </div>
          </li>
      `;
      })
      .join('');
  }
}

export default new RecipeView();
