# HOME CONTROL API

## Quick Start

```bash
# Install dependencies
npm install

# Serve on localhost:5000
npm run dev
```

## SETUP
For DEV environment use the .env file
```
GATEWAY_IP=...
SECURITYCODE=...
ADMIN_SECRET=...
```

For kubernetes create homecontrol-config
```
kubectl create secret generic homecontrol-config -n default --from-literal=SECURITYCODE=... --from-literal=ADMIN_SECRET=...
```

## Docker
Build multi-arch
```
docker buildx build --platform linux/amd64,linux/arm64 -t blacktr/homecontrol:latest --push .
```

## SIRI
If you want to control your plugs or lamps via Siri, create a Shortcut and simply call this URL with the Authorization Header. 
```
PUT https://wgviktoria.internet-box.ch/homecontrol/plugs/<PLUGID>/toggle
Authorization: Basic base64-auth-header
```



