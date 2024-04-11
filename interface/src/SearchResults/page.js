import React from "react";

function renderResultRow(resultRow) {
    const KEYS_TO_CHECK = ["cover", "artist", "album", "year"];
    const NUM_ITEMS_PER_ROW = KEYS_TO_CHECK.length;

    if (Object.keys(resultRow).length != NUM_ITEMS_PER_ROW) {
        console.log("Unable to render this row:", resultRow);
        return (<div>Unabled to display row. Got wrong number of items</div>);
    }

    const theCoverImage = resultRow["cover"] !== null ? resultRow["cover"] : <img alt="No cover available"/>

    return (
        <div class="row">
            <div class="col">
                {theCoverImage}
            </div>
        </div>
    );
}

// not sure why it won't let me use tab size of 2
function SearchResults() {
    const test_api_result = [
        {'artist': 'Stevie Wonder', 'album': 'Innervision', 'year': 1970, "cover": null},
        {'artist': '', 'album': '', 'year': 2000, cover: null},
        {"artist": "Artist one", "album":"Album Name", "cover": "https://picsum.photos/id/237/200/300"},
       {"artist": "Artist two", "album":"Album Name", "cover": "https://picsum.photos/id/238/200/300"}
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