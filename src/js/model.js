import { AJAX, storeLocalStorage } from './helper';
import { RES_PER_PAGE, API_URL, API_KEY } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: 1,
    resultsPerPage: RES_PER_PAGE,
    page: 1,
    recipes: [],
  },
  bookmarks: [],
  products: [],
  meals: [
    { dayName: 'monday' },
    { dayName: 'tuesday' },
    { dayName: 'wednesday' },
    { dayName: 'thursday' },
    { dayName: 'friday' },
    { dayName: 'saturday' },
    { dayName: 'sunday' },
  ],
};

const formatRecipeObj = function (recipe) {
  return {
    title: recipe.title,
    id: recipe.id,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
    days: [],
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    const { recipe } = data.data;
    state.recipe = formatRecipeObj(recipe);

    // Check if the recipe is bookmarked
    if (state.bookmarks.some(rec => rec.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // Find out which days the recipe is assigned to
    const days = state.meals
      .filter(meal => meal.recipe?.id === state.recipe.id)
      .map(meal => meal.dayName);

    state.recipe.days = days;
  } catch (err) {
    throw err;
  }
};

export const loadResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.query = query;
    state.search.results = data.results;

    const { recipes } = data.data;
    state.search.recipes = recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsByPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage - 1;

  return state.search.recipes.slice(start, end);
};

export const updateServings = function (newServings) {
  const oldServings = state.recipe.servings;
  state.recipe.servings = newServings;

  // Change quantity of ingredients by the formula
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / oldServings;
  });
};

export const addBookmark = function () {
  // Store the recipe in the array of bookmarked recipes
  state.bookmarks.push(state.recipe);

  // Property to check in recipeView.render() to mark/unmark the
  // bookmarks button
  state.recipe.bookmarked = true;

  // Store the bookmarks array in the localStorage
  storeLocalStorage('bookmarks', state.bookmarks);
};

export const deleteBookmark = function () {
  // Find the recipe in the array of bookmarked recipes
  const index = state.bookmarks.findIndex(rec => rec.id === state.recipe.id);
  // Remove the recipe from the array of bookmarked recipes
  state.bookmarks.splice(index, 1);

  // Property to check in recipeView.render() to mark/unmark the
  // bookmarks button
  state.recipe.bookmarked = false;

  // Update the bookmarks array in the localStorage
  storeLocalStorage('bookmarks', state.bookmarks);
};

export const addMeal = function (dayNum, dayName) {
  state.meals[dayNum].recipe = state.recipe;
  state.recipe.days.push(dayName);
  storeLocalStorage('meals', state.meals);
};

export const removeMeal = function (dayNum, dayName) {
  delete state.meals[dayNum].recipe;

  const index = state.recipe.days.findIndex(day => day === dayName);

  state.recipe.days.splice(index, 1);
};

export const addProducts = function () {
  state.products.push(...state.recipe.ingredients);
  storeLocalStorage('products', state.products);
};

export const deleteProduct = function (product) {
  const index = state.products.findIndex(
    stateProduct =>
      stateProduct.quantity === product.quantity &&
      stateProduct.unit === product.unit &&
      stateProduct.description === product.description
  );

  state.products.splice(index, 1);
  storeLocalStorage('products', state.products);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingrs = [];
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient'))
      .reduce((prev, cur, i, arr) => {
        if (arr.length - 1 === i) {
          ingrs.push(prev.concat(cur));
          return ingrs;
        }
        if (prev[0].replace(/\D/g, '') === cur[0].replace(/\D/g, ''))
          return prev.concat(cur);

        ingrs.push(prev);
        return cur;
      })
      .map(el => el.filter(entry => !entry.startsWith('ingredient')))
      .map(valuesArr => {
        const [quantity, unit, description] = valuesArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const userRecipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      publisher: newRecipe.publisher,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, userRecipe);

    // Response: recipe with id and key
    const { recipe } = data.data;
    state.recipe = formatRecipeObj(recipe);

    storeLocalStorage('bookmarks', state.bookmarks);
  } catch (err) {
    throw err;
  }
};
