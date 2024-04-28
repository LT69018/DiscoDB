var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var searchRouter = require("./routes/search");
const { port } = require("./config");
const PORT = port;

const app = express();
app.use(cors()); // prep for frontend pings.
/* ======================== (start) REFERENCE:github/docker ==================
/* - these comments and imports come from the reference. */
// simple node web server that displays hello world
// optimized for Docker image
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const database = require("./database");

app.use(logger("common"));
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
});

// view engine setu
app.set('view engine', 'jade')
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/query_user_search", searchRouter);

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


app.get('/healthz', function(req, res, next) {
  console.log("HELLO WORLD")
  res.send(80)
});

// console.log("Started running on PORT " + PORT)
app.get("/test_db_connection", function(req, res, next){
  /*
  Run a simple query to see if we can connect to the docker image, particularly to a designated database.
  :param: (none required)
  :return: {"query_result": ..., "message": "..."}
  - In case of failure, aiming to explain why the "query_result" is null in the "message"
  */
  const query_string = "SELECT 1"; // "SHOW TABLES";
  const result_json = {"query_result": null, "message": ""}; 
  //^  if these values are returned in this same state, (null / ""), that means I forgot to set them in every case :p
  
  // According to npm `mysql` documentation, query() should automatically try to make a connection.
  // but I was having trouble with that so I'll try manually.
  database.connection.connect(function(conn_err) {
    if (conn_err) {
      console.error("[GET /test_db_connection] Connection Error:", conn_err);
      result_json["query_string"] = null;
      result_json["message"] = "Can't connect to database.";
      res.status(500).json(result_json);
      next(conn_err);
    } else {
      console.log("[GET /test_db_connection] Successfully connected to database!!");
    }
    database.connection.query(query_string, (query_err, query_res) => {
      if (query_err) {
        console.error("[GET /test_db_connection] Query Error:", query_err);
        result_json["query_result"] = null;
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
  });
});






// Reference: https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.error("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + 
                "------------ Server.js Caught Error ------------\n" +
                "------------------------------------------------\n"
                + err.stack + 
              "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  res.status(500).send('Something broke!')
});


module.exports = app;