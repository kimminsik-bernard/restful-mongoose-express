import bluebird from 'bluebird';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

import config from './../src/config';
import app from './../src/app';


chai.should();
chai.use(chaiHttp);

mongoose.Promise = bluebird;
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

  it('it should refresh the user token', (done) => {
    chai.request(app)
      .get('/api/auth/refresh')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token').not.eql(token);
        token = res.body.token;
        return done();
      });
  });

  it('it should respond unauthorized error when request without token', (done) => {
    chai.request(app)
      .get('/api/auth/refresh')
      .end((err, res) => {
        res.should.have.status(401);
        return done();
      });
  });

  it('it should retrieve the user data', (done) => {
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
