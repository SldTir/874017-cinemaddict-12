import BoardView from "../view/board.js";
import NoFilmView from "../view/no-film.js";
import SortView from "../view/sort.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmPresenter from "./film.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmDate, sortFilmRating} from "../utils/film.js";
import {SortType} from "../const.js";

const FILM_COUNT_PER_STEP = 5;

export default class MoveList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._boardComponent = new BoardView();
    this._noFilmComponent = new NoFilmView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    this._sourceBoardFilms = boardFilms.slice();

    this._renderSort();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleFilmChange(updateFilm) {
    this._boardFilms = updateItem(this._boardFilms, updateFilm);
    this._sourceBoardFilms = updateItem(this._sourceBoardFilms, updateFilm);
    this._filmPresenter[updateFilm.id].init(updateFilm);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortFilmDate);
        break;
      case SortType.RATING:
        this._boardFilms.sort(sortFilmRating);
        break;
      default:
        this._boardFilms = this._sourceBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderBoard();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(container, from, to) {
    this._boardFilms
    .slice(from, to)
    .forEach((boardFilm) => this._renderFilm(container, boardFilm));
  }

  _renderNoFilm(container) {
    render(container, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);

    this._renderFilms(siteFilmsListContainer, this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);

    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._boardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
  }

  _renderBoard() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);
    const siteFilmList = this._boardContainer.querySelector(`.films-list`);

    if (this._boardFilms.length === 0) {
      siteFilmList.innerHTML = ``;
      this._renderNoFilm(siteFilmList);
      return;
    }

    this._renderFilms(siteFilmsListContainer, 0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
}
