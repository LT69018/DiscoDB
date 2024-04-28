
import {BACKEND_ALBUM_ID_KEY, BACKEND_ALBUM_NAME_KEY, BACKEND_ARTIST_NAME_KEY, BACKEND_YEAR_KEY} from "../ApiConstants.js";

const TEST_ITEMS_PER_ROW = 3;
const START_ALBUM_ID = 1;

function dummyListeningRow(album_id) {
  return {[BACKEND_ALBUM_ID_KEY]: album_id, 
          [BACKEND_ALBUM_NAME_KEY]: "testAlbumName", 
          [BACKEND_ARTIST_NAME_KEY]: "testArtistName",
          [BACKEND_YEAR_KEY]: 2024};
}


function populateDummyListeningTables(user_listening_past, user_listening_present, user_listening_future) {
    
  for (let test_id = START_ALBUM_ID; test_id < TEST_ITEMS_PER_ROW + START_ALBUM_ID; test_id++) {
    console.log("Pushing rows to tables!");
    user_listening_past.push(dummyListeningRow((0 * TEST_ITEMS_PER_ROW) + test_id));
    user_listening_present.push(dummyListeningRow((1 * TEST_ITEMS_PER_ROW) + test_id));
    user_listening_future.push(dummyListeningRow((2 * TEST_ITEMS_PER_ROW) + test_id));
  }
}

export default populateDummyListeningTables;