const express = require('express');
const router = express.Router();
const stringify = require('json-stringify-safe');
const deviceConnector = require('../../middleware/deviceconnector');

router.get('/', (req, res) => {
    //res.json(deviceConnector.plugs);
    res.send(stringify(deviceConnector.plugs)); // TODO weird circle
});

// TOGGLE 

router.put('/:plugId/toggle', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = deviceConnector.plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].toggle();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }

  res.json(safePlugInfo);
});

// Turn ON 

router.put('/:plugId/on', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = deviceConnector.plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].turnOn();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safePlugInfo);
});

// Turn OFF 

router.put('/:plugId/off', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = deviceConnector.plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].turnOff();
  }
  catch(error) {
    console.log(error);
    // restoring connection because this is 9/10 times the problem
    deviceConnector.restoreConnection();
  }
  res.json(safePlugInfo);
});


module.exports = router;
