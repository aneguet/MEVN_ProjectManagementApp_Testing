// We switch to the test DB
process.env.NODE_ENV = 'test';
// Import models
const User = require('../../models/User');
// Chai imports
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http'); // Plugin that allows https integration testing, it tests request & response
chai.use(chaiHttp);
const server = require('../../app');

//clean up the database before and after each test
// before((done) => {
beforeEach((done) => {
  User.deleteMany({}, function (err) {});
  done();
});
// after((done) => {
afterEach((done) => {
  User.deleteMany({}, function (err) {});
  done();
});

describe('/Users, User registration', () => {
  //--------------------------  Register User and Login ---------------------------
  it('Should REGISTER User and LOGIN', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
            email: 'user100@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            done();
          });
      });
  });
  //--------------------------  Register User and Login with invalid Email --------
  it('Should not REGISTER User and LOGIN with invalid Email', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
            // Asserts
            expect(res.status).to.be.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal("Email doesn't exist");
            done();
          });
      });
  });

  //--------------------------  Register User and Login with invalid Password --------
  it('Should not REGISTER User and LOGIN with invalid Password', (done) => {
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
            password: '121234',
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal('The password is wrong');
            done();
          });
      });
  });
  //--------------------------  Register User and then register the same user again --------
  it('Should not REGISTER User that already exists', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
        // 2) register the same user again
        chai
          .request(server)
          .post('/api/users/register')
          .send(user)
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal('Email already exists');
            done();
          });
      });
  });
  //--------------------------  Get all users not being logged in (without token) --------
  it('Should not GET ALL Users if user is not logged in (no token)', (done) => {
    chai
      .request(server)
      .get('/api/users')
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.be.equal('Access denied');
        done();
      });
  });
  //--------------------------  Register, login, and try to get all users with invalid token --------
  it('Should not GET ALL Users if token is invalid', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
            email: 'user100@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            // GET ALL Users with wrong token
            chai
              .request(server)
              .get('/api/users')
              .set({ 'auth-token': 'abcdefg' })
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.equal('Token is not valid');
                done();
              });
          });
      });
  });
  //--------------------------  Register, Login, Verify 1 in the DB and Update user ---------------------------
  it('Should REGISTER User, LOGIN, Verify 1 in the DB and Update successfully', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
        let userId = res.body.data;

        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user100@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            // 3) Verify that there is one user and is equal to the one created
            chai
              .request(server)
              .get('/api/users')
              .set({ 'auth-token': token })
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(1);

                let user = {
                  first_name: 'Joana',
                };
                // 4) Update user
                chai
                  .request(server)
                  .put('/api/users/user')
                  .set({ 'auth-token': token })
                  .set({ id: userId })
                  .send(user)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    done();
                  });
              });
          });
      });
  });
  //--------------------------  Register, Login, Delete and Verify 0---------------------------
  it('Should REGISTER User, LOGIN, Delete it and Verify 0 in the db', (done) => {
    let user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user100@gmail.com',
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
        let userId = res.body.data;
        // 2) Login user
        chai
          .request(server)
          .post('/api/users/login')
          .send({
            email: 'user100@gmail.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
            // 3) Delete user
            chai
              .request(server)
              .delete('/api/users/user')
              .set({ 'auth-token': token })
              .set({ id: userId })
              .send(user)
              .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.message).to.be.equal(
                  'User successfully deleted.'
                );
                // 4) Verify that there are 0 users in the db
                chai
                  .request(server)
                  .get('/api/users')
                  .set({ 'auth-token': token })
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
