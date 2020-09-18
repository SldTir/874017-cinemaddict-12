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
    const index = this._comments.findIndex((comment) => comment.filmId === data.comment.movie.id);
    const commentsTarget = this._comments[index];
    commentsTarget.comment = [];
    data.comment.comments.forEach((element) => commentsTarget.comment.push(element));
    this._notify(updateType, update);
  }

  deleteComment(updateType, update, commentId) {
    const index = this._comments.findIndex((comment) => comment.filmId === update.filmId);
    const commentsTarget = this._comments[index].comment;
    const commentsDelitingIndex = commentsTarget.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[index].comment.splice(commentsDelitingIndex, 1);
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

  static adaptNewComment(comment) {
    return {
      comment
    };
  }

  static adaptToServer(comment) {
    return {
      "comment": comment.message,
      "date": comment.dueDate,
      "emotion": comment.emotion,
    };
  }
}
