// We switch to the test DB
process.env.NODE_ENV = 'test';
// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

//clean up the database before and after each test
// before((done) => {
beforeEach((done) => {
  User.deleteMany({}, function (err) {});
  Project.deleteMany({}, function (err) {});
  Task.deleteMany({}, function (err) {});
  done();
});
// after((done) => {
afterEach((done) => {
  User.deleteMany({}, function (err) {});
  Project.deleteMany({}, function (err) {});
  Task.deleteMany({}, function (err) {});
  done();
});
