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
  state.recipe = {
    title: recipe.title,
    id: recipe.id,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    const { recipe } = data.data;
    formatRecipeObj(recipe);

    // Check if the recipe is bookmarked
    if (state.bookmarks.some(rec => rec.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
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

export const loadLocalStorage = function () {
  const bookmarksStr = localStorage.getItem('bookmarks');
  const productsStr = localStorage.getItem('products');

  // Don't overwrite if localStorage is empty
  if (bookmarksStr) state.bookmarks = JSON.parse(bookmarksStr);
  if (productsStr) state.products = JSON.parse(productsStr);
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
    /*
    const ingredients = [];

    for (let i = 1; i <= 6; i++) {
      // Returns [[ingr-1-q, value], [ingr-1-u, value], [ingr-1-d, value]]
      const arr = Object.entries(newRecipe).filter(entry =>
        entry[0].startsWith(`ingredient-${i}`)
      );

      const quantity = arr[0][1],
        unit = arr[1][1],
        description = arr[2][1];

      // API requires an ingredient to have a description prop
      if (!description) break;

      const recObj = {
        quantity: quantity ? quantity : null,
        unit,
        description,
      };

      ingredients.push(recObj);
    }
    */

    // Create a property 'ingredient' containing recipes' objects in
    // {quantity, unit, description} format
    /*
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingsArr = ing[1].split(',').map(el => el.trim());
        const ingsObj = {
          quantity: ingsArr[0] ? ingsArr[0] : null,
          unit: ingsArr[1],
          description: ingsArr[2],
        };
        return ingsObj;
      });
    */

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
    formatRecipeObj(recipe);

    storeBookmarks();
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
