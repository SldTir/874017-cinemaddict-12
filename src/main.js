import UserMenuView from "./view/user-menu.js";
import MoveListPresenter from "./presenter/move-list.js";
import FilmsModel from "./model/film.js";
import CommentsModel from "./model/comments.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import {UpdateType} from "./const.js";
import {generateComment} from "./mock/film.js";
import {render, RenderPosition} from "./utils/render.js";
import Api from "./api.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const FILM_COUNT = 20;
const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);
const comments = new Array(FILM_COUNT).fill().map((element, id) => generateComment(id));

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

commentsModel.setComments(comments);


const moveListPresenter = new MoveListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new UserMenuView(), RenderPosition.BEFOREEND);
filterPresenter.init();
moveListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
