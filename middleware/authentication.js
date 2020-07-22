const basicAuth = require('express-basic-auth');

const authenticate = (req, res, next) => {
  try {
    // check for basic auth header
      if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const userMatches = basicAuth.safeCompare(username, process.env.ADMIN_USER);
    const passwordMatches = basicAuth.safeCompare(password, process.env.ADMIN_SECRET);

    if(userMatches & passwordMatches) {
      next(); // only pass when successful
    }
    else {
      return res.status(403).json({ message: 'Access denied: wrong user or password' });
    }
  }
  catch(err) {
    console.log(`Authentication error: ${err}`);
    res.status(500).json({ message: `Internal error: ${err}` });
  }
}

module.exports = authenticate;
