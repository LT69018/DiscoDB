import React from 'react';
import './styles.css'; // Import the CSS file
import { Container, Row, Col } from "react-bootstrap";
import album_c from "./default_cover_art.jpg"
import { useLocation, // get data from previous page
         // useNavigate // send data to next page
       } from 'react-router-dom';

export default function AlbumPage(){
    const location = useLocation();
    const resultdict = {
        "album_id": 110011,//location.state.albumID,
        "artist_name": "Ayush",
        "album_name": "songsong",
        "tracklist": ["Hello","He99","Boool"],
        "description":"asdfghjwertyuisdfghjcvb"
    }
    console.log("SearchResults.location=", location);
    return (
        <div className='body'>
            <div className="Row album-info">
               
                    <div className="column">
                        <div className="album-image">
                            <img src={album_c} alt="Album Cover"/>
                        </div>
                    </div>
                    <div className="column">
                        <div className="album-details">
                            <h1>{resultdict["album_name"]}</h1>
                            <h2>{resultdict["artist_name"]}</h2> 
                            {/*<h1>{location.state.album}</h1>
                            <h2>{location.state.artist}</h2>*/}
                            <p>{resultdict["description"]}</p>
                            <h3>Tracklist:</h3>
                            <ul className="tracklist">
                                {resultdict.tracklist.map((track, index) => (
                                    <li key={index}> - {track}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                
            </div>
        </div>
    );
}
