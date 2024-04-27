/*
File: SearchResults/page.js
Author: Jess Turner
Description:
Use the data from `Home/CustomSearchBar.js`, send it to the backend, display search results to the user.

Expecting this format from the SearchBar:
    {
    state: 
        {
        searchString: "example search input"
        searchBy: "artist/album/song"
        }
    }


Note - we will ALWAYS display album results. 
don't bother displaying artists with clickable links.

Can direct the user to AlbumInfo by sending the following info to that page:
- name
- album cover
- artist name
- description
- tracklist
*/

import React from "react";
import { useLocation, // get data from previous page
         // useNavigate // send data to next page
       } from 'react-router-dom';
import "./SearchResults.css"

const BACKEND_COVER_URL_KEY = "coverURL";
const BACKEND_ARTIST_NAME_KEY = "artist";
const BACKEND_ALBUM_NAME_KEY = "album";
const BACKEND_YEAR_KEY = "year";
const BACKEND_ALBUM_ID_KEY = "album_id";
const BACKEND_TRACKS_KEY = "tracks";
const BACKEND_DESCRIPTION_KEY = "description";
// For displaying:
const KEYS_TO_CHECK = [
        BACKEND_COVER_URL_KEY, BACKEND_ARTIST_NAME_KEY, BACKEND_ALBUM_NAME_KEY, BACKEND_YEAR_KEY, // <- from the backend
        "coverImage" // <- from my helper function
];
const NUM_ITEMS_PER_ROW = KEYS_TO_CHECK.length;

const FRONTEND_COVER_IMAGE_KEY = "coverImage";

const handleSaveClick = () => {

}



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

function renderResultRow(index, resultRow) {

    const htmlRow = Object.assign({}, resultRow); // fully copy it so we can make changes
    populateImagesAndEmptyKeys(htmlRow);
    if (Object.keys(htmlRow).length < NUM_ITEMS_PER_ROW) {
        console.log("Unable to render this row:", htmlRow,
            "\tExpected number of items: ", NUM_ITEMS_PER_ROW, "Got:", Object.keys(htmlRow).length);
        return (<div>Unabled to display row. Got wrong number of items</div>);
    }

    populateImagesAndEmptyKeys(htmlRow);
    
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
                <p className="albumTitle">{htmlRow[BACKEND_ALBUM_NAME_KEY]} ({htmlRow[BACKEND_YEAR_KEY]})</p>
                <p>{htmlRow[BACKEND_ARTIST_NAME_KEY]}</p>
            </div>
            <div className="col-2 saveCol colVerticalCenter">
                <button id={index} onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    );
}

// not sure why it won't let me use tab size of 2
export default function SearchResults() {
    const location = useLocation();
    console.log("SearchResults.location=", location);

    // using `[constKey]: value` in brackets so that JS uses the string instead of the variable name as the key.
    console.log("REACT FRONT END HAS RECIEVED DATA")
    const apiResult = location.state.apiResult;

    let renderedResults = apiResult.map((row, index) => (
        renderResultRow(index, row)
    ));
    
    return (
        <div className="container">
            <h1>Search Results</h1>
            <div>
                Displaying results for <span style={{color: "green"}}>{location.state.searchString} </span> 
                
                    Search by <span style={{color: "purple"}}>{location.state.searchBy}</span>
            </div>
            <p>Under Construction :P</p>
            <div className="row categoriesRow">
                <div className="col-1 indexCol categoryColumn">#</div> 
                <div className="col-10 categoryColumn">Album Information</div>
                <div className="col-1 categoryColumn">Save</div>
            </div>
            {renderedResults}
        </div>
    );
    

}