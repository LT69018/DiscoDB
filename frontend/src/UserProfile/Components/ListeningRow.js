import "./ListeningTable.css";
import {
  //BACKEND_COVER_URL_KEY,
  BACKEND_ARTIST_NAME_KEY,
  BACKEND_ALBUM_NAME_KEY,
  BACKEND_YEAR_KEY,
  // BACKEND_ALBUM_ID_KEY,
  // BACKEND_TRACKS_KEY,
  // BACKEND_DESCRIPTION_KEY,
  // NUM_ITEMS_PER_ROW,
  // FRONTEND_COVER_IMAGE_KEY
} from "../ApiConstants.js";

const ListeningRow = ({index, row, album_id}) => {
  return (
    <div className="row tinyListeningRow rounded" id={index} key={"rowKey" + album_id}>
      <div className="col-1 indexCol colVerticalCenter">
          {index}
      </div>
      <div className="col-3 imageCol">
        <img className="img-responsive object-fit-scale albumCover" src="default_cover_art.jpg" alt="Unable to display generic cover art :("/>
      </div>
      <div className="col" style={{textAlign: "left"}}> 
          <p className="albumTitle">Title: {row[BACKEND_ALBUM_NAME_KEY]} ({row[BACKEND_YEAR_KEY]})</p>
          <p className="albumArtist">Artist: {row[BACKEND_ARTIST_NAME_KEY]}</p>
      </div>
    </div>
  );
}

export default ListeningRow;