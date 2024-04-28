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
        useNavigate // send data to next page
       } from 'react-router-dom';
import "./SearchResults.css"
import "./Constants.js";

import ResultRow from "./ResultRow.js";
import { BACKEND_ALBUM_NAME_KEY } from "./Constants.js";


// not sure why it won't let me use tab size of 2
export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log("SearchResults.location=", location);
    
    const handleSaveClick = (album_id, selectedDestTable) => {
        const encodedAlbumID = encodeURIComponent(album_id);
        const encodedSelection = encodeURIComponent(selectedDestTable)
        // todo: consolidate expected key names for this method :P
        fetch(`localhost:8080/save_album_for_user?album_id=${encodedAlbumID}&saveTo=${encodedSelection}`, 
            {method:"POST"}
        )
            .then(res => {
                console.log("Sent [POST /save_album_for_user] with album_id", album_id,
                            "\tGot result:", res)
                return res.json})
            .catch(err => err);
    }
    // using `[constKey]: value` in brackets so that JS uses the string instead of the variable name as the key.
    let displayHeader = <div>Attempting to display results</div>;
    let renderedResults = <div>Unable to render search results.</div>;
    if (location.state === null) {
        console.log("[React Front End / SearchResults] Failed to get state from location :(");
    } else {
        console.log("REACT FRONT END HAS RECIEVED DATA");
        console.log("State = ", location.state);
        displayHeader = (<div>
                Displaying results for <span style={{color: "green"}}>{location.state.searchString} </span> 
                
                    Search by <span style={{color: "purple"}}>{location.state.searchBy}</span>
        </div>);
        const apiResult = location.state.apiResult;
        // apiResult.push({"album": "a", "album_id":1, "year": 2020, "artist": "JT"}); // for testing overflow :P
        console.log("Api Result: ", apiResult);
        if (apiResult === null) {
            // do nothing.
        } else {
            renderedResults = apiResult.map((row, index) => (
                <ResultRow
                    index={index}
                    row={row}
                    handleSaveClick={handleSaveClick} // todo: use this in ./ResultRow.js
                />
            ));
        }
    }
    
    
    return (
        <div className="container-fluid">
            <h1>Search Results</h1>
            {displayHeader}
            <p>Under Construction :P</p>

            <div className="row">
                <div className="col-1"></div>
                <div className="col-10 allResultsRow rounded">
                    {/* Note: 4/27 - I know it may be inconvenient that the category strings move down when you scroll 
                        But we don't have time or energy to fix it :p I tried :/
                    */}
                    <div className="row categoriesRow">
                        <div className="col-1 indexCol categoryColumn">#</div> 
                        <div className="col-2 categoryColumn">Album Cover</div>
                        <div className="col categoryColumn">Album Information</div>
                        <div className="col-2 categoryColumn">Save</div>
                    </div>  
                    {renderedResults}
                </div>
                <div className="col-1"></div>
            </div>
        </div>
    );
    

}