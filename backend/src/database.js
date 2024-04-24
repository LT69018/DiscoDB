/*
File: database.js
Date: 4/24/2024
Author: Jess Turner
Description:
Attempt to facilitate a connection with the database to execute queries and return the results!
*/

// removed docker import "knex" since we want to execute queries themselves not use a express factory.
const {database} = require("./config");
const mysql = require("mysql"); // could also use mysql2, but mysql apparently doesn't require compiling

// Reference: https://www.npmjs.com/package/mysql
var pooledConnection = mysql.createPool(database);
// will allow multiple queries to run at the same time, i.e. refreshing two tabs, one with SearchResults and one with the UserProfile
// call with connection.query(), connection.release

// reference (how to execute a sql query in express)
// https://blog.logrocket.com/build-rest-api-node-express-mysql/
// async function runQuery(sql, params) {
//   const connection = await mysql.createConnection(config.db);
//   const [results, ] = await connection.execute(sql, params);

//   return results;
// }

module.exports = {
  pooledConnection: pooledConnection,
  // runQuery: runQuery
}