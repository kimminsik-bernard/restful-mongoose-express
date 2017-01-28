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

describe('Authentication', () => {
  const user = {
    username: 'taki',
    password: 'michuha',
  };

  it('it should sign-up the new user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('username').eql(user.username);
        return done();
      });
  });

  it('it should authenticate the user', (done) => {
    chai.request(app)
      .post('/api/auth')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token');
        return done();
      });
  });
});
