const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;
  
  if(credentials.username && credentials.password) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
    .then(user => {
      res.status(201).json({ data: user });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
  } else {
    res.status(400).json({ message: 'Username and password are required fields.'})
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  if(username && password) {
    Users.getBy({ username: username })
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)) {
        const token = createJwt(user);
        res.status(200).json({ message: 'welcome', token });
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    })
  } else {
    res.status(400).json({ message: 'Username and password are required fields.' });
  }
});

function createJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const secret = process.env.JWT_SECRET || 'secret';

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
