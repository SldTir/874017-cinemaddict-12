import UserMenuView from "./view/user-menu.js";
import MoveListPresenter from "./presenter/move-list.js";
import FilmsModel from "./model/film.js";
import CommentsModel from "./model/comments.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import StatsView from "./view/stats.js";
import FooterStatView from "./view/footer-statistics.js";
import {UpdateType, MenuItem} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import Api from "./api.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatElement = document.querySelector(`.footer__statistics`);

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterModel = new FilterModel();


const moveListPresenter = new MoveListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);

let statisticsComponent = null;
let userMenuComponennt = null;
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIE_LIST:
      moveListPresenter.destroy();
      moveListPresenter.init();
      remove(statisticsComponent);
      remove(userMenuComponennt);
      break;
    case MenuItem.STATISTICS:
      moveListPresenter.destroy();
      remove(statisticsComponent);
      statisticsComponent = new StatsView(filmsModel.getFilms());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      remove(userMenuComponennt);
      userMenuComponennt = new UserMenuView(filmsModel.getFilms());
      render(siteHeaderElement, userMenuComponennt, RenderPosition.BEFOREEND);
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);
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
    render(footerStatElement, new FooterStatView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

