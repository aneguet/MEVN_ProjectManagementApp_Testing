process.env.NODE_ENV = 'test';
// Import models
const Avatar = require('../../models/Avatar');

// Chai imports
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../app');

// Clean up the database before and after each test
beforeEach((done) => {
  Avatar.deleteMany({}, function (err) {});
  done();
});

afterEach((done) => {
  Avatar.deleteMany({}, function (err) {});
  done();
});
describe('/Avatars', () => {
  // Create Avatar and verify 1 by getting all avatars
  it('Create Avatar and verify 1 by getting all avatars', (done) => {
    // 1) Create Avatar
    let avatar = { img_link: 'https://i.imgur.com/6G4P17X.png' };
    chai
      .request(server)
      .post('/api/avatars')
      .send(avatar)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        // 2) Get All Avatars
        chai
          .request(server)
          .get('/api/avatars')
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.eql(1);
            done();
          });
      });
  });
  // Create 3 avatars and get random avatar
  it('Create 3 avatars, verify 3 by getting All and Get random avatar', (done) => {
    let avatarsIds = [];
    // 1) Create Avatar 1
    let avatar1 = { img_link: 'https://i.imgur.com/6G4P17X.png' };
    chai
      .request(server)
      .post('/api/avatars')
      .send(avatar1)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        let avatar1Id = res.body.savedAvatar._id;
        avatarsIds.push(avatar1Id);
        // 2) Create Avatar 2
        let avatar2 = { img_link: 'https://i.imgur.com/5G4P17X.png' };
        chai
          .request(server)
          .post('/api/avatars')
          .send(avatar2)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            let avatar2Id = res.body.savedAvatar._id;
            avatarsIds.push(avatar2Id);
            // 3) Create Avatar 3
            let avatar3 = { img_link: 'https://i.imgur.com/4G4P17X.png' };
            chai
              .request(server)
              .post('/api/avatars')
              .send(avatar3)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                let avatar3Id = res.body.savedAvatar._id;
                avatarsIds.push(avatar3Id);
                // 4) Get All Avatars (verify 3)
                chai
                  .request(server)
                  .get('/api/avatars')
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.eql(3);
                    // 5) Get Random Avatar
                    chai
                      .request(server)
                      .get('/api/avatars/randomAvatar')
                      .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body._id).to.be.oneOf(avatarsIds); // The random avatar id should be one of the 3 created
                        done();
                      });
                  });
              });
          });
      });
  });
});
