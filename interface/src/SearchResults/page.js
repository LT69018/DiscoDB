import React from "react";

// not sure why it won't let me use tab size of 2
function SearchResults() {
    const test_api_result = [
        {'artist': 'Stevie Wonder', 'album': 'Innervision', 'year': 1970},
        {'artist': '', 'album': '', 'year': 2000}
    ];

    let resultsToRender = test_api_result.map(row => (
        <div class="row">
            <div class="col">

            </div>
        </div>
    ));

    return (
        <div class="container">
            <h1>Search Results</h1>
            <p>Under Construction :P</p>
        </div>
    );
}

export default SearchResults;