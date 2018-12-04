const BadRequestError = require('../errors/BadRequestError');

module.exports = (required_json) => function(req, res, next) {
  if (req.method === 'GET') return res.end();
  console.log(req.headers['content-type']);
  if (req.headers['content-type'] !== 'application/json') return res.status(406).end();

  try {
    for (let key in required_json) {
      if (!(key in req.body) || typeof(req.body[key]) !== required_json[key]) {
        throw new BadRequestError();
      }
      if (required_json[key] === 'string' && !req.body[key]) {
        throw new BadRequestError();
      }
    }
  } catch (error) {
    next(error);
    return;
  }
  next();
};
