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

app.use(basicAuth({
  users: { 'admin': process.env.ADMIN_SECRET }
}));

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
app.use(`/${APP_URL_PREFIX}/plugs`, require('./routes/api/plugs'));

app.listen(PORT, () => console.log(`Server started on port ${PORT} with URL PREFIX: ${APP_URL_PREFIX}`));
