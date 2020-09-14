import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comment, filmLength) {
    this._comments.push(comment);
    if (this._comments.length === filmLength) {
      this._notify(updateType);
    }
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update, data) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    const commentsTarget = this._comments[index];
    commentsTarget.comments.push(data);

    this._notify(updateType, update);
  }

  deleteComment(updateType, update, id) {
    const numberId = Number(id);
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    const commentsTarget = this._comments[index];
    const commentsDelitingIndex = commentsTarget.comments.findIndex((comment) => comment.id === numberId);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[index].comments.splice(commentsDelitingIndex, 1);

    this._notify(updateType, update);
  }

  static adaptToClient(comment, filmId) {
    return {
      comment,
      description: ``,
      emoji: null,
      filmId,
      url: ``,
    };
  }
}
