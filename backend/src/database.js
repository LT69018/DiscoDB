/*
File: database.js
Date: 4/20/2024
*/

/* ======================== (start) REFERENCE:github/docker ================== */
/* - this database.js file is from the docker github. Currently unchanged. */

const knex = require('knex');
const { database } = require('./config');

module.exports = knex({
  client: 'mysql2',
  connection: database,
});

/* ======================== ( end ) REFERENCE:github/docker ================== */