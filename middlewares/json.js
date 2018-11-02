const middleware = data => (req, res, next) => {
  if (req.body === undefined) {
    return res.status(406).json({})
  }
  for (let key in data) {
    if (!(key in req.body) || typeof req.body[key] !== data[key]) {
      return res.status(400).json({})
    }
    if (data[key] === 'string' && !req.body[key]) {
      return res.status(400).json({})
    }
  }
  next()
};

module.exports = middleware;