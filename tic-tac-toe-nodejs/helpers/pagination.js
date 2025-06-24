module.exports = function ({ params }) {
  let { pageSize = 10, pageNumber = 1 } = params;

  if (pageSize) pageSize = parseInt(pageSize);
  if (pageNumber) parseInt(pageNumber);

  let skip = (pageNumber - 1) * pageSize;
  let limit = pageSize;

  return { limit, skip };
};
