import UserMenuView from "./view/user-menu.js";
import MoveListPresenter from "./presenter/move-list.js";
import FilmsModel from "./model/film.js";
import CommentsModel from "./model/comments.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import {generateFilm, generateComment} from "./mock/film.js";
import {render, RenderPosition} from "./utils/render.js";
import Api from "./api.js";

const FILM_COUNT = 15;
const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const films = new Array(FILM_COUNT).fill().map((element, id) => generateFilm(id));
const comments = new Array(FILM_COUNT).fill().map((element, id) => generateComment(id));

api.getFilms().then((films) => {
  console.log(films);
});

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

filmsModel.setFilms(films);
commentsModel.setComments(comments);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const moveListPresenter = new MoveListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new UserMenuView(), RenderPosition.BEFOREEND);
filterPresenter.init();
moveListPresenter.init();
