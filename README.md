# HOME CONTROL

## Quick Start

```bash
# Install dependencies
npm install

# Serve on localhost:5000
npm run dev
```

## SETUP
For DEV environment use the .env file
For kubernetes create homecontrol-config
```
kubectl create secret generic homecontrol-config -n default --from-literal=SECURITYCODE=... --from-literal=ADMIN_SECRET=...
```

