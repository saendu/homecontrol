const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authentication');
const members = require('./Members');
const dotenv = require('dotenv');
dotenv.config();

const deviceConnector = require('./middleware/deviceconnector');
const APP_URL_PREFIX = process.env.APP_URL_PREFIX || 'api';
const PORT = process.env.PORT || 5000;

// Tradfri
deviceConnector.connect();
console.log(`*** CONNECTED TO ${process.env.GATEWAY_IP} ***`);

const app = express();
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
app.use(`/${APP_URL_PREFIX}/bulbs`, authenticate, require('./routes/api/bulbs'));

// Port Listener
app.listen(PORT, () => console.log(`Server started on port ${PORT} with URL PREFIX: ${APP_URL_PREFIX}`));
