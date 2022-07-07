import icons from 'url:./../../img/icons.svg';
import View from './View.js';

class mealPlanView extends View {
  _parentElement = document.querySelector('.mealPlan');
  _data;

  _generateMarkup() {}
}

export default new mealPlanView();
