import AbstractView from "./abstract.js";
import {convertsDate, convertMillisecondsDatePopup} from "../utils/film.js";

const createGenresTemplate = (genre) => {
  const genreTemplate = genre.map((element) => {
    return `<span class="film-details__genre">${element}</span>`;
  }).join(` `);
  return genreTemplate;
};

const createGenreContainerTemplate = (genre) => {
  return (
    `<td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
    <td class="film-details__cell">
      ${createGenresTemplate(genre)}
    </td>`
  );
};

const createFilmDetailsControlsTemplate = (watchlist, history, favorites) => {
  const watchlistBool = watchlist ? `checked` : ``;
  const watchedBool = history ? `checked` : ``;
  const favoritesBool = favorites ? `checked` : ``;
  return (`
    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistBool}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
    
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedBool}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
    
      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoritesBool}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>
    `);
};

const createCommentsTemplate = (comments) => {
  const commentsTemplate = comments.map((comment) => {
    const {emotion, dueDate, author, message} = comment;
    const convertedDate = convertsDate(dueDate);
    return (
      `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${convertedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
    );
  }).join(` `);
  return commentsTemplate;
};

const createPopupTemplate = (film) => {
  const {watchlist, history, favorites, poster, name, originalName, director, writers, actors, releaseDate, runtime, country, genre, description, rating, ageRatings, comments, numberСomments} = film;
  const convertDate = convertMillisecondsDatePopup(releaseDate);
  const filmDetailsControlsTemplate = createFilmDetailsControlsTemplate(watchlist, history, favorites);
  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${originalName}">
  
            <p class="film-details__age">${ageRatings}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${originalName}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${convertDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                ${createGenreContainerTemplate(genre)}
              </tr>
            </table>
  
            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>
  
        ${filmDetailsControlsTemplate}

      </div>
  
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${numberСomments}</span></h3>
  
          <ul class="film-details__comments-list">
            ${createCommentsTemplate(comments)}
          </ul>
  
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class Popup extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistCickHandler = this._watchlistCickHandler.bind(this);
    this._watchedCickHandler = this._watchedCickHandler.bind(this);
    this._favoriteCickHandler = this._favoriteCickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _watchlistCickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistCickHandler);
  }

  _watchedCickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedCickHandler);
  }

  _favoriteCickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteCickHandler);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement;

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }
}

