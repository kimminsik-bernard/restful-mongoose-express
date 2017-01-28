import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';

import config from './../src/config';
import app from './../src/app';


chai.should();
chai.use(chaiHttp);

mongoose.Promise = global.Promise;
mongoose.connect(
  config.test.db.host, { server: { socketOptions: { keepAlive: 1 } } },
  () => mongoose.connection.db.dropDatabase(),
);

describe('Health Check', () => {
  it('it should return hello world', (done) => {
    chai.request(app)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        return done();
      });
  });
});

describe('Authentication & User', () => {
  const user = {
    username: 'taki',
    password: 'michuha',
  };
  let token;
  let id;

  it('it should create the new user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('username').eql(user.username);
        res.body.should.have.property('_id');
        id = res.body._id;
        return done();
      });
  });

  it('it should authenticate the user', (done) => {
    chai.request(app)
      .post('/api/auth')
      .send({
        username: 'taki',
        password: 'michuha',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token');
        token = res.body.token;
        return done();
      });
  });

  it('it shoud validate the user token', (done) => {
    chai.request(app)
      .get('/api/auth/validate-token')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id').eql(id);
        return done();
      });
  });

  it('it shoud retrieve the user data', (done) => {
    chai.request(app)
      .get(`/api/users/${id}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('username').eql(user.username);
        res.body.should.have.property('_id').eql(id);
        return done();
      });
  });
});
