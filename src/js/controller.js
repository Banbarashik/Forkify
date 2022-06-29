import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import bookmarksView from './view/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update the results panel to mark the current recipe
    resultsView.update(model.getSearchResultsByPage());

    // Update the bookmarks panel to mark the current recipe
    bookmarksView.update(model.state.bookmarks);

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.render();
  }
};

const controlResults = async function (query) {
  try {
    await model.loadResults(query);

    resultsView.render(model.getSearchResultsByPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render prev/next results page
  resultsView.render(model.getSearchResultsByPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // Store data in the state
  if (!model.state.recipe.bookmarked) model.addBookmark();
  else model.deleteBookmark();

  // Update the recipe (the bookmark button)
  recipeView.update(model.state.recipe);

  // Render bookmarks panel
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarksLoad = function () {
  // Load the bookmarks array from the localStorage
  model.loadBookmarks();

  // Render the recieved bookmarks array
  bookmarksView.render(model.state.bookmarks);
};

const controlRecipeUpload = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // Close modal window
    addRecipeView.toggleHidden();

    // Display spinner in recipeView
    recipeView.renderSpinner();

    // Upload the recipe from user's form
    await model.uploadRecipe(newRecipe);

    // Show success message in the top right corner
    addRecipeView.renderNotification();

    // URL: replace prev recipe's ID with the new ID
    history.pushState('', '', `#${model.state.recipe.id}`);

    // Bookmark the newly created recipe
    model.addBookmark(model.state.recipe);

    // Render bookmarks to add to them the newly created recipe
    bookmarksView.render(model.state.bookmarks);

    // Render the newly created recipe
    recipeView.render(model.state.recipe);

    // Update the results to mark the created recipe
    resultsView.update(model.getSearchResultsByPage());
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksLoad);
  addRecipeView.addHandlerUploadBtn(controlRecipeUpload);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServingBtns(controlServings);
  recipeView.addHandlerBookmarkBtn(controlBookmarks);
  resultsView.addHandlerRender(controlResults);
  paginationView.addHandlerPaginationBtns(controlPagination);
};

init();
