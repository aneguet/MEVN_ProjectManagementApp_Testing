process.env.NODE_ENV = 'test';
// Import models
const User = require('../../models/User');
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
  done();
});

afterEach((done) => {
  User.deleteMany({}, function (err) {});
  Project.deleteMany({}, function (err) {});
  done();
});

describe('/Projects', () => {
  //--------------------------  Register admin User, Login, Create project and verify 1 in the DB by Getting all projects (admin) ---------------------------
  it('Should REGISTER admin User,LOGIN, Create project and verify 1 in the DB by Getting all projects (admin)', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      email: 'admin1@gmail.com',
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
            email: 'admin1@gmail.com',
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
            // 3) Create Project (user creating project is set as leader)
            chai
              .request(server)
              .post('/api/projects/project')
              .set({ 'auth-token': token })
              .send(project)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                // 4) Verify 1 project in the DB
                chai
                  .request(server)
                  .get('/api/projects')
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
  //--------------------------  Register normal User, Login and try to Get all projects without the permission (admin) ---------------------------
  it('Should REGISTER normal User, Login and try to Get all projects without the permission', (done) => {
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
            // 3) Get all projects (admin request)
            chai
              .request(server)
              .get('/api/projects')
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
  //--------------------------  Register User, Login, Create Project and Get Project by ID ---------------------------
  it('Register User, Login, Create Project and Get Project by ID', (done) => {
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
                // 4) Get project by id
                chai
                  .request(server)
                  .get('/api/projects/project')
                  .set({ 'auth-token': token })
                  .set({ id: newProjectId })
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    res.body.should.have.property('_id').eql(newProjectId);
                    done();
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project and Update Project being Project leader ---------------------------
  it('Register User, Login, Create Project and Update Project being Project leader', (done) => {
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
                // 4) Update project by id
                let projectUpdated = {
                  name: 'Project 1 Updated',
                };
                chai
                  .request(server)
                  .put('/api/projects/project')
                  .set({ 'auth-token': token })
                  .set({ id: newProjectId })
                  .send(projectUpdated)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.name).to.be.equal(projectUpdated.name);
                    done();
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project and Update Project being Project leader ---------------------------
  it('Register User 1, Login, Create Project, Register User 2, login and Update Project not being leader or admin (not allowed)', (done) => {
    let user1 = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user1@gmail.com',
      password: '123456',
    };
    chai
      .request(server)
      .post('/api/users/register')
      .send(user1)
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
            // 3) Create project (user 1 is leader)
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
                // 4) Create User 2
                let user2 = {
                  first_name: 'John',
                  last_name: 'Doe',
                  email: 'user2@gmail.com',
                  password: '123456',
                };
                chai
                  .request(server)
                  .post('/api/users/register')
                  .send(user2)
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.error).to.be.equal(null);
                    // 5) Login User 2
                    chai
                      .request(server)
                      .post('/api/users/login')
                      .send({
                        email: 'user2@gmail.com',
                        password: '123456',
                      })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        let token = res.body.data.token;
                        // 6) Update project previously created by User 1 (User 2 is not leader or member and they are not allowed)
                        let projectUpdated = {
                          name: 'Project 1 Updated',
                        };
                        chai
                          .request(server)
                          .put('/api/projects/project')
                          .set({ 'auth-token': token })
                          .set({ id: newProjectId })
                          .send(projectUpdated)
                          .end((err, res) => {
                            expect(res.status).to.be.equal(403);
                            expect(res.body.message).to.be.equal(
                              'You must be a leader or admin of this project'
                            );
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
  //--------------------------  Register User, Login, Create Project, Delete Project and verify 0 in DB ---------------------------
  it('Register User, Login, Create Project, Delete Project and verify 0 in DB', (done) => {
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

                // 4) Delete Project
                chai
                  .request(server)
                  .delete('/api/projects/project')
                  .set({ 'auth-token': token })
                  .set({ id: newProjectId })
                  .end((err, res) => {
                    expect(res.status).to.be.equal(201);
                    // 5) Verify 0 Projects in the DB
                    chai
                      .request(server)
                      .get('/api/projects/project')
                      .set({ 'auth-token': token })
                      .set({ id: newProjectId })
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.equal(null);
                        done();
                      });
                  });
              });
          });
      });
  });
});
