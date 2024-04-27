const TEST_USER_ID = 12456;
const TEST_PASSWORD = "passwordWowSoSecure";
const TEST_SALT = "sdfghjytrfdcvbjuytrdcvji876t";

app.post("/add_user", function(req, res, next){
  /*
  Add a row in the `users` table. Creates the table if it doesn't already exist.
  :param: username
  - Todo: maybe password
  :return: user_id
  */
  const queryParams = Object.keys(req.query); // If we decide to use req.params, then we have to change the endpoint i.e. /add_user/:username
  if (! ("username") in queryParams) {
    console.log("[POST /add_user] Missing username (param). Try again.");
    // Promise syntax reference:
    // https://expressjs.com/en/guide/error-handling.html
    Promise.resolve().then(() => {
      throw new Error('Unable to POST /add_user.');
    }).catch(next) // Errors will be passed to Express.
  }
  const username = req.query.username;
  console.log(`[POST /add_user] Got username = ${username} from req.query=${queryParams}`);
  const user_id = null; // tbd

  /*
  TODO: password, salt
  */
  const password = TEST_PASSWORD;
  const salt = TEST_SALT; // IRL This would be random 256 length.

  const message = "TODO: database insert / create table!";
  res.status(200).json({"username": username,
                        "user_id": user_id,
                        "message": message});

}); 