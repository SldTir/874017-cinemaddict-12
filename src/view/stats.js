import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatDurationMovieStats, getCurrentDate} from "../utils/film.js";
import {countCompletedFilmInDateRange, makeItemsUniq, countFilmsGenreRating, findsFrequentGenre, getLatestDate, calculatesRank} from "../utils/statistics.js";
import {StatsItem} from "../const.js";

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

const renderGenreChart = (statisticCtx, films, uniqItems) => {

  const data = countFilmsGenreRating(films, uniqItems);
  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...uniqItems],
      datasets: [{
        data,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          dataset: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  return myChart;
};

const createStatsTemplate = (data) => {
  const {films, dateFrom, dateTo, filterChecked} = data;
  const filteredFilm = countCompletedFilmInDateRange(films, dateFrom, dateTo);

  const filmsFilteredHistoryClone = filteredFilm.slice().filter((film) => film.history);
  const filmsHistoryClone = films.slice().filter((film) => film.history);

  const moviesViewedLength = filmsFilteredHistoryClone.length;
  const frequentGenre = moviesViewedLength ? findsFrequentGenre(filmsFilteredHistoryClone) : ``;
  const elapsedTime = formatDurationMovieStats(countsViewingTime(filmsFilteredHistoryClone)).split(` `);
  const elapsedHour = moviesViewedLength ? elapsedTime[0] : `0`;
  const elapseMinute = moviesViewedLength ? elapsedTime[1] : `0`;
  const rankTemplate = filmsHistoryClone.length ? createRankTemplate(filmsHistoryClone.length) : ``;

  return (`<section class="statistic">
  ${rankTemplate}
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${`all` === filterChecked ? `checked` : ``}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${`today` === filterChecked ? `checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${`week` === filterChecked ? `checked` : ``}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${`month` === filterChecked ? `checked` : ``}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>
  
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${`year` === filterChecked ? `checked` : ``}>
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
    this._data = {
      films,
      dateFrom: new Date(0),
      dateTo: getCurrentDate(),
      filterChecked: `all`,
    };

    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this.statsFilterCLickHandler = this.statsFilterCLickHandler.bind(this);

    this._genresChart = null;
    this._setCharts();
    this.getStatFilterLabel();
  }

  removeElement() {
    super.removeElement();
    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this.getStatFilterLabel();
  }

  _dateChangeHandler(dateFrom, targetInput) {
    if (!dateFrom) {
      return;
    }

    this.updateData({
      dateFrom,
      filterChecked: targetInput,
    });

    this.restoreHandlers();
  }

  _setCharts() {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }
    const {films, dateFrom, dateTo} = this._data;
    const filteredFilm = countCompletedFilmInDateRange(films, dateFrom, dateTo);
    const filmsHistoryClone = filteredFilm.slice().filter((film) => film.history);
    const uniqItems = makeItemsUniq(filmsHistoryClone);

    const BAR_HEIGHT = 50;

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    statisticCtx.height = BAR_HEIGHT * uniqItems.size;
    this._genresChart = renderGenreChart(statisticCtx, filmsHistoryClone, uniqItems);
  }

  statsFilterCLickHandler(evt) {
    evt.preventDefault();
    const targetInput = evt.target.getAttribute(`for`).split(`-`)[1];
    const latestDate = getLatestDate(StatsItem[targetInput]);
    this._dateChangeHandler(latestDate, targetInput);
  }

  getStatFilterLabel() {
    const allLabel = this.getElement().querySelectorAll(`.statistic__filters-label`);
    allLabel.forEach((element) => element.addEventListener(`click`, this.statsFilterCLickHandler));
  }
}
