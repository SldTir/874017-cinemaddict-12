import Observer from "../utils/observer.js";
export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      Films.adaptToClient(update),
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          watchlist: film.user_details.watchlist,
          history: film.user_details.already_watched,
          favorites: film.user_details.favorite,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          country: film.film_info.release.release_country,
          name: film.film_info.title,
          originalName: film.film_info.alternative_title,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          releaseDate: film.film_info.release.date,
          runtime: film.film_info.runtime,
          genre: film.film_info.genre,
          numberСomments: film.comments.length,
          description: film.film_info.description,
          ageRatings: film.film_info.age_rating,
          watchingDate: film.user_details.watching_date,
        });

    delete adaptedFilm.user_details;
    delete adaptedFilm.film_info;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const addaptedFilm =
        {
          "user_details": {
            "already_watched": film.history,
            "favorite": film.favorites,
            "watching_date": film.watchingDate,
            "watchlist": film.watchlist,
          },
          "film_info": {
            "actors": film.actors,
            "age_rating": film.ageRatings,
            "alternative_title": film.originalName,
            "description": film.description,
            "director": film.director,
            "genre": film.genre,
            "poster": film.poster,
            "release": {
              "date": film.releaseDate,
              "release_country": film.country,
            },
            "runtime": film.runtime,
            "title": film.name,
            "total_rating": film.rating,
            "writers": film.writers,
          },
          "comments": film.comments,
          "id": film.id,
        };

    return addaptedFilm;
  }
}

