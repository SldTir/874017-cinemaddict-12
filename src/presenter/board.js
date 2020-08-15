import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import FilmView from "../view/film.js";
import PopupView from "../view/popup.js";
import NoFilmView from "../view/no-film.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import {render, RenderPosition} from "./utils/render.js";


const FILM_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._filmComponent = new FilmView();
    this._popupComponent = new PopupView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
   
    this._renderBoard();
  }

  _renderSort() {

  }

  _renderFilm(from, to) {
    
  }

  _renderNoFilm() {
    
  }

  _renderShowMoreButton() {
    
  }

  _renderBoard(boardContainer) {
    const filmsContainerComponent = this._boardComponent;
    render(boardContainer, filmsContainerComponent, RenderPosition.BEFOREEND);

    const siteFilmsListContainer = boardContainer.querySelector(`.films-list__container`);
    const siteFilmList = boardContainer.querySelector(`.films-list`);

    if (this._boardFilms.length === 0) {
      siteFilmList.innerHTML = ``;
      render(siteFilmList, this._noFilmComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._boardFilms
    .slice(0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => this._renderFilm(siteFilmsListContainer, boardFilm));

    if (this._boardTasks.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
}
