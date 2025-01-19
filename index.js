import {
  renderMovies,
  saveToLocalStorage,
  loadFromLocalStorage,
} from './utils.js'

const API_CONFIG = {
  KEY: 'XXX',
  BASE_URL: 'http://www.omdbapi.com/',
  getSuffix() {
    return `&apikey=${this.KEY}`
  },
}

const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const moviesEl = document.getElementById('movies')
const loadingMessage = document.getElementById('loading-message')

let currentMovies = []
const favoriteMovies = loadFromLocalStorage()

const fetchMovies = async search => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}?s=${search}${API_CONFIG.getSuffix()}`
  )
  const data = await response.json()
  return data.Search || []
}

const fetchMovieDetails = async movieIds => {
  const detailPromises = movieIds.map(id =>
    fetch(`${API_CONFIG.BASE_URL}?i=${id}${API_CONFIG.getSuffix()}`).then(res =>
      res.json()
    )
  )
  return Promise.all(detailPromises)
}

const toggleFavoriteMovie = id => {
  const matchingMovie = currentMovies.find(movie => movie.imdbID === id)
  
  if (matchingMovie) {
    favoriteMovies[id] = matchingMovie
    document.querySelector(`.movie.${id}`).style.display = 'none'
    saveToLocalStorage(favoriteMovies)
  }
}

const setupEventListeners = () => {
  document.querySelectorAll('.add-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => toggleFavoriteMovie(e.target.id))
  })
}

const getMovies = async search => {
  try {
    moviesEl.innerHTML = ''
    loadingMessage.style.display = 'block'

    const movies = await fetchMovies(search)
    const movieIds = movies
      .filter(({ imdbID }) => !favoriteMovies[imdbID])
      .map(({ imdbID }) => imdbID)

    const detailedResults = await fetchMovieDetails(movieIds)

    currentMovies = detailedResults
    renderMovies(detailedResults, moviesEl)
    setupEventListeners()
  } catch (error) {
    console.error('Error fetching data: ', error)
  } finally {
    loadingMessage.style.display = 'none'
  }
}

searchBtn.addEventListener('click', e => {
  e.preventDefault()
  if (searchInput.value.trim()) {
    getMovies(searchInput.value.trim())
  }
})
