process.env.NODE_ENV = 'test';
// Setup file defines the test db and other configs
// Chai imports
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http'); // Plugin that allows https integration testing, it tests request & response
chai.use(chaiHttp);
const server = require('../app');

describe('/General, User and Artist tests', () => {
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
