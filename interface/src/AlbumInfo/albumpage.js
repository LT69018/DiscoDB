import React from 'react';
import './styles.css'; // Import the CSS file
import { Container, Row, Col } from "react-bootstrap";
import album_c from "./default_cover_art.jpg"
import { useLocation, // get data from previous page
         // useNavigate // send data to next page
       } from 'react-router-dom';

export default function AlbumPage(){
    const location = useLocation();
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
                            <h1>Album Name</h1>
                            <h2>Artist Name</h2> 
                            {/*<h1>{location.state.album}</h1>
                            <h2>{location.state.artist}</h2>*/}
                            <p>Description of the album goes here...</p>
                            <h3>Tracklist:</h3>
                            <ul className="tracklist">
                                <li> - Song 1</li>
                                <li> - Song 2</li>
                                <li> - Song 3</li>
                            </ul>
                        </div>
                    </div>
                
            </div>
        </div>
    );
}
