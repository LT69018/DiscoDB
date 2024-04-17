import React from 'react';
import './styles.css'; // Import the CSS file
import { Container, Row, Col } from "react-bootstrap";

var albumCoverSrc = "./default_cover_art.jpg"; // Replace with the path to your album cover image

export default function AlbumPage(){
    return (
        <div className='body'>
            <div className="row">
                <div className="album-info">
                    <div className="column">
                        <div className="album-image">
                            <img src={albumCoverSrc} alt="Album Cover"/>
                        </div>
                    </div>
                    <div className="column">
                        <div className="album-details">
                            <h1>Album Name</h1>
                            <h2>Artist Name</h2>
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
        </div>
    );
}
