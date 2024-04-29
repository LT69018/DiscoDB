var express = require('express');
var router = express.Router();

const BACKEND_COVER_URL_KEY = "coverURL";
const BACKEND_ARTIST_NAME_KEY = "artist";
const BACKEND_ALBUM_NAME_KEY = "album";
const BACKEND_YEAR_KEY = "year";
const BACKEND_ALBUM_ID_KEY = "album_id";
const BACKEND_TRACKS_KEY = "tracks";
const BACKEND_DESCRIPTION_KEY = "description";

/*
Search by album_id returns 5 relations now:
- albums
- songs
- genres
- videos
- artist_album_credits NATURAL JOIN artists (artist_name, role (i.e. writer/producer/bass-player))
*/
const test_api_result = [
    {[BACKEND_ARTIST_NAME_KEY]: 'Artist zero', [BACKEND_ALBUM_NAME_KEY]: 'Album Name', 
        [BACKEND_YEAR_KEY]: 1970, [BACKEND_COVER_URL_KEY]: null,
        // these last few are just for the /AlbumInfo page, I won't display them
        [BACKEND_TRACKS_KEY]: ["Song1", "Song2"], [BACKEND_DESCRIPTION_KEY]:"Hey I'm an album"
        },
    {[BACKEND_ARTIST_NAME_KEY]: "Artist one", [BACKEND_ALBUM_NAME_KEY]:"Album Name",
         [BACKEND_YEAR_KEY]: 2024,[BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/237/200/300"},
    {[BACKEND_ARTIST_NAME_KEY]: "Artist two", [BACKEND_ALBUM_NAME_KEY]:"Album Name", 
        [BACKEND_YEAR_KEY]: 2024, [BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/238/200/300"}
];


/* GET home page (/query_user_search). 
  - params: 
    - searchString (string) i.e. "Thriller"
    - searchBy (string) i.e. "album name" (other options: "artist", "song")   
  - return top 50 results  
*/
router.get('/', function(req, res, next) {
  const mysql = require("mysql2");

  var con = mysql.createConnection({
    host: "localhost",
    user: "sql_test_4_28",
    password: "test12345",
    insecureAuth : true
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    }
    console.log("Connected!");
  });

  const database = require("../database");

  const query_string = "call search_by_song_title('muffin man')"
  //const query_string = "call search_by_album_id(4795903)"
  const result_json = {"query_result": null, "message": ""}; 

  console.log("HELLO WORLD: recieved param: " + JSON.stringify(req.query))
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
        console.log("[GET /test_db_connection] Query Error:", query_err);
        result_json["query_result"] = null;
        result_json["message"] = "Can't execute query.";
        // sendStatus doesn't seem to work either :(
        res.status(500).json(result_json);
        next(query_err);
      } else {
        result_json["query_result"] = query_res;
        
        api_results = {}

        query_res[0].forEach(row => {
          if (!api_results[row["album_id"]]) {
            api_results[row["album_id"]] = {
              [BACKEND_ALBUM_ID_KEY]: row["album_id"],
                [BACKEND_ALBUM_NAME_KEY]: row["album_title"],
                [BACKEND_YEAR_KEY]: row["release_date"],
                [BACKEND_ARTIST_NAME_KEY]: row["artist_name"]
              };
          } else {
            api_results[row["album_id"]][[BACKEND_ARTIST_NAME_KEY]]+= ", " + row["artist_name"];
          }
        });

        console.log(query_res[0][0])
        console.log(query_res[0][0]["album_id"])
        console.log("api_results:")
        console.log(api_results)
        console.log(api_results[367910])
        console.log(Object.keys(api_results).length)

        //console.log(`[GET /test_db_connection]\n\tSuccessfully ran query in /test_db_connection! Result: \n\t${JSON.stringify(query_res)}`);
        result_json["message"] = "Successfully ran /test_db_connection (connected and queried)";
        res.json(api_results)
      } 
    });
  });
});

module.exports = router;