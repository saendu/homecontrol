const express = require('express');
const router = express.Router();
const stringify = require('json-stringify-safe');
const deviceConnector = require('../../middleware/deviceconnector');

router.get('/', (req, res) => {
    //res.json(bulbs);
    res.send(stringify(deviceConnector.lightbulbs)); // TODO weird circle
});

// TOGGLE LighBulb

router.put('/:blubId/toggle', async (req, res) => {
  const id = req.params['blubId'];
  const bulb = deviceConnector.lightbulbs[id];
  const {client, ...safeBulbInfo} = bulb; 
  
  try {
    await bulb.lightList[0].toggle();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }

  res.json(safeBulbInfo);
});

// Turn ON 

router.put('/:blubId/on', async (req, res) => {
  const id = req.params['blubId'];
  const bulb = deviceConnector.lightbulbs[id];
  const {client, ...safeBulbInfo} = bulb; 
  
  try {
    await bulb.lightList[0].turnOn();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safeBulbInfo);
});

// Turn OFF 

router.put('/:blubId/off', async (req, res) => {
  const id = req.params['blubId'];
  const bulb = deviceConnector.lightbulbs[id];
  const {client, ...safeBulbInfo} = bulb; 
  
  try {
    await bulb.lightList[0].turnOff();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safeBulbInfo);
});

// Brightness
router.put('/:blubId/brightness/:number', async (req, res) => {
  const id = req.params['blubId'];
  const number = req.params['number'];
  const bulb = deviceConnector.lightbulbs[id];
  const {client, ...safeBulbInfo} = bulb; 
  
  try {
    await bulb.lightList[0].setBrightness(number);
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safeBulbInfo);
});

// Brightness
router.put('/:blubId/color/:color', async (req, res) => {
  const id = req.params['blubId'];
  // colors: f5faf6, f1e0b5, efd275
  const color = req.params['color'];
  const bulb = deviceConnector.lightbulbs[id];
  const {client, ...safeBulbInfo} = bulb; 
  
  try {
    await bulb.lightList[0].setColor(color);
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safeBulbInfo);
});

module.exports = router;
