// Importing modules
import RecipeApiService from './service/service-api';
import sprite from '../images/sprite.svg';

// Initializing variables and elements
const recipeApiSerive = new RecipeApiService();
const post = document.querySelector('.image-container');
const searchInput = document.querySelector('.form-input');
let data = [];

// Function to fetch data from the API and render the markup
async function getApi() {
  recipeApiSerive.limit = 8;
  try {
    const response = await recipeApiSerive.getRecipe();
    data = response.results;
    renderMarkup(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to render the recipe markup
function renderingRecipes(title, description, preview, rating, id, category) {
  // Create an object with recipe information.
  const infoRecipe = {
    title,
    description: description.replace("'", ''),
    preview,
    rating,
    id,
    category,
  };

  const fixedRating = Math.min(rating, 5).toFixed(1);

  return `
    <div data-category="${category}" class="rec-search-item" 
      style="background: linear-gradient(0deg, rgba(5, 5, 5, 0.6), rgba(5, 5, 5, 0)),
      url(${preview}); background-position: center; background-size: cover;">
      <div class="upper-part">
        <button type="button" class="heart-btn" data-info="${JSON.stringify(
          infoRecipe
        )}" name="favorite">
          <svg class="icon-heart" width="22" height="22">
            <use href="${sprite}#heart"></use>
          </svg>
        </button>
        <h2 class="rec-card-title title-cut">${title}</h2>
        <p class="rec-card-desc desc-cut">${description}</p>
        <div class="rec-rate">
          <p class="rate">${fixedRating}</p>
          <!-- Implement the rating markup here, if needed -->
          <button type="button" name="details" class="rec-btn-open rec-btn" data-id="${id}">See recipe</button>
        </div>
      </div>
    </div>
  `;
}

// Function to filter recipes by title
function filterByTitle(title) {
  return data.filter(item =>
    item.title.toLowerCase().includes(title.toLowerCase())
  );
}

// Function to render the markup for all filtered recipes
function renderMarkup(data) {
  const markup = data
    .map(recipe =>
      renderingRecipes(
        recipe.title,
        recipe.description,
        recipe.preview,
        recipe.rating,
        recipe.id,
        recipe.category
      )
    )
    .join('');
  post.innerHTML = markup;
}

// Event listener for search input to filter recipes
searchInput.addEventListener('input', () => {
  const filterValue = searchInput.value.trim();
  const filteredData = filterValue ? filterByTitle(filterValue) : data;
  renderMarkup(filteredData);
});

// Initiating the script
getApi();