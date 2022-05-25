// Installed dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// ** Swagger · http://localhost:4000/api/docs/
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
// Swagger Setup
const swaggerDefinition = yaml.load('./swagger.yaml');

// Creates express app
const app = express();

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition, {
    customSiteTitle: 'Timefly · API',
  })
);
require('dotenv-flow').config(); // Imports the port settings

// Handle CORS  (for Heroku to work) and Middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // If using js .fetch and not axios
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  // We add 'id' to the header params to be able to send it from vue when needed
  res.header(
    'Access-Control-Allow-Headers',
    'auth-token, id, Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(bodyParser.json());

// Connection to the database
mongoose
  .connect(
    //connection string
    process.env.DBHOST,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((err) => console.log(err));

// ROUTES
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to backend' });
});

// Import and Use
const authRoutes = require('./routes/user');
app.use('/api/users', authRoutes);
const projectRoutes = require('./routes/project');
app.use('/api/projects', projectRoutes);
const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);
const technologyRoutes = require('./routes/technology');
app.use('/api/technologies', technologyRoutes);
const avatarRoutes = require('./routes/avatar');
app.use('/api/avatars', avatarRoutes);

// PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  // We listen to the port
  console.log('Server is running on port ' + PORT);
});

module.exports = app; //Exports app as module
