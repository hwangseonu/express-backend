module.exports = (required_json) => function(req, res, next) {
  if (req.method === 'GET') return res.end();
  console.log(req.headers['content-type']);
  if (req.headers['content-type'] !== 'application/json') return res.status(406).end();

  for (let key in required_json) {
    if (!(key in req.body) || typeof(req.body[key]) !== required_json[key]) {
      return res.status(400).end();
    }
    if (required_json[key] === 'string' && !req.body[key]) {
      return res.status(400).end();
    }
  }
  next();
};
