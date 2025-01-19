export const loadFromLocalStorage = () => {
  let favoriteMovies = {}

  const storedMovies = localStorage.getItem('favoriteMovies')

  if (storedMovies) {
    favoriteMovies = JSON.parse(storedMovies)
  }

  return favoriteMovies
}

export const renderMovies = (movies, domEl) => {
  let favoriteMovies = {}

  const storedMovies = localStorage.getItem('favoriteMovies')

  if (storedMovies) {
    favoriteMovies = JSON.parse(storedMovies)
  }

  let html = movies.reduce((acc, movie) => {
    const { Poster, Title, imdbRating, Runtime, Plot, Genre, imdbID } = movie
    const isFavorite = Boolean(favoriteMovies[imdbID])
    const addRemoveIcon = isFavorite ? './img/remove.svg' : './img/add.svg'
    const addRemoveText = isFavorite ? 'Remove' : 'Add'

    acc += `
      <article class="movie ${imdbID} ${isFavorite}">
        <img src="${Poster}" alt="${Title}">
        <div>
          <h2>${Title} <img class="star" src="./img/star.svg"><span class="rating">${imdbRating}</span></h2>
          <p class="metadata">${Runtime} ${Genre} <button id="${imdbID}" class="add-remove-btn"><img class="add-remove-img" src="${addRemoveIcon}">${addRemoveText}</button></p>
          <p class="description">${Plot}</p>
        </div>
      </article>
    `

    return acc
  }, '')

  domEl.innerHTML = html
}

export const saveToLocalStorage = favoriteMovies => {
  localStorage.setItem('favoriteMovies', JSON.stringify({ ...favoriteMovies }))
}
