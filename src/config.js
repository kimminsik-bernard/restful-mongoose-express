import dotenv from 'dotenv';

dotenv.config();


const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  db: {
    host: process.env.DB_HOST || 'mongodb://localhost/restful-express',
  },
  jwt: {
    secret: process.env.JWT_SECERET || 'jwtscrete',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  bcrypt: {
    saltRound: parseInt(process.env.BCRYPT_SALT_ROUND, 10) || 10,
  },
  test: {
    db: {
      host: process.env.TEST_DB_HOST || 'mongodb://localhost/restful-express',
    },
  },
};

export default config;
