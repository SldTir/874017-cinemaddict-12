import UserMenuView from "./view/user-menu.js";
import MoveListPresenter from "./presenter/move-list.js";
import FilmsModel from "./model/film.js";
import CommentsModel from "./model/comments.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import StatsView from "./view/stats.js";
import {UpdateType, MenuItem} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import Api from "./api.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIE_LIST:
      break;
    case MenuItem.STATISTICS:
      break;
  }
};

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterModel = new FilterModel();

const statsComponent = new StatsView();

const moveListPresenter = new MoveListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);

render(siteHeaderElement, new UserMenuView(), RenderPosition.BEFOREEND);
filterPresenter.init();

moveListPresenter.init();

const getCommentsApi = (updateType) => {
  const films = filmsModel.getFilms();
  films.forEach((film) => {
    api.getComments(film.id)
      .then((comment) => {
        commentsModel.setComments(updateType, comment, films.length);
      });
  });
};

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    filterPresenter.init();
    getCommentsApi(UpdateType.INIT);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

render(siteMainElement, statsComponent.getElement(), RenderPosition.BEFOREEND);

