var express = require('express');
var router = express.Router();
const database = require("../database");

const TEST_USER_ID = 12456;
const TEST_USERNAME = "testUser"
const TEST_PASSWORD = "passwordWowSoSecure";
const TEST_SALT = "sdfghjytrfdcvbjuytrdcvji876t";
const TEST_FULL_NAME = "test user full name";

/* /add_user */
// NOTE: currently only using the test username even tho it parses the request username.
router.post("/", function(req, res, next){
  /*
  Add a row in the `users` table. Creates the table if it doesn't already exist.
  :param: username
  - Todo: maybe password
  :return: {
    "message": ...
    "query_result": {..., "insertId": user_id}
  }}
  NOTE: make sure not to call add_user twice without remembering the user_id from the first call, the second time the "insertId" will just be 0.
  */
  let result_json = {};
  const queryParams = Object.keys(req.query); // If we decide to use req.params, then we have to change the endpoint i.e. /add_user/:username
  if (! ("username") in queryParams) {
    console.log("[POST /add_user] Missing username (param). Try again.");
    // Promise syntax reference:
    // https://expressjs.com/en/guide/error-handling.html
    Promise.resolve().then(() => {
      throw new Error('Unable to POST /add_user.');
    }).catch(next) // Errors will be passed to Express.
  }
  const usernameParam = req.query.username;
  console.log(`[POST /add_user] Got username = ${usernameParam} from req.query=${queryParams}`);
 

  const user_id = TEST_USER_ID; // tbd
  const username = TEST_USERNAME; 
  const password = TEST_PASSWORD;
  const salt = TEST_SALT; // IRL This would be random 256 length.
  const fullName = TEST_FULL_NAME; 

  // use ignore in case they already are in the table :P
  const CREATE_USER_SQL = `INSERT IGNORE INTO users(user_id, username, user_pswd, user_salt, user_full_name)
                          VALUES (?, ?, ?, ?, ?)`;

  database.connection.connect(function(conn_err) {
    if (conn_err) {
      console.error("[GET /test_db_connection] Connection Error:", conn_err);
      result_json["message"] = "Can't connect to database.";
      res.status(500).json(result_json);
      next(conn_err);
    } else {
      console.log("[GET /test_db_connection] Successfully connected to database!!");
    
      database.connection.query(CREATE_USER_SQL, [user_id, username, password, salt, fullName], (query_err, query_res) => {
        if (query_err) {
          console.error("[GET /test_db_connection] Query Error:", query_err);
          result_json["message"] = "Can't execute query.";
          // sendStatus doesn't seem to work either :(
          res.status(500).json(result_json);
          next(query_err);
        } else {
          result_json["query_result"] = query_res;
          console.log(`[GET /test_db_connection]\n\tSuccessfully ran query in /test_db_connection! Result: \n\t${JSON.stringify(query_res)}`);
          result_json["message"] = "Successfully ran /test_db_connection (connected and queried)";
          res.status(200).json(result_json);
        } 
      });
    }
  });
}); 

module.exports = router;