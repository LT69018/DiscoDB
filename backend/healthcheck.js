/*
File: healthcheck.js

Description:
Outline from 4/20 downloaded from this reference:
https://github.com/docker/awesome-compose/blob/master/react-express-mysql/backend/healthcheck.js
*/

const http = require("http");

const options = {
  timeout: 2000,
  host: "localhost",

  port: process.env.PORT, // || 8080,
  path: "/healthz" // must be the same as HEALTHCHECK in Dockerfile
};

const request = http.request(options, res => {
  console.info("STATUS: " + res.statusCode);
  console.log("Performed status check on PORT:" + res.PORT)
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  process.exit();
  
});

request.on("error", function(err) {
  console.error("ERROR", err);
  process.exit(1);
});

request.end();