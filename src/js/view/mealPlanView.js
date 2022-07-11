import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class mealPlanView extends View {
  _parentElement = document.querySelector('.mealPlan');
  _data;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return `
      <p class="mealPlan__title">Your weekly meal plan</p>
      ${this._generateMarkupMealDay()}
    `;
  }

  _generateMarkupMealDay() {
    return this._data
      .map(meal => {
        return `
        <div class="mealPlan__item">
          <p class="mealPlan__item-title">${
            meal.dayName.charAt(0).toUpperCase() + meal.dayName.slice(1)
          }</p>
          <a href="#${meal.recipe?.id ? meal.recipe.id : ''}"
          class="mealPlan__item-link">
            <img
              src="${meal.recipe?.image ? meal.recipe.image : '#'}"
              alt="${meal.recipe?.title}"
              title="${meal.recipe?.title}"
              class="mealPlan__item-img ${meal.recipe?.image ? '' : 'hidden'}"
            />
          </a>
        </div>
      `;
      })
      .join('');
  }
}

export default new mealPlanView();
