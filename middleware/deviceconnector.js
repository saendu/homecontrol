const tradfriLib = require("node-tradfri-client");
const TradfriClient = tradfriLib.TradfriClient;
const AccessoryTypes = tradfriLib.AccessoryTypes;
const tradfri = new TradfriClient(process.env.GATEWAY_IP, {watchConnection: true});

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

function restoreConnection() {
  try {
    tradfri.destroy();
    console.log(`*** DESTROYED CONNECTION ***`);

    connect();
    console.log(`*** CONNECTED TO ${process.env.GATEWAY_IP} ***`);
  } catch (error) {
    console.log(`ERROR during restoring connection: ${error}`);
  }
  
}

module.exports = { restoreConnection, connect, plugs, lightbulbs }