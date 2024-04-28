import {
  //BACKEND_COVER_URL_KEY,
  BACKEND_ARTIST_NAME_KEY,
  BACKEND_ALBUM_NAME_KEY,
  BACKEND_YEAR_KEY,
  BACKEND_ALBUM_ID_KEY,
  // BACKEND_TRACKS_KEY,
  // BACKEND_DESCRIPTION_KEY,
  BACKEND_DESCRIPTION_KEY,
  BACKEND_TRACKS_KEY} from "./Constants.js";

const TEST_API_RESULT = {
  [BACKEND_ALBUM_NAME_KEY]: "I'm an album",
  [BACKEND_YEAR_KEY]: 2099,
  [BACKEND_ARTIST_NAME_KEY]: "example artist",
  [BACKEND_DESCRIPTION_KEY]: "This is a TEST api result. Have a wonderful day <3",
  [BACKEND_TRACKS_KEY]: ["Song 1", "Song 2", "Song 3"] 
};

export default function get_album_info_api(album_id) {
  console.log("Todo: API search using album_id=", album_id);
  const apiResult = TEST_API_RESULT;

  /* Fill in with fetch request
  
  
  
  */
  let returnResult = {};
  // album name (string)
  if (!(BACKEND_ALBUM_NAME_KEY in apiResult)) {
    console.log(`[AlbumInfo page] Missing ALBUM NAME key ('${BACKEND_ALBUM_NAME_KEY}')  to display.`);
    returnResult[BACKEND_ALBUM_NAME_KEY] = "N/A";
  } else {
    returnResult[BACKEND_ALBUM_NAME_KEY] = apiResult[BACKEND_ALBUM_NAME_KEY];
  }
  // artist name (string)
  if (!(BACKEND_ARTIST_NAME_KEY in apiResult)) {
    console.log(`[AlbumInfo page] Missing ARTIST key ('${BACKEND_ARTIST_NAME_KEY}') to display.`)
    returnResult[BACKEND_ARTIST_NAME_KEY] = "N/A";
  } else {
    returnResult[BACKEND_ARTIST_NAME_KEY] = apiResult[BACKEND_ARTIST_NAME_KEY];
  }

  // year number
  if (!(BACKEND_YEAR_KEY in apiResult)) {
    console.log(`[AlbumInfo page] Missing YEAR key ('${BACKEND_YEAR_KEY}') to display.`)
    returnResult[BACKEND_YEAR_KEY] = "yyyy";
  } else {
    returnResult[BACKEND_YEAR_KEY] = apiResult[BACKEND_YEAR_KEY];
  }

  // description: notes about the album
  if (!(BACKEND_DESCRIPTION_KEY in apiResult)) {
    console.log(`[AlbumInfo page] Missing DESCRIPTION key ('${BACKEND_DESCRIPTION_KEY}') to display.`)
    returnResult[BACKEND_DESCRIPTION_KEY] = "N/A";
  } else {
    returnResult[BACKEND_DESCRIPTION_KEY] = apiResult[BACKEND_DESCRIPTION_KEY];
  }
  // tracks - list of songs
  if (!(BACKEND_TRACKS_KEY in apiResult)) {
    console.log(`[AlbumInfo page] Missing TRACKS key ('${BACKEND_TRACKS_KEY}') to display.`)
    returnResult[BACKEND_TRACKS_KEY] = "N/A";
  } else {
    returnResult[BACKEND_TRACKS_KEY] = apiResult[BACKEND_TRACKS_KEY];
  }
  return returnResult;
}