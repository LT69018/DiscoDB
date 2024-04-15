import React from "react";

const BACKEND_COVER_URL_KEY = "coverURL";
const BACKEND_ARTIST_NAME_KEY = "artist";
const BACKEND_ALBUM_NAME_KEY = "album";
const BACKEND_YEAR_KEY = "year";

const FRONTEND_COVER_IMAGE_KEY = "coverImage";

function populateImagesAndEmptyKeys(searchResult) {
    if (! (BACKEND_COVER_URL_KEY in searchResult)) {
        searchResult[BACKEND_COVER_URL_KEY] = <img alt="No cover available"/>;
    } else if (searchResult[BACKEND_COVER_URL_KEY] == null) {
        searchResult[FRONTEND_COVER_IMAGE_KEY] = <img alt="No cover available"/>;
    } else {
        searchResult[FRONTEND_COVER_IMAGE_KEY] = <img href={searchResult[BACKEND_COVER_URL_KEY]} alt="Invalid coverURL"/>;
    }
}

function renderResultRow(resultRow) {
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
        <div class="row">
            <div class="col">
                {htmlRow["coverImage"]}
            </div>
        </div>
    );
}

// not sure why it won't let me use tab size of 2
function SearchResults() {
    const test_api_result = [
        {BACKEND_ARTIST_NAME_KEY: 'Stevie Wonder', BACKEND_ALBUM_NAME_KEY: 'Innervision', BACKEND_YEAR_KEY: 1970, BACKEND_COVER_URL_KEY: null},
        {BACKEND_ARTIST_NAME_KEY: '', BACKEND_ALBUM_NAME_KEY: '', BACKEND_YEAR_KEY: 2000, BACKEND_COVER_URL_KEY: null},
        {BACKEND_ARTIST_NAME_KEY: "Artist one", BACKEND_ALBUM_NAME_KEY:"Album Name", BACKEND_COVER_URL_KEY: "https://picsum.photos/id/237/200/300"},
        {BACKEND_ARTIST_NAME_KEY: "Artist two", BACKEND_ALBUM_NAME_KEY:"Album Name", BACKEND_COVER_URL_KEY: "https://picsum.photos/id/238/200/300"}
    ];

    let renderedResults = test_api_result.map(row => (
        renderResultRow(row)
    ));

    return (
        <div class="container">
            <h1>Search Results</h1>
            <p>Under Construction :P</p>
            {renderedResults}
        </div>
    );
}

export default SearchResults;