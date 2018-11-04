module.exports = (json) => {
  return (req, res, next) => {
    for (let key in json) {
      if (!(key in req.body) || typeof req.body[key] !== json[key]) {
        return res.status(400).end()
      }
      if (json[key] === 'string' && !req.body[key]) {
        return res.status(400).end()
      }
    }
    next()
  }
};