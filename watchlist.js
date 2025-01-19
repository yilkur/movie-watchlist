import {
  renderMovies,
  saveToLocalStorage,
  loadFromLocalStorage,
} from './utils.js'

let favoriteMovies = loadFromLocalStorage()
const movieArray = Object.values(favoriteMovies)

const movieListEl = document.getElementById('watchlist')

const renderWatchlist = () => {
  if (movieArray.length > 0) {
    renderMovies(movieArray, movieListEl)
    setupEventListeners()
  } else {
    renderEmptyWatchlistMessage()
  }
}

const renderEmptyWatchlistMessage = () => {
  movieListEl.innerHTML = `
    <div class="empty-watchlist">
      <h2>Your watchlist is looking a little empty....</h2>
      <a class="go-to-search-btn " href="./index.html">
        <img class="add-remove-btn" src="./img/add.svg" alt="Add movies">Let’s add some movies!
      </a>
    </div>
  `
}

const setupEventListeners = () => {
  movieListEl.addEventListener('click', e => {
    if (e.target.classList.contains('add-remove-btn')) {
      const id = e.target.id
      removeMovieFromWatchlist(id)
    }
  })
}

const removeMovieFromWatchlist = id => {
  if (favoriteMovies[id]) {
    delete favoriteMovies[id]
    saveToLocalStorage(favoriteMovies)

    const movieEl = document.querySelector(`.movie.${id}`)
    
    if (movieEl) {
      movieEl.style.display = 'none'
    }

    if (Object.keys(favoriteMovies).length === 0) {
      renderEmptyWatchlistMessage()
    }
  }
}

renderWatchlist()
