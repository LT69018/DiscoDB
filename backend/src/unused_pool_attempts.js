const database = require("./database");
var pool = database.pooledConnection

const displayResult = (error, results, fields) => {
  console.log(`\tError: ${error}\n\tResults: ${results}\n\tFields: ${fields}`)
};

pool.on("acquire", function(connection) {
  connection.query("SHOW TABLES", 
  function(error, result, fields) {
    displayResult(error, result, fields);
    connection.release();
  }
)});

pool.on("acquire", function(connection) {
  connection.query(
    `CREATE TABLE IF NOT EXISTS users(
      user_id integer PRIMARY KEY,
      username string,
    );`, function(error, result, fields) {
      console.log("Done creating `users` table (if it didn't already exist)!");
      displayResult(error, result, fields);
      connection.release();
    })
});