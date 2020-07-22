const express = require('express');
const router = express.Router();

const tradfriLib = require("node-tradfri-client");
const TradfriClient = tradfriLib.TradfriClient;
const AccessoryTypes = tradfriLib.AccessoryTypes;
const tradfri = new TradfriClient(process.env.GATEWAY_IP, {watchConnection: true});

const stringify = require('json-stringify-safe');

const lightbulbs = {};
const plugs = {};
const devices = {};

const connect = async () => {
  try {
    const {identity, psk} = await tradfri.authenticate(process.env.SECURITYCODE);
    await tradfri.connect(identity, psk);
    tradfri
      .on("device updated", tradfri_deviceUpdated)
      .observeDevices();
  } catch (e) {
    console.log(e);
  }
}

function tradfri_deviceUpdated(device) {
  console.log(`*** DEVICE (${device.instanceId}) UPDATED ***`);
  devices[device.instanceId] = device;

  if (device.type === AccessoryTypes.lightbulb) {
    lightbulbs[device.instanceId] = device;
  } else if (device.type === AccessoryTypes.plug) {
    //const {...plug} = device; 
    device.client.psk = null;
    device.client.securityCode = null;
    plugs[device.instanceId] = device;
  }
}

connect();
console.log(`*** CONNECTED TO ${process.env.GATEWAY_IP} ***`)

router.get('/', (req, res) => {
    //res.json(plugs);
    res.send(stringify(plugs)); // TODO weird circle
});

// TOGGLE 

router.put('/:plugId/toggle', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].toggle();
  }
  catch(error) {
    console.log(error);
  }

  res.json(safePlugInfo);
});

// Turn ON 

router.put('/:plugId/on', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].turnOn();
  }
  catch(error) {
    console.log(error);
  }
  res.json(safePlugInfo);
});

// Turn OFF 

router.put('/:plugId/off', async (req, res) => {
  const plugId = req.params['plugId'];
  const plug = plugs[plugId];
  const {client, ...safePlugInfo} = plug; 
  
  try {
    await plug.plugList[0].turnOff();
  }
  catch(error) {
    console.log(error);
  }
  res.json(safePlugInfo);
});


module.exports = router;
