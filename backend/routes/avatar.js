// Imports
const router = require('express').Router();

const Avatar = require('../models/Avatar');

// CREATE Avatar
router.post('/', async (req, res) => {
  try {
    const avatarObject = new Avatar({
      img_link: req.body.img_link,
    });
    const savedAvatar = await avatarObject.save();
    res.json({ savedAvatar });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// GET ALL avatars
router.get('/', async (req, res) => {
  try {
    const avatars = await Avatar.find({});
    res.json(avatars);
  } catch (error) {
    res.status(500).json({ error });
  }
});
// GET  random avatar
router.get('/randomAvatar', async (req, res) => {
  try {
    const avatars = await Avatar.find({});
    var randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    res.json(randomAvatar);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Routes export
module.exports = router;
