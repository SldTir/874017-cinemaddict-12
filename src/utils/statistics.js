import moment from "moment";

export const countCompletedFilmInDateRange = (films, dateFrom, dateTo) => {
  return films.reduce((counter, film) => {
    if (film.dueDate === null) {
      return counter;
    }

    if (
      moment(film.dueDate).isSame(dateFrom) ||
      moment(film.dueDate).isBetween(dateFrom, dateTo) ||
      moment(film.dueDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);
};
