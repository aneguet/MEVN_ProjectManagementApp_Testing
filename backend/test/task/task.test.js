process.env.NODE_ENV = 'test';
// Import models
const User = require('../../models/User');
const Task = require('../../models/Task');
const Project = require('../../models/Project');
// Chai imports
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../app');

// Clean up the database before and after each test
beforeEach((done) => {
  User.deleteMany({}, function (err) {});
  Project.deleteMany({}, function (err) {});
  Task.deleteMany({}, function (err) {});
  done();
});

afterEach((done) => {
  User.deleteMany({}, function (err) {});
  Project.deleteMany({}, function (err) {});
  Task.deleteMany({}, function (err) {});
  done();
});
describe('/Tasks', () => {
  //--------------------------  Register admin User, Login, Create project, Create Task and verify 1 Task in the DB by Getting all tasks (admin) ---------------------------
  it('Register admin User, Login, Create project, Create Task and verify 1 Task in the DB by Getting all tasks (admin)', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let project = {
              name: 'Project 1',
              description: 'Lorem ipsum sit amet',
              stakeholder: 'Lorem ipsum',
            };
            // 3) Create project
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('stakeholder');
                res.body.should.have.property('leader');
                res.body.should.have.property('members');
                res.body.should.have.property('technologies');
                res.body.should.have.property('time_schedule');
                let newProjectId = res.body._id; // We save the new project ID
                // 4) Create Task
                let task = {
                  project_id: newProjectId,
                  name: 'Task 1 of Project 1',
                  description: 'Lorem ipsum sit amet',
                };
                chai
                  .request(server)
                  .post('/api/tasks/task')
                  .set({ 'auth-token': token })
                  .send(task)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.project_id).to.be.equal(newProjectId);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('assigned_to');
                    res.body.should.have.property('hours_allocated');
                    res.body.should.have.property('hours_used');
                    res.body.should.have.property('task_status');
                    // 5) Get all tasks (admin)
                    chai
                      .request(server)
                      .get('/api/tasks')
                      .set({ 'auth-token': token })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.eql(1);
                        done();
                      });
                  });
              });
          });
      });
  });
  //--------------------------  Register normal User, Login and try to Get all tasks without the permission (admin) ---------------------------
  it('Register normal User, Login and try to Get all tasks without the permission', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      role: 'user', // not necessary
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            // 3) Get all tasks (admin request)
            chai
              .request(server)
              .get('/api/tasks')
              .set({ 'auth-token': token })
              .end((err, res) => {
                expect(res.status).to.be.equal(403);
                expect(res.body.message).to.be.equal(
                  'This request requires an Admin role'
                );
                done();
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create project, Create Task and verify 1 Task in the DB by Getting all tasks by user and project ---------------------------
  it('Register User, Login, Create project, Create Task and verify 1 Task in the DB by Getting all tasks by user and project', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let project = {
              name: 'Project 1',
              description: 'Lorem ipsum sit amet',
              stakeholder: 'Lorem ipsum',
            };
            // 3) Create project
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('stakeholder');
                res.body.should.have.property('leader');
                res.body.should.have.property('members');
                res.body.should.have.property('technologies');
                res.body.should.have.property('time_schedule');
                let newProjectId = res.body._id; // We save the new project ID
                // 4) Create Task
                let task = {
                  project_id: newProjectId,
                  name: 'Task 1 of Project 1',
                  description: 'Lorem ipsum sit amet',
                };
                chai
                  .request(server)
                  .post('/api/tasks/task')
                  .set({ 'auth-token': token })
                  .send(task)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.project_id).to.be.equal(newProjectId);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('assigned_to');
                    res.body.should.have.property('hours_allocated');
                    res.body.should.have.property('hours_used');
                    res.body.should.have.property('task_status');
                    // 5) Get tasks by project and user
                    chai
                      .request(server)
                      .get('/api/tasks/byProjectAndUser')
                      .set({ 'auth-token': token })
                      .set({ id: newProjectId })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.eql(1);
                        done();
                      });
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project, Create Task, Update Task and get Task by Id ---------------------------
  it('Register User, Login, Create Project, Create Task, Update Task and get Task by Id', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let project = {
              name: 'Project 1',
              description: 'Lorem ipsum sit amet',
              stakeholder: 'Lorem ipsum',
            };
            // 3) Create project
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('stakeholder');
                res.body.should.have.property('leader');
                res.body.should.have.property('members');
                res.body.should.have.property('technologies');
                res.body.should.have.property('time_schedule');
                let newProjectId = res.body._id; // We save the new project ID
                // 4) Create Task
                let task = {
                  project_id: newProjectId,
                  name: 'Task 1 of Project 1',
                  description: 'Lorem ipsum sit amet',
                };
                chai
                  .request(server)
                  .post('/api/tasks/task')
                  .set({ 'auth-token': token })
                  .send(task)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.project_id).to.be.equal(newProjectId);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('assigned_to');
                    res.body.should.have.property('hours_allocated');
                    res.body.should.have.property('hours_used');
                    res.body.should.have.property('task_status');
                    let newTaskId = res.body._id; // We save the new task ID
                    // 5) Update Task
                    let updatedTask = {
                      name: 'Task 1 of Project 1 Updated',
                    };
                    chai
                      .request(server)
                      .put('/api/tasks/task')
                      .set({ 'auth-token': token })
                      .set({ id: newTaskId })
                      .send(updatedTask)
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body.name).to.be.equal(updatedTask.name);
                        done();
                      });
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project, Create Task, Delete Task and verify 0 by getting All tasks by Project Id ---------------------------
  it('Register User, Login, Create Project, Create Task, Delete Task and verify 0 by getting All tasks by Project Id', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let project = {
              name: 'Project 1',
              description: 'Lorem ipsum sit amet',
              stakeholder: 'Lorem ipsum',
            };
            // 3) Create project
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('stakeholder');
                res.body.should.have.property('leader');
                res.body.should.have.property('members');
                res.body.should.have.property('technologies');
                res.body.should.have.property('time_schedule');
                let newProjectId = res.body._id; // We save the new project ID
                // 4) Create Task
                let task = {
                  project_id: newProjectId,
                  name: 'Task 1 of Project 1',
                  description: 'Lorem ipsum sit amet',
                };
                chai
                  .request(server)
                  .post('/api/tasks/task')
                  .set({ 'auth-token': token })
                  .send(task)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.project_id).to.be.equal(newProjectId);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('assigned_to');
                    res.body.should.have.property('hours_allocated');
                    res.body.should.have.property('hours_used');
                    res.body.should.have.property('task_status');
                    let newTaskId = res.body._id; // We save the new task ID
                    // 5) Delete Task
                    chai
                      .request(server)
                      .delete('/api/tasks/task')
                      .set({ 'auth-token': token })
                      .set({ id: newTaskId })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        // 6) Get all tasks by Project Id (verify 0)
                        chai
                          .request(server)
                          .get('/api/tasks/byProject')
                          .set({ 'auth-token': token })
                          .set({ id: newProjectId })
                          .end((err, res) => {
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.be.eql(0);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project, Create Task, Delete Project and check that Project+Task are deleted ---------------------------
  it('Register User, Login, Create Project, Create Task, Delete Project and check that Project+Task are deleted', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body.error).to.be.equal(null);
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user1@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            let project = {
              name: 'Project 1',
              description: 'Lorem ipsum sit amet',
              stakeholder: 'Lorem ipsum',
            };
            // 3) Create project
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('stakeholder');
                res.body.should.have.property('leader');
                res.body.should.have.property('members');
                res.body.should.have.property('technologies');
                res.body.should.have.property('time_schedule');
                let newProjectId = res.body._id; // We save the new project ID
                // 4) Create Task
                let task = {
                  project_id: newProjectId,
                  name: 'Task 1 of Project 1',
                  description: 'Lorem ipsum sit amet',
                };
                chai
                  .request(server)
                  .post('/api/tasks/task')
                  .set({ 'auth-token': token })
                  .send(task)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.project_id).to.be.equal(newProjectId);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('assigned_to');
                    res.body.should.have.property('hours_allocated');
                    res.body.should.have.property('hours_used');
                    res.body.should.have.property('task_status');
                    // 5) Delete Project
                    chai
                      .request(server)
                      .delete('/api/projects/project')
                      .set({ 'auth-token': token })
                      .set({ id: newProjectId })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(201);
                        done();
                      });
                  });
              });
          });
      });
  });
});
