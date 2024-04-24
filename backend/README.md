This will contain the backend code for DiscoDB.


If running into problems revolving around the backend unable to load dependencies, make sure to run: 

docker-compose down -v

Followed by the normal command
docker compose up

Characteristic Error:

node:internal/modules/cjs/loader:1146
project-discodb-main-backend-1   |   throw err;
project-discodb-main-backend-1   |   ^
project-discodb-main-backend-1   | 
project-discodb-main-backend-1   | Error: Cannot find module 'cors'
project-discodb-main-backend-1   | Require stack:
project-discodb-main-backend-1   | - /code/src/server.js
project-discodb-main-backend-1   |     at Module._resolveFilename (node:internal/modules/cjs/loader:1143:15)
project-discodb-main-backend-1   |     at Module._load (node:internal/modules/cjs/loader:984:27)
project-discodb-main-backend-1   |     at Module.require (node:internal/modules/cjs/loader:1231:19)
project-discodb-main-backend-1   |     at require (node:internal/modules/helpers:179:18)
project-discodb-main-backend-1   |     at Object.<anonymous> (/code/src/server.js:15:12)
project-discodb-main-backend-1   |     at Module._compile (node:internal/modules/cjs/loader:1369:14)
project-discodb-main-backend-1   |     at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)
project-discodb-main-backend-1   |     at Module.load (node:internal/modules/cjs/loader:1206:32)
project-discodb-main-backend-1   |     at Module._load (node:internal/modules/cjs/loader:1022:12)
project-discodb-main-backend-1   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:135:12) {
project-discodb-main-backend-1   |   code: 'MODULE_NOT_FOUND',
project-discodb-main-backend-1   |   requireStack: [ '/code/src/server.js' ]
project-discodb-main-backend-1   | }
project-discodb-main-backend-1   | 
project-discodb-main-backend-1   | Node.js v20.12.2
project-discodb-main-backend-1   | [nodemon] app crashed - waiting for file changes before starting...


https://stackoverflow.com/questions/42040317/cannot-find-module-for-a-node-js-app-running-in-a-docker-compose-environment

