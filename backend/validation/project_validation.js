const User = require('../models/User');
const Project = require('../models/Project');
// A project can only be updated/deleted by the leader/admin

const isUserMember = (req, res, next) => {
  try {
    Project.findOne({
      //where user is member
      _id: req.body.project_id,
      members: { $elemMatch: { member_id: req.user.id } },
    }).exec((err, isMember) => {
      if (isMember) {
        next();
      } else {
        // User is not member
        res.status(403).send({
          message: 'Only a member of this project can create a task',
        });
        return;
      }
    });
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};
const isMemberLeaderOrAdmin = (req, res, next) => {
  try {
    Project.findOne({
      //where leader is the user requesting
      leader: req.user.id,
    }).exec((err, isLeader) => {
      User.findOne({
        //where leader is the user requesting
        _id: req.user.id,
        role: 'admin',
      }).exec((err, isAdmin) => {
        if (isLeader || isAdmin) {
          next();
        } else {
          // User is not leader or admin
          res.status(403).send({
            message: 'You must be a leader or admin of this project',
          });
          return;
        }
      });
    });
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

const isUserMemberOrAdmin = (req, res, next) => {
  try {
    Project.findOne({
      //where user is member
      _id: req.header('id'),
      members: { $elemMatch: { member_id: req.user.id } },
    }).exec((err, isMember) => {
      User.findOne({
        //where leader is the user requesting
        _id: req.user.id,
        role: 'admin',
      }).exec((err, isAdmin) => {
        if (isMember || isAdmin) {
          next();
        } else {
          // User is not leader or admin
          res.status(403).send({
            message: 'You must to be a member or admin of this project',
          });
          return;
        }
      });
    });
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

module.exports = { isMemberLeaderOrAdmin, isUserMember, isUserMemberOrAdmin };
