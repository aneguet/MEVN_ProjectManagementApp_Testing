const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ** SCHEMAS VALIDATION
// Validate registration
const registerValidation = (data) => {
  delete data.password_confirm; // we delete password confirm from the array

  const schema = Joi.object({
    role: Joi.string().valid('admin', 'user'), // Only accepts 'admin' or 'user'
    first_name: Joi.string().min(2).max(255).required(),
    last_name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(5).max(30).required(),
    phone: Joi.string().min(7).max(15),
    avatar: Joi.string(),
    weekly_hours: Joi.number().min(0), // Number type includes decimals
  });

  return schema.validate(data);
};
// Validate login
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(5).max(30).required(),
  });
  return schema.validate(data);
};

// Verify TOKEN JWT
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token'); // we'll get the token from the login response, we'll have to create this header when needed
  // in a specific request
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    // verifies that the token matches the secret token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // we save in req.user the user payload that we defined when logging in > email and id
    next(); // we pass control to the next request in the stack
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  verifyToken,
};
