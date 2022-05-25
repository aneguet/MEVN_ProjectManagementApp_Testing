// Imports
const router = require('express').Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
// Token authentication
const { verifyToken } = require('../validation/auth_validation');
const { isAdmin } = require('../validation/user_validation');
const { isMemberLeaderOrAdmin } = require('../validation/project_validation');

// GET ALL projects (admin)
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error });
  }
});
// GET ALL projects by user id (the one requesting)
router.get('/byUser', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      //where member is the user (id) requesting
      members: { $elemMatch: { member_id: req.user.id } }, // elemMatch allows us to get the nested element members > member_id (array of objects)
    });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// GET Project by project id
router.get('/project', verifyToken, async (req, res) => {
  const projectId = req.header('id');
  try {
    const project = await Project.findOne({ _id: projectId });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// CREATE Project

router.post('/project', verifyToken, async (req, res) => {
  try {
    const projectObject = new Project({
      name: req.body.name,
      description: req.body.description,
      stakeholder: req.body.stakeholder,
      leader: req.user.id, // We set the user creating the project as the leader
      members: setMembers(req.body.members, req.user.id),
      technologies: req.body.technologies,
      time_schedule: req.body.time_schedule,
    });
    const savedProject = await projectObject.save();
    res.json(savedProject);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// UPDATE Project (only leaders and admins)
router.put(
  '/project',
  [verifyToken, isMemberLeaderOrAdmin],
  async (req, res) => {
    const projectId = req.header('id');
    let updatedProject = req.body;

    try {
      const projectToUpdate = await Project.findByIdAndUpdate(
        projectId,
        updatedProject
      );
      if (projectToUpdate) {
        res.json(updatedProject);
      } else {
        res
          .status(404)
          .send({ message: 'The project you want to update does not exist' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Error updating Project' });
    }
  }
);

// DELETE Project by ID
// It deletes the project and the project tasks
router.delete('/project', verifyToken, (req, res) => {
  let message_res = '';
  Project.findByIdAndDelete(req.header('id'))
    .then((data) => {
      if (data) {
        message_res = 'Project deleted';
      } else {
        res.status(500).send({ message: 'Error deleting Project' });
      }
    })
    .then(
      Task.deleteMany({
        project_id: req.header('id'),
      }).then((data) => {
        if (data) {
          res
            .status(201)
            .send({ message: message_res + ' and tasks deleted.' });
        } else {
          res.status(500).send({ message: 'Error deleting Tasks' });
        }
      })
    )
    .catch((err) =>
      res.status(500).send({ message: 'Error deleting Project' })
    );
});

// Extra functions

// sets project members: even if provided or not, it always sets the project leader as a member
let setMembers = (reqMembers, reqUserId) => {
  if (!reqMembers) {
    // The user didn't pick any member
    let auxArr = [];
    auxArr.push({
      member_id: reqUserId,
      project_roles: 'Leader',
    });
    return auxArr;
  } else {
    for (let i = 0; i < reqMembers.length; i++) {
      // We set the default project role for every added member
      reqMembers[i].project_roles = reqMembers[i].project_roles
        ? reqMembers[i].project_roles
        : ['Timefly member'];
    }
    // The user picked at least one member
    reqMembers.push({
      member_id: reqUserId,
      project_roles: 'Leader',
    });
    return reqMembers;
  }
};

// More than one leader as member?
// check that the user is not setting more than one leader
let checkMembersLeader = (members) => {
  let leadersNum = 0;
  for (var i = 0; i < members.length; i++) {
    for (var j = 0; j < members[i].project_roles.length; j++) {
      if (
        members[i].project_roles[j] == 'Leader' ||
        members[i].project_roles[j] == 'leader'
      ) {
        leadersNum++;
      }
    }
  }
  if (leadersNum > 1) {
    res.status(403).send({
      message: 'There can only be one leader in the project',
    });
  }
};

// Routes export
module.exports = router;
