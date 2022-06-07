process.env.NODE_ENV = 'test';
// Import models
const Tech = require('../../models/Technology');

// Chai imports
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../app');

// Clean up the database before and after each test
beforeEach((done) => {
  Tech.deleteMany({}, function (err) {});
  done();
});

afterEach((done) => {
  Tech.deleteMany({}, function (err) {});
  done();
});
describe('/Techs', () => {
  // Create 2 Techs and verify 2 by getting All techs
  it('Create 2 Techs and verify 2 by getting All techs', (done) => {
    // 1) Create Tech 1
    let tech1 = { tech_name: 'Figma' };
    chai
      .request(server)
      .post('/api/technologies')
      .send(tech1)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        // 2) Create Tech 2
        let tech2 = { tech_name: 'PHP' };
        chai
          .request(server)
          .post('/api/technologies')
          .send(tech2)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            // 3) Get All techs (verify 2)
            chai
              .request(server)
              .get('/api/technologies')
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
              });
          });
      });
  });
  // Create Tech and get Tech by Id
  it('Create Tech and get Tech by Id', (done) => {
    // 1) Create Tech
    let tech = { tech_name: 'Figma' };
    chai
      .request(server)
      .post('/api/technologies')
      .send(tech)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        let techId = res.body.savedTech._id;
        // 2) Get Tech By Id
        chai
          .request(server)
          .get('/api/technologies/technology')
          .set('id', techId)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body._id).to.be.equal(techId);
            expect(res.body).to.be.a('object');
            done();
          });
      });
  });
  // Create Tech and delete Tech by Id and Verify 0 by getting Tech by Id
  it('Create Tech and delete Tech by Id and Verify 0 by getting Tech by Id', (done) => {
    // 1) Create Tech
    let tech = { tech_name: 'Figma' };
    chai
      .request(server)
      .post('/api/technologies')
      .send(tech)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        let techId = res.body.savedTech._id;
        // 2) Delete Tech by Id
        chai
          .request(server)
          .delete('/api/technologies/technology')
          .set('id', techId)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            // 3) Get Tech By Id (verify 0)
            chai
              .request(server)
              .get('/api/technologies/technology')
              .set('id', techId)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(null);
                done();
              });
          });
      });
  });
});
