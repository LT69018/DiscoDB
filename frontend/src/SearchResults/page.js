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
import "./Constants.js";

import ResultRow from "./ResultRow.js";

const handleSaveClick = () => {

}



// not sure why it won't let me use tab size of 2
export default function SearchResults() {
    const location = useLocation();
    console.log("SearchResults.location=", location);

    // using `[constKey]: value` in brackets so that JS uses the string instead of the variable name as the key.
    let displayHeader = <div>Attempting to display results</div>;
    let renderedResults = <div>Unable to render search results.</div>;
    if (location.state === null) {
        console.log("[React Front End / SearchResults] Failed to get state from location :(");
    } else {
        console.log("REACT FRONT END HAS RECIEVED DATA");
        displayHeader = (<div>
                Displaying results for <span style={{color: "green"}}>{location.state.searchString} </span> 
                
                    Search by <span style={{color: "purple"}}>{location.state.searchBy}</span>
        </div>);
        const apiResult = location.state.apiResult;
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
        <div className="container">
            <h1>Search Results</h1>
            {displayHeader}
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