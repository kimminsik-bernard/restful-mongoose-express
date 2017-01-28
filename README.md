# RESTful Mongoose Express

A simple boilerplate application for building RESTful APIs in Node.js with Express and Mongoose.

## Features

- `ECMAScript 6` language standard
- `Express` web framework
- `mongoose` mongoDB object modeling
- `passport` authentication middleware
- `bcrypt` password hashing
- `JSON Web Token` access control
- `Mocha` & `Chai` test
- `nodemon` live reload
- `dotenv` managing environment variables

## Scripts

- `npm run dev` run server in development mode, enabling live reload
- `npm run build` transpile for production
- `npm run start` run server with production build
- `npm run test` run mocha tests

## Setting

Set environment-specific variables on `.env` file in the root directory of the project.
```
PORT=8000
DB_HOST=mongodb://localhost/database
TEST_DB_HOST=mongodb://localhost/database-for-test
JWT_SECRET=jasonwebtokensecret
BCRYPT_SALT_ROUND=10
```
See `/src/config.js` how it actually affects default values.


## Run

1. Prepare [MongoDB](https://www.mongodb.com/download-center)
1. `npm install`
1. Set environment variables, if you need
1. `npm run test`, if you want
1. `npm run dev`

## Milestones

- Paginate respone
- Social OAuth