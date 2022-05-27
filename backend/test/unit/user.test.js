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

describe('/General, Welcome route test', () => {
  it('Test default API Welcome route', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Welcome to backend');
        done();
      });
  });
});
describe('/Users, User registration', () => {
  //--------------------------  Register User and Login ---------------------------
  it('Should REGISTER User and LOGIN', (done) => {
    let user = {
      role: 'user',
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
      role: 'user',
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
  //-------------------------------------------------------------------------------
});
