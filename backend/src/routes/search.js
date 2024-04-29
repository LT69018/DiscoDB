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
  const mysql = require("mysql2"); // could also use mysql2, but mysql apparently doesn't require compiling

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
    console.log("eyyy I'm workin 'ere 2")
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
      console.log("eyyy I'm workin 'ere")
      if (query_err) {
        console.log("[GET /test_db_connection] Query Error:", query_err);
        result_json["query_result"] = null;
        result_json["message"] = "Can't execute query.";
        // sendStatus doesn't seem to work either :(
        res.status(500).json(result_json);
        next(query_err);
      } else {
        result_json["query_result"] = query_res;
        
        console.log(query_res)


        /*results_dict = {}
        cursor.callproc("search_by_artist_name", args=("zappa"))
        for result in cursor.stored_results():
            for row in result:
                if not results_dict.get(row[0]):
                    # Construct the dictionary for this album
                    results_dict[row[0]] = {"album_title": row[1],
                                            "release_date": row[2],
                                            "primary_artists": [row[3]]}
                else:
                    # Add a primary artist to the primary_artists list
                    results_dict[row[0]]["primary_artists"].append(row[3])*/

        /*for result in query_res[0]:
          if not results_dict.get(row[0]):
            // Construct the dictionary for this album
            test_api_result[0][row[0]] = {"album_title": row[1],
                                          "release_date": row[2],
                                          "primary_artists": [row[3]]}
          else:
            // Add a primary artist to the primary_artists list
            results_dict[row[0]]["primary_artists"].append(row[3])*/

        /*
          {24823820: {album_title: "Zappa '75 Zagreb / Ljubljana",
                      release_date: '2022-10-14',
                      primary_artists: ['Frank Zappa', 'captain beefheart']},
          ...
          }

      album_id: 24823820,
      album_title: "Zappa '75 Zagreb / Ljubljana",
      release_date: '2022-10-14',
      artist_name: 'Frank Zappa'
    }
        */

        api_results = []

        query_res[0].forEach(row => {
          if (!api_results[row["album_id"]]) {
            api_results[row["album_id"]] = {
                [BACKEND_ALBUM_NAME_KEY]: row["album_title"],
                  release_date: row["release_date"],
  
                  primary_artists: row["artist_name"]
              };
          } else {
            api_results[row["album_id"]].primary_artists += ", " + row["artist_name"];
          }
        });

        console.log(query_res[0][0])
        console.log(query_res[0][0]["album_id"])
        console.log("api_results:")
        console.log(api_results)

        const test_api_result = [
          {[BACKEND_ARTIST_NAME_KEY]: 'Artist zero', [BACKEND_ALBUM_NAME_KEY]: 'Album Name', 
              [BACKEND_YEAR_KEY]: 1970, [BACKEND_ALBUM_ID_KEY]: 5656156, [BACKEND_COVER_URL_KEY]: null,
              // these last few are just for the /AlbumInfo page, I won't display them
              [BACKEND_TRACKS_KEY]: ["Song1", "Song2"], [BACKEND_DESCRIPTION_KEY]:"Hey I'm an album"
              },
          {[BACKEND_ARTIST_NAME_KEY]: "Artist one", [BACKEND_ALBUM_NAME_KEY]:"Album Name",
                [BACKEND_YEAR_KEY]: 2024,[BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/237/200/300"},
          {[BACKEND_ARTIST_NAME_KEY]: "Artist two", [BACKEND_ALBUM_NAME_KEY]:"Album Name", 
              [BACKEND_YEAR_KEY]: 2024, [BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/238/200/300"}
        ];

        console.log(`[GET /test_db_connection]\n\tSuccessfully ran query in /test_db_connection! Result: \n\t${JSON.stringify(query_res)}`);
        result_json["message"] = "Successfully ran /test_db_connection (connected and queried)";
        res.status(200).json(result_json);
      } 
    });
  });

  //res.json(test_api_result)

});

module.exports = router;