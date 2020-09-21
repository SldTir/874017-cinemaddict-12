export const calculatesRank = (moviesViewed) => {
  let rank;
  if (moviesViewed > 0 && moviesViewed <= 10) {
    rank = `novice`;
  } if (moviesViewed >= 11 && moviesViewed <= 20) {
    rank = `fan`;
  } if (moviesViewed >= 21) {
    rank = `movie buff`;
  }

  return rank;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

export const getLatestDate = (countDay) => {
  if (countDay instanceof Date) {
    return countDay;
  }
  const daysToFullWeek = countDay;
  const date = getCurrentDate();
  date.setDate(date.getDate() - daysToFullWeek);
  return date;
};

export const countCompletedFilmInDateRange = (films, dateFrom, dateTo) => {
  const filmUp = films.filter((film) => {
    const date = new Date(film.watchingDate);
    if (date >= dateFrom && date <= dateTo) {
      return film;
    }
    return false;
  });
  return filmUp;
};

const getAllGenres = (items) => {
  const genres = items.map((film) => film.genre);
  const genresAll = [].concat(...genres);
  return genresAll;
};

export const makeItemsUniq = (items) => {
  const allGenres = getAllGenres(items);
  const genresUniq = new Set(allGenres);
  return genresUniq;
};

export const countFilmsGenreRating = (films, uniqItems) => {
  const allGenres = getAllGenres(films);
  let countGenres = [];
  let count = 0;
  uniqItems.forEach((element) => {
    count = 0;
    allGenres.forEach((genre) => {
      if (element === genre) {
        count += 1;
      }
    });
    return countGenres.push(count);
  });
  return countGenres;
};

export const findsFrequentGenre = (films) => {
  const genresAll = getAllGenres(films);
  const reps = genresAll.reduce((accum, item) => {
    const newCount = (accum[item] || 0) + 1;
    return Object.assign({}, accum, {[item]: newCount});
  }, {});
  const max = Math.max.apply(null, Object.values(reps));
  const [recordItem] = Object.entries(reps).find(([, val]) => val === max);
  return recordItem;
};
