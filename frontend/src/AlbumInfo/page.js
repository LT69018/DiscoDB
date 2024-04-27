import React from 'react';
import './styles.css'; // Import the CSS file

import {
	useLocation, // get data from previous page
	// useNavigate // send data to next page
} from 'react-router-dom';
import { BACKEND_ALBUM_ID_KEY, BACKEND_ALBUM_NAME_KEY, BACKEND_ARTIST_NAME_KEY, BACKEND_DESCRIPTION_KEY, BACKEND_TRACKS_KEY, BACKEND_YEAR_KEY } from './Constants';
import get_album_info_api from './ApiGetAlbumInfo';


export default function AlbumPage() {
	const location = useLocation();
	console.log("SearchResults.location=", location);

	let album_id = -1; // means we couldn't load it from previous page.

	if (location.state === null) {
		console.log("Can't display any info in `AlbumPage` for null location");
	} else {
		const stateKeys = Object.keys(location.state);
		/* get `album_id` so that we can query the */
		if (!(BACKEND_ALBUM_ID_KEY in stateKeys)) {
			console.log("Can't query database for album info without album_id!!");
		} else {
			album_id = location.state[BACKEND_ALBUM_ID_KEY];
		}
	}

	const result = get_album_info_api(album_id);
	let albumName = result[BACKEND_ALBUM_NAME_KEY];
	let releaseYear = result[BACKEND_YEAR_KEY];
	let artistName = result[BACKEND_ARTIST_NAME_KEY];
	let description = result[BACKEND_DESCRIPTION_KEY];
	let tracklist = result[BACKEND_TRACKS_KEY];
	return (
		<div className='body'>
			<div className="row album-info">
				<div className="column">
					<div className="album-image">
						<img src="default_cover_art.jpg" alt="Album Cover" />
					</div>
				</div>
				<div className="column">
					{albumDetails(albumName, artistName, releaseYear, description, tracklist)}
				</div>
			</div>
		</div>
	);
}

function albumDetails(albumName, artistName, releaseYear, description, tracklist) {
	const trackListHTML = typeof tracklist === "string" ? tracklist : tracklist.map((song) => (
		<li> - Song: {song}</li>
	));
	return (
		<div className="album-details">
			<h2 className="album-name">Album Name: <u>{albumName} ({releaseYear})</u></h2>
			<h2 className="artist-name">Artist: <u>{artistName}</u></h2>
			{/*<h1>{location.state.album}</h1>
            <h2>{location.state.artist}</h2>*/}
			<p className="album-notes">Description: {description}</p>
			<h3>Tracklist:</h3>
			<ul className="tracklist">
				{trackListHTML}
			</ul>
		</div>
	);
}