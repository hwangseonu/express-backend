module.exports = (err, req, res, next) => {
  const status = err.status;
  res.status(status).json(err);
  next();
};
