exports.conversionFunction = (objArr, keyName) => {
  const newObjArr = objArr.map((item) => {
    item[keyName] = parseInt(item[keyName]);
    return item;
  });
  return newObjArr;
};

exports.renameKey = (obj, changeKey, newKey) => {
  const newObj = { ...obj };
  newObj[newKey] = newObj[changeKey];
  delete newObj[changeKey];
  return newObj;
};

exports.selectArticleByIdQueryStr = `
SELECT 
articles.author,
articles.title, 
articles.article_id, 
articles.body,
articles.topic, 
articles.created_at, 
articles.votes,
COUNT(comments.comment_id)::INT AS comment_counts
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id
`;

exports.selectArticlesQueryStr = `
SELECT 
articles.author,
articles.title, 
articles.article_id, 
articles.topic, 
articles.created_at, 
articles.votes,
COUNT(comments.comment_id)::INT AS comment_counts
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
`;
