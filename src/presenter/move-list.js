import BoardView from "../view/board.js";
import FilmList from "../view/film-list.js";
import NoFilmView from "../view/no-film.js";
import SortView from "../view/sort.js";
import LoadingView from "../view/loading.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmPresenter from "./film.js";
import {filter} from "../utils/filter.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmDate, sortFilmRating} from "../utils/film.js";
import {SortType, UpdateType, UserAction} from "../const.js";

const FILM_COUNT_PER_STEP = 5;

export default class MoveList {
  constructor(boardContainer, filmsModel, commentsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmList();
    this._noFilmComponent = new NoFilmView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._filmListComponent);
    remove(this._boardContainer);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice();
    const filtredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmRating);
    }
    return filtredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _handleModelChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update, data) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(data, update.filmId)
        .then((response) => {
          this._commentsModel.addComment(updateType, update, response);
        })
        .catch(() => {
          this._filmPresenter[update.filmId].setViewState(actionType);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(data)
        .then(() => {
          this._commentsModel.deleteComment(updateType, update, data);
        })
        .catch(() => {
          this._filmPresenter[update.filmId].setViewState(actionType, data);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        const indexFilm = this._getFilms().findIndex((film) => film.id === data.filmId);
        this._filmPresenter[data.filmId].init(this._getFilms()[indexFilm], data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(container, film, comment) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelChange);
    filmPresenter.init(film, comment);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilms(container, films, comments) {
    films.forEach((film) => {
      const commentIndex = comments.findIndex((comment) => comment.filmId === film.id);
      this._renderFilm(container, film, comments[commentIndex]);
    });
  }

  _renderNoFilm() {
    render(this._boardComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmList() {
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);

    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);
    const comments = this._getComments();

    this._renderFilms(siteFilmsListContainer, films, comments);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._boardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.length;
    this._renderSort();

    if (this._getFilms().length === 0) {
      remove(this._filmListComponent);
      this._renderNoFilm();
      return;
    }

    const comments = this._getComments();

    remove(this._noFilmComponent);
    this._renderFilmList();

    const filmListComntainer = this._filmListComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilms(filmListComntainer, films.slice(0, Math.min(filmCount, this._renderedFilmCount)), comments);

    if (this._getFilms().length > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }
}
