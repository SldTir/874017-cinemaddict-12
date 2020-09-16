import he from "he";
import SmartView from "./smart.js";
import {convertsDate, convertMillisecondsDatePopup} from "../utils/film.js";
import {EmojiМessage} from "../const.js";

const createGenresTemplate = (genre) => {
  const genreTemplate = genre.map((element) => {
    return `<span class="film-details__genre">${element}</span>`;
  }).join(` `);
  return genreTemplate;
};

const createGenreContainerTemplate = (genre) => {
  const genreFlag = genre.length > 1 ? `Genres` : `Genre`;
  return (
    `<td class="film-details__term">${genreFlag}</td>
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
  const commentsTemplate = comments.map((element) => {
    const {id, emotion, date, author, comment, isDeleting} = element;
    const convertedDate = convertsDate(date);
    const textButton = isDeleting ? `Deleting...` : `Delete`;
    const disabledButton = isDeleting ? `disabled` : ``;
    return (
      `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${convertedDate}</span>
          <button class="film-details__comment-delete" data-id="${id}" ${disabledButton}>${textButton}</button>
        </p>
      </div>
    </li>`
    );
  }).join(` `);
  return commentsTemplate;
};

const createCommentsWrapTemplate = (comments) => {
  const {description, emoji, isEmoji} = comments;
  const emojiTemplate = isEmoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;
  const numberСomments = comments.comment.length;
  const textareaDisabledFlag = isEmoji ? `` : `disabled`;

  return (`
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${numberСomments}</span></h3>
  
    <ul class="film-details__comments-list">
      ${createCommentsTemplate(comments.comment)}
    </ul>
  
    <div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label" data-emoji="${emoji}">
        ${emojiTemplate}
      </div>
  
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${textareaDisabledFlag}>${he.encode(description)}</textarea>
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
  `);
};

const createPopupTemplate = (film, comments) => {
  const {watchlist, history, favorites, poster, name, originalName, director, writers, actors, releaseDate, runtime, country, genre, description, rating, ageRatings} = film;
  const convertDate = convertMillisecondsDatePopup(releaseDate);
  const filmDetailsControlsTemplate = createFilmDetailsControlsTemplate(watchlist, history, favorites);
  const commentsWraperTemplate = createCommentsWrapTemplate(comments);
  const genresTemplate = createGenreContainerTemplate(genre);
  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${poster}" alt="${originalName}">
  
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
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
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
                ${genresTemplate}
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
        ${commentsWraperTemplate}
      </div>
    </form>
  </section>`
  );
};

export default class Popup extends SmartView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._data = Popup.parseCommentsToData(this._comments);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistCickHandler = this._watchlistCickHandler.bind(this);
    this._watchedCickHandler = this._watchedCickHandler.bind(this);
    this._favoriteCickHandler = this._favoriteCickHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._addComment = this._addComment.bind(this);
    this.updateData = this.updateData.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
  }

  reset(comments) {
    this.updateData(
        Popup.parseCommentsToData(comments)
    );
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._data);
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

  _emojiListClickHandler(evt) {
    const imgContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const targetEmoji = evt.currentTarget.getAttribute(`for`).split(`-`)[1];
    imgContainer.innerHTML = ``;
    this.updateData({isEmoji: true, emoji: targetEmoji}, false);
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    commentInput.placeholder = ``;
    commentInput.placeholder = EmojiМessage[targetEmoji];
  }

  _addComment(evt) {
    if (evt.ctrlKey === true && evt.key === `Enter`) {
      const newCommentContainer = this.getElement().querySelector(`.film-details__new-comment`);
      const textarea = newCommentContainer.querySelector(`.film-details__comment-input`);
      const emotion = newCommentContainer.querySelector(`.film-details__add-emoji-label`).getAttribute(`data-emoji`);
      const dueDate = new Date().toISOString();
      const message = textarea.value ? textarea.value : textarea.getAttribute(`placeholder`);
      textarea.setAttribute(`disabled`, ``);
      this._callback.ctrlEnterKeydown({
        emotion,
        dueDate,
        message,
      });
    }
  }

  restoreHandlers() {
    this.setSubmitHandler(this._callback.ctrlEnterKeydown);
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setSubmitHandler(callback) {
    this._callback.ctrlEnterKeydown = callback;
    const emojiLabel = this.getElement().querySelector(`.film-details__emoji-list`).querySelectorAll(`label`);
    emojiLabel.forEach((element) => element.addEventListener(`click`, this._emojiListClickHandler));

    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._addComment);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const target = evt.target;
    const idComment = target.getAttribute(`data-id`);
    target.setAttribute(`disabled`, ``);
    target.textContent = `Deleting...`;
    this._callback.deleteClick(idComment);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    const deleteButton = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButton.forEach((element) => element.addEventListener(`click`, this._commentDeleteHandler));
  }

  static parseCommentsToData(comments) {
    return Object.assign(
        {},
        comments,
        {
          isEmoji: comments.emoji !== null,
        }
    );
  }
}

