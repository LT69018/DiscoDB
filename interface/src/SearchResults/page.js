import React from "react";
import "./SearchResults.css"

const BACKEND_COVER_URL_KEY = "coverURL";
const BACKEND_ARTIST_NAME_KEY = "artist";
const BACKEND_ALBUM_NAME_KEY = "album";
const BACKEND_YEAR_KEY = "year";

const FRONTEND_COVER_IMAGE_KEY = "coverImage";

function populateImagesAndEmptyKeys(searchResult) {
    if (! (BACKEND_COVER_URL_KEY in searchResult)) {
        searchResult[FRONTEND_COVER_IMAGE_KEY] = <img alt="No cover available. Result is missing link key."/>;
    } else if (searchResult[BACKEND_COVER_URL_KEY] == null) {
        searchResult[FRONTEND_COVER_IMAGE_KEY] = <img alt="No cover available. Result URL key is empty (null)."/>;
    } else {
        console.log("[DEBUG] Attempting to render this image href: ", searchResult[BACKEND_COVER_URL_KEY]);
        searchResult[FRONTEND_COVER_IMAGE_KEY] = <img href={searchResult[BACKEND_COVER_URL_KEY]} alt="Invalid coverURL"/>;
    }
}

function renderResultRow(index, resultRow) {
    const KEYS_TO_CHECK = [
        BACKEND_COVER_URL_KEY, BACKEND_ARTIST_NAME_KEY, BACKEND_ALBUM_NAME_KEY, BACKEND_YEAR_KEY, // <- from the backend
        "coverImage" // <- from my helper function
    ];
    const NUM_ITEMS_PER_ROW = KEYS_TO_CHECK.length;

    const htmlRow = Object.assign({}, resultRow); // fully copy it so we can make changes
    populateImagesAndEmptyKeys(htmlRow);
    if (Object.keys(htmlRow).length !== NUM_ITEMS_PER_ROW) {
        console.log("Unable to render this row:", htmlRow,
            "\tExpected number of items: ", NUM_ITEMS_PER_ROW, "Got:", Object.keys(htmlRow).length);
        return (<div>Unabled to display row. Got wrong number of items</div>);
    }

    populateImagesAndEmptyKeys(htmlRow);
    
    return (
        <div class="row resultRow rounded" id={index}>
            <div class="col-lg-1 indexCol colVerticalCenter">
                {index}
            </div>
            <div class="col-lg-2 imageCol">
                {htmlRow[FRONTEND_COVER_IMAGE_KEY]}
            </div>
            <div class="col" style={{textAlign: "left"}}> 
                <p class="albumTitle">{htmlRow[BACKEND_ALBUM_NAME_KEY]} ({htmlRow[BACKEND_YEAR_KEY]})</p>
                <p>{htmlRow[BACKEND_ARTIST_NAME_KEY]}</p>
            </div>
            <div class="col-lg-2 saveCol colVerticalCenter">
                <button>Save</button>
            </div>
        </div>
    );
}


// not sure why it won't let me use tab size of 2
export default function SearchResults() {
    // using `[constKey]: value` in brackets so that JS uses the string instead of the variable name as the key.
    const test_api_result = [
        {[BACKEND_ARTIST_NAME_KEY]: 'Stevie Wonder', [BACKEND_ALBUM_NAME_KEY]: 'Innervision', [BACKEND_YEAR_KEY]: 1970, [BACKEND_COVER_URL_KEY]: null},
        {[BACKEND_ARTIST_NAME_KEY]: "Artist one", [BACKEND_ALBUM_NAME_KEY]:"Album Name", [BACKEND_YEAR_KEY]: 2024,[BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/237/200/300"},
        {[BACKEND_ARTIST_NAME_KEY]: "Artist two", [BACKEND_ALBUM_NAME_KEY]:"Album Name", [BACKEND_YEAR_KEY]: 2024, [BACKEND_COVER_URL_KEY]: "https://picsum.photos/id/238/200/300"}
    ];

    let renderedResults = test_api_result.map((row, index) => (
        renderResultRow(index, row)
    ));

    return (
        <div class="container">
            <h1>Search Results</h1>
            <p>Under Construction :P</p>
            <div class="row categoriesRow">
                <div class="col ">#</div>
            </div>
            {renderedResults}
        </div>
    );
}