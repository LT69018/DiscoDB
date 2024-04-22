/* 
File: server.js
Description: Express code. Contains endpoints for DiscoDB backend.

*/

const PORT = process.env.PORT;

const express = require("express");

const app = express();
/* ======================== (start) REFERENCE:github/docker ==================
/* - these comments and imports come from the reference. */
// simple node web server that displays hello world
// optimized for Docker image
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const database = require("./database");

app.use(morgan("common"));
/* ======================== ( end ) REFERENCE:github/docker ================== */


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

/* ======================== (start) REFERENCE:github/docker ==================
- these template endpoints are from the reference:  
  - "/" - selecting a version from MySQL
  - "/healthz" - verifying the app is functioning
*/

app.get("/", function(req, res, next) {
  database.raw('select VERSION() version')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
  res.send("[DiscoDB] Successfully pinged GET '/'");
});

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("[DiscoDB] I am happy and healthy\n");
});
/* ======================== (end) REFERENCE:github/docker ================== */

module.exports = app;