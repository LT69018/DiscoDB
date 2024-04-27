/*
File: frontend/SearchResults/Constants.js
Author: Jess Turner
Date: 4/26/2024
Description: move constants to a separate file as we work on backend API to get database query results to display on this page.
*/

// these are the values to set!
const BACKEND_KEYS = {
  // key description: backend JSON result key name
  "cover url key"   :  "coverURL",
  "artist name key" :  "artist",
  "album name key"  :  "album",
  "year key"        :  "year",
  "album id key"    :  "album_id",
  "tracks key"      :  "tracks",
  "description key" :  "description"
};
// for displaying
const KEYS_TO_CHECK =  [BACKEND_KEYS["cover url key"], BACKEND_KEYS["artist name key"], BACKEND_KEYS["album name key"], BACKEND_KEYS["year key"], // <- from the backend
  "coverImage" // <- from my helper function
]

// eslint-disable-next-line
const FRONTEND_COVER_IMAGE_KEY = "coverImage";

// module.exports = {
//   BACKEND_COVER_URL_KEY: BACKEND_KEYS["cover url key"],
//   BACKEND_ARTIST_NAME_KEY: BACKEND_KEYS["artist name key"],
//   BACKEND_ALBUM_NAME_KEY: BACKEND_KEYS["album name key"],
//   BACKEND_YEAR_KEY: BACKEND_KEYS["year key"],
//   BACKEND_ALBUM_ID_KEY: BACKEND_KEYS["album id key"],
//   BACKEND_TRACKS_KEY: BACKEND_KEYS["tracks key"],
//   BACKEND_DESCRIPTION_KEY: BACKEND_KEYS["description key"],
  
//   NUM_ITEMS_PER_ROW: KEYS_TO_CHECK.length,
//   FRONTEND_COVER_IMAGE_KEY: String(FRONTEND_COVER_IMAGE_KEY)
// }

/* ======== THESE ARE THEM BEING EXPORTED, LEAVE ALONE =============== */

// eslint-disable-next-line
export const BACKEND_COVER_URL_KEY =  BACKEND_KEYS["cover url key"];
// eslint-disable-next-line
export const BACKEND_ARTIST_NAME_KEY = BACKEND_KEYS["artist name key"] ;
// eslint-disable-next-line
export const BACKEND_ALBUM_NAME_KEY = BACKEND_KEYS["album name key"] ;
// eslint-disable-next-line
export const BACKEND_YEAR_KEY = BACKEND_KEYS["year key"] ;
// eslint-disable-next-line
export const BACKEND_ALBUM_ID_KEY = BACKEND_KEYS["album id key"] ;
// eslint-disable-next-line
export const BACKEND_TRACKS_KEY = BACKEND_KEYS["tracks key"] ;
// eslint-disable-next-line
export const BACKEND_DESCRIPTION_KEY = BACKEND_KEYS["description key"] ;
// eslint-disable-next-line
export const NUM_ITEMS_PER_ROW = KEYS_TO_CHECK.length ;
//const FRONTEND_COVER_IMAGE_KEY = String(FRONTEND_COVER_IMAGE_KEY)