import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL_MOVIES]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.watchlist === true),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.history === true),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.favorites === true),
};
