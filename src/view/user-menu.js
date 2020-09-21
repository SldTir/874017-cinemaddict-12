import AbstractView from "./abstract.js";
import {calculatesRank} from "../utils/statistics.js";


const createsUserMenu = (films) => {
  const rank = calculatesRank(films.length);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserMenu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createsUserMenu(this._films);
  }
}
