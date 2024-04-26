var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var searchRouter = require("./routes/search");
const PORT = process.env.PORT;

const express = require("express");
const mysql = require("mysql2");

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
  res.set("Content-Type", "application/json");
  // ^ hopefully resolves `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`
  json_response = {}
  // database.raw('select VERSION() version')
  //   .then(([rows, columns]) => rows[0])
  //   .then((row) => json_response["data"] = `Hello from MySQL ${row.version}`)
  //   .catch(next);
  json_response["message"] = "Successfully pinged GET '/'";
  res.send(json_response);
    
var app = express();

// view engine setu
app.set('view engine', 'jade')
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/SearchResults", searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render("error");
});

app.listen(PORT);


app.get('/healthz', function(req, res, next) {
  console.log("HELLO WORLD")
  res.send(80)
});

console.log("Started running on PORT " + PORT)
app.get("/test_db_connection", function(req, res, next){
  const query_string = "SHOW TABLES";
  const result = null;
  database.connection.query(query_string, (err, res) => {
    if (err) {
      console.error("[GET /test_db_connection] Error:", err);
      throw ("Database error!");
    }
    result = res;
  });
  // this is my backup in case catching an error in the database query function doesn't work
  // Promise.resolve().then(()=>{
  //   res.status(500).json({"message": "Failed to /test_db_connection", "query_result": result});
  // }).catch(next);
  console.log(`\tSuccessfully ran query\n\t'${query_string}'\n\tWith result:\n\t\t${result}`)
  res.status(200).json({"message": "Successfully ran /test_db_connection", "query_result": result})
});

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
  const message = "TODO: database insert / create table!";
  res.status(200).json({"username": username,
                        "user_id": user_id,
                        "message": message});

}); 

app.post("/save_album_for_user", function(req, res, next) {
  /*
  :param user_id: Which user wants to save this album. 
    From the `users` table. 
    i.e. from the result of `POST /add_user`
  :param plan_type: ("past", "present", "future");
  :param album_id: from `albums` table. The album they want to save
  - we'll translate this into an integer

  :return: {"message": ``}
  */
});

app.get("/load_user_saves", function(req, res){
  /*
  - Parameters
    - user_id (integer)
  - Returns the 3 tables to display.
  - reads all of the info from the one "user_listening" table, but seperates it for ease on the frontend.
  {
      "future": [
          "album_id": ...
          "album_name": ...
          (maybe) "album_cover_url": ...

      ], "present" : [...], "past" : [...]
  }
  */
});

// IMPORTANT
// todo: implement this at least with 1 dummy result with the same format as the database.
// -> then try selectOne from the database, then try select * (or some set number)
app.get("/query_user_search", function(req, res, next){
  /*
  - params: 
    - searchString (string) i.e. "Thriller"
    - searchBy (string) i.e. "album name" (other options: "artist", "song")   
  - return top 50 results  
  */
});



// Reference: https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.error("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + 
                "------------ Server.js Caught Error ------------\n" +
                "------------------------------------------------\n"
                + err.stack + 
              "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  res.status(500).send('Something broke!')
})
module.exports = app;