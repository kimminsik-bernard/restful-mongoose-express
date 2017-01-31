import User from './../models/user';


// list users.
const list = (req, res, next) => {
  User.find()
    .catch(err => next(err))
    .then(users => res.json(users));
};

// create new user.
const create = (req, res, next) => {
  const user = new User(req.body);

  return user.save()
    .catch(err => next(err))
    .then(savedUser => res.json(savedUser));
};

// retrieve user document
const retrieve = (req, res, next) => {
  const _id = req.params._id;

  return User.findById(_id)
    .catch(err => next(err))
    .then(doc => res.json(doc));
};

// retrieve user document
const update = (req, res, next) => {
  const _id = req.params._id;

  return User.findOneAndUpdate({ _id }, req.body, { new: true })
    .catch(err => next(err))
    .then(doc => res.json(doc));
};

export default { list, create, retrieve, update };
