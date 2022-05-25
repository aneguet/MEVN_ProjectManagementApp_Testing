// Imports
const router = require('express').Router();
// Token authentication
const { verifyToken } = require('../validation/auth_validation');
const { isAdmin } = require('../validation/user_validation');
const Task = require('../models/Task');

// GET ALL Tasks · Admin
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error });
  }
});
// GET ALL Tasks by project and user id · User homepage

router.get('/byProjectAndUser', verifyToken, async (req, res) => {
  const projectId = req.header('id');
  try {
    const tasks = await Task.find({
      project_id: projectId,
      assigned_to: req.user.id,
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// GET ALL Tasks by project · Project page
router.get('/byProject', verifyToken, async (req, res) => {
  const projectId = req.header('id');
  try {
    const tasks = await Task.find({ project_id: projectId });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error });
  }
});
// GET Task by task id
router.get('/task', verifyToken, async (req, res) => {
  const taskId = req.header('id');
  try {
    const task = await Task.find({
      _id: taskId,
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error });
  }
});
// CREATE Task
router.post('/task', verifyToken, async (req, res) => {
  try {
    const taskObject = new Task({
      project_id: req.body.project_id,
      name: req.body.name,
      description: req.body.description,
      // by default, tasks will be assigned to the leader, in case they don't pick another member
      assigned_to: req.body.assigned_to ? req.body.assigned_to : req.user.id,
      hours_allocated: req.body.hours_allocated,
      hours_used: req.body.hours_used ? req.body.hours_used : 0,
      task_status: req.body.task_status ? req.body.task_status : 'Todo',
    });
    const savedTask = await taskObject.save();
    res.json(savedTask);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// UPDATE Task
router.put('/task', verifyToken, async (req, res) => {
  const taskId = req.header('id');
  let updatedTask = req.body;
  try {
    const taskToUpdate = await Task.findByIdAndUpdate(taskId, updatedTask);
    if (taskToUpdate) {
      res.json(updatedTask);
    } else {
      res
        .status(404)
        .send({ message: 'The task you want to update does not exist' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error updating Project' });
  }
});
// DELETE Task
router.delete('/task', verifyToken, async (req, res) => {
  try {
    const taskToDelete = await Task.findByIdAndDelete(req.header('id'));
    if (taskToDelete) {
      res.json(taskToDelete);
    } else {
      res
        .status(404)
        .send({ message: 'The Task you want to delete does not exist' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error deleting Project' });
  }
});

// Routes export
module.exports = router;
