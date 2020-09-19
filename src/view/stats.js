import SmartView from "./smart.js";
import {formatDurationMovieStats, getCurrentDate} from "../utils/film.js";

const calculatesRank = (moviesViewed) => {
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

const createRankTemplate = (moviesViewed) => {
  return (`<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${calculatesRank(moviesViewed)}</span>
  </p>`);
};

const countsViewingTime = (moviesViewed) => {
  let elapsedTime = 0;
  moviesViewed.forEach((film) => {
    elapsedTime += film.runtime;
  });
  return elapsedTime;
};

const findsFrequentGenre = (films) => {
  const genres = films.map((film) => film.genre);
  const genresAll = [].concat.apply([], genres);

  const reps = genresAll.reduce((accum, item) => {
  const newCount = (accum[item] || 0) + 1;
    return {...accum, [item]: newCount};
  }, {});
  const max = Math.max.apply(null, Object.values(reps));
  const [recordItem] = Object.entries(reps).find(([, val]) => val === max);
  return recordItem;
};

const createStatsTemplate = (films) => {
  const filmsClone = films.slice();
  const filmsCloneFilter = filmsClone.filter((film) => film.history === true);
  const moviesViewedLength = filmsCloneFilter.length;
  const frequentGenre = moviesViewedLength ? findsFrequentGenre(filmsCloneFilter) : ``;
  const elapsedTime = formatDurationMovieStats(countsViewingTime(filmsCloneFilter)).split(` `);
  const elapsedHour = moviesViewedLength ? elapsedTime[0] : `0`;
  const elapseMinute = moviesViewedLength ? elapsedTime[1] : `0`;
  const rankTemplate = moviesViewedLength ? createRankTemplate(moviesViewedLength) : ``;

  return (`<section class="statistic">
  ${rankTemplate}
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>
  
  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${moviesViewedLength} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${elapsedHour}<span class="statistic__item-description">h</span> ${elapseMinute} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${frequentGenre}</p>
    </li>
  </ul>
  
  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
  
  </section>`);
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._data = {
      films,
      dateFrom: (() => {
        const daysToFullWeek = 6;
        const date = getCurrentDate();
        date.setDate(date.getDate() - daysToFullWeek);
        return date;
      })(),
      dateTo: getCurrentDate()
    }
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatsTemplate(this._films);
  }

  restoreHandlers() {
    //Переустановка обработчиков.
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setCharts() {
    //Отрисовка графиков.
  }
}
