// Imports
const router = require('express').Router();
const Project = require('../models/Project');
const Technology = require('../models/Technology');
// Token authentication
const { verifyToken } = require('../validation/auth_validation');
// CREATE Techs
router.post('/', async (req, res) => {
  try {
    const techObject = new Technology({
      tech_name: req.body.tech_name,
    });
    const savedTech = await techObject.save();
    res.json({ savedTech });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// GET ALL techs
router.get('/', async (req, res) => {
  try {
    const techs = await Technology.find({});
    res.json(techs);
  } catch (error) {
    res.status(500).json({ error });
  }
});
// GET tech by ID
router.get('/technology', async (req, res) => {
  const techId = req.header('id');
  try {
    const tech = await Technology.findOne({ _id: techId });
    res.json(tech);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE tech by ID
router.delete('/technology', async (req, res) => {
  try {
    const techToDelete = await Technology.findByIdAndDelete(req.header('id'));
    if (techToDelete) {
      res.json(techToDelete);
    } else {
      res
        .status(404)
        .send({ message: 'The Technology you want to delete does not exist' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error deleting Technology' });
  }
});

// Routes export
module.exports = router;
