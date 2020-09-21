import AbstractView from "./abstract.js";

const createsUserMenu = (films) => {
  const countMovies = films.length;
  return (
    `<p>${countMovies} movies inside</p>`
  );
};

export default class FooterStat extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createsUserMenu(this._films);
  }
}
