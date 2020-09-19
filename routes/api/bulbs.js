const express = require('express');
const router = express.Router();
const stringify = require('json-stringify-safe');
const deviceConnector = require('../../middleware/deviceconnector');

router.get('/', (req, res) => {
    //res.json(plugs);
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

module.exports = router;
