exports.formatTopicsData = (topicData) => {
  const formattedTopicsData = topicData.map((topic) => {
    return [topic.slug, topic.description];
  });
  return formattedTopicsData;
};

exports.formatUsersData = (userData) => {
  const formattedUsersData = userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
  return formattedUsersData;
};

exports.formatArticlesData = (articleData) => {
  const formattedArticlesData = articleData.map((article) => {
    return [
      article.title,
      article.topic,
      article.author,
      article.body,
      article.created_at,
      article.votes,
    ];
  });
  return formattedArticlesData;
};

exports.formatCommentsData = (commentData) => {
  const formattedCommentsData = commentData.map((comment) => {
    return [
      comment.body,
      comment.votes,
      comment.author,
      comment.article_id,
      comment.created_at,
    ];
  });
  return formattedCommentsData;
};

exports.checkSortByExists = (sort_by) => {
  if (sort_by === undefined) return "created_at";
  const validInput = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (validInput.includes(sort_by) === true) {
    return sort_by;
  }
  return Promise.reject({ status: 400, msg: "Bad Request" });
};

exports.checkOrderExists = (order) => {
  if (order === undefined) return "DESC";
  const validInput = ["asc", "desc"];
  if (validInput.includes(order) === true) {
    return order.toUpperCase();
  }
  return Promise.reject({ status: 400, msg: "Bad Request" });
};

exports.dbSearch = (column, search) => {
  const result = `WHERE ${column} @@ to_tsquery('${search}')`; //---controlling text search, lookup and recheck in postgres docs!!!
  return result;
};
