const { error } = require("winston");
const mongoose = require('mongoose');

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)){
    error('Invalid param ID.')
    return res.status(404).send('Invalid param ID.');
  }

  next();
}
