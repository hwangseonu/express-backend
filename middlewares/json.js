const middleware = data => (req, res, next) => {
  if (req.body === undefined) {
    return res.status(406).end()
  }
  for (let key in data) {
    if (!(key in req.body) || typeof req.body[key] !== data[key]) {
      return res.status(400).end()
    }
    if (data[key] === 'string' && !req.body[key]) {
      return res.status(400).end()
    }
  }
  next()
};

module.exports = middleware;