import UserMenuView from "./view/user-menu.js";
import SiteFilter from "./view/filter.js";
import MoveListPresenter from "./presenter/move-list.js";
import FilmsModel from "./model/film.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {generateFilm, generateComment} from "./mock/film.js";
import {render, RenderPosition} from "./utils/render.js";

const FILM_COUNT = 18;

const films = new Array(FILM_COUNT).fill().map((element, id) => generateFilm(id));
const comments = new Array(FILM_COUNT).fill().map((element, id) => generateComment(id));

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

filmsModel.setFilms(films);
commentsModel.setComments(comments);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const moveListPresenter = new MoveListPresenter(siteMainElement, filmsModel, commentsModel);

render(siteHeaderElement, new UserMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteFilter(films), RenderPosition.BEFOREEND);
moveListPresenter.init();
