/*
File: config.js
Date: 4/20/2024
*/

/* ======================== (start) REFERENCE:github/docker ================== */
/* - this database.js file is from the docker github. Currently unchanged. */

const fs = require("fs");

const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

// Constants
const IS_RUNNING_LOCAL = true;

if (IS_RUNNING_LOCAL) {
  require('dotenv').config(); // <-
}

module.exports = {
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
      ? readFileSync(process.env.DATABASE_PASSWORD)
      : null
  },
  port: process.env.PORT || 8080
  // if you're not using docker compose for local development, this will default to 8080
  // to prevent non-root permission problems with 80. Dockerfile is set to make this 80
  // because containers don't have that issue :)
};

/* ======================== ( end ) REFERENCE:github/docker ================== */