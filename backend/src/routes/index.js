var express = require('express');
var router = express.Router();

const BACKEND_COVER_URL_KEY = "coverURL";
const BACKEND_ARTIST_NAME_KEY = "artist";
const BACKEND_ALBUM_NAME_KEY = "album";
const BACKEND_YEAR_KEY = "year";
const BACKEND_ALBUM_ID_KEY = "album_id";
const BACKEND_TRACKS_KEY = "tracks";
const BACKEND_DESCRIPTION_KEY = "description";

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


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("HELLO WORLD")
  res.send("API is running correctly")
});

module.exports = router;