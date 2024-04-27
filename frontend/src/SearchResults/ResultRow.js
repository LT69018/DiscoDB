import {BACKEND_COVER_URL_KEY,
  BACKEND_ARTIST_NAME_KEY,
  BACKEND_ALBUM_NAME_KEY,
  BACKEND_YEAR_KEY,
  // BACKEND_ALBUM_ID_KEY,
  // BACKEND_TRACKS_KEY,
  // BACKEND_DESCRIPTION_KEY,
  NUM_ITEMS_PER_ROW,
  FRONTEND_COVER_IMAGE_KEY} from "./Constants.js";
import  "./SearchResults.css";
import {Link} from "react-router-dom";

const ResultRow = ({index, row, handleSaveClick}) => { // note, row should contain `album_id` to nav to search results page.

  const htmlRow = {} // initalize on separate row to Object.assign() in case that was the reason not all keys were present.
  Object.assign(htmlRow, row); // fully copy it so we can make changes
  console.log("[Before pop images] Inside <ResultRow/> With row =");
  console.log(htmlRow, row);
  populateImagesAndEmptyKeys(htmlRow);
  console.log("[After pop images] Inside <ResultRow/> With row =")
  console.log(htmlRow);
  if (Object.keys(htmlRow).length < NUM_ITEMS_PER_ROW) {
      console.log("Unable to render this row:", htmlRow,
          "\tExpected number of items: ", NUM_ITEMS_PER_ROW, "Got:", Object.keys(htmlRow).length);
      return (<div>Unabled to display row. Got wrong number of items</div>);
  }
  
  // THIS IS WHAT DISPLAYS ONE ROW :<)
  return (
      <div className="row resultRow rounded" id={index} key={"rowKey" + index}>
          <div className="col-1 indexCol colVerticalCenter">
              {index}
          </div>
          <div className="col-2 imageCol">
              {htmlRow[FRONTEND_COVER_IMAGE_KEY]}
          </div>
          <div className="col" style={{textAlign: "left"}}> 
              <p className="albumTitle">
                <Link to="/AlbumInfo" className="albumLink" state={{
                    
                }}>
                {htmlRow[BACKEND_ALBUM_NAME_KEY]} ({htmlRow[BACKEND_YEAR_KEY]})
                </Link>
              </p>
              <p>{htmlRow[BACKEND_ARTIST_NAME_KEY]}</p>
          </div>
          <div className="col-2 saveCol colVerticalCenter">
                <div>
                    <select name="whichTableSaveTo" style={{width: "50%"}}>
                        <option value="past">Past</option>
                        <option value="present">Present</option>
                        <option value="future">Future</option>
                    </select>
                </div>
                <button id={index} onClick={handleSaveClick} style={{width: "50%"}}>Save</button>
          </div>
      </div>
  );
}

// helper!
function populateImagesAndEmptyKeys(searchResult) {
  // (if can't load the image reference) use the default album image that we drew on a white board 
  const defaultImagePath = "default_cover_art.jpg"
  if (! (BACKEND_COVER_URL_KEY in searchResult)) {
      searchResult[FRONTEND_COVER_IMAGE_KEY] = <img alt="Result is missing link key." src={defaultImagePath} className="albumCover"/>;
  } else if (searchResult[BACKEND_COVER_URL_KEY] == null) {
      
      searchResult[FRONTEND_COVER_IMAGE_KEY] = <img alt="Result URL key is empty (null)." src={defaultImagePath} className="albumCover"/>;
  } else {
      // console.log("[DEBUG] Attempting to render this image href: ", searchResult[BACKEND_COVER_URL_KEY]);
      searchResult[FRONTEND_COVER_IMAGE_KEY] = 
          <img src={searchResult[BACKEND_COVER_URL_KEY]} 
               alt="Invalid coverURL"
               className="albumCover"/>;
  }
}

export default ResultRow;