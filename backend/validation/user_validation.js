const User = require('../models/User');

// Verify that the person handling the requests has the Admin role
const isAdmin = (req, res, next) => {
  try {
    User.findById(req.user.id).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      } else {
        if (user.role == 'admin') {
          next();
        } else {
          res
            .status(403)
            .send({ message: 'This request requires an Admin role' });
          return;
        }
      }
    });
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

module.exports = {
  isAdmin,
};
