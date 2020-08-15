import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import FilmView from "../view/film.js";
import PopupView from "../view/popup.js";
import NoFilmView from "../view/no-film.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import {render, RenderPosition} from "./utils/render.js";

export default Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._filmComponent = new FilmView();
    this._popupComponent = new PopupView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }
}