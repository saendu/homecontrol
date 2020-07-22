const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const members = require('./Members');
const dotenv = require('dotenv');
const basicAuth = require('express-basic-auth');

dotenv.config();
const APP_URL_PREFIX = process.env.APP_URL_PREFIX || 'api';
const PORT = process.env.PORT || 5000;

const app = express();

// Authentication Middleware
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

// Init middleware
app.use(logger);

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Homepage Route
app.get('/', (req, res) =>
  res.render('index', {
    title: 'HOMECONTROL API',
    members
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use(`/${APP_URL_PREFIX}/plugs`, authenticate, require('./routes/api/plugs'));

app.listen(PORT, () => console.log(`Server started on port ${PORT} with URL PREFIX: ${APP_URL_PREFIX}`));
