import React from 'react';
import './styles.css'; // Import the CSS file
import "../App.css";
import {
	useLocation, // get data from previous page
	// useNavigate // send data to next page
} from 'react-router-dom';
import { BACKEND_ALBUM_ID_KEY, BACKEND_ALBUM_NAME_KEY, BACKEND_ARTIST_NAME_KEY, BACKEND_DESCRIPTION_KEY, BACKEND_TRACKS_KEY, BACKEND_YEAR_KEY, 
	FRONTEND_COVER_IMAGE_KEY, BACKEND_COVER_URL_KEY } from './Constants';
import get_album_info_api from './ApiGetAlbumInfo';


export default function AlbumPage() {
	const location = useLocation();
	console.log("SearchResults.location=", location);

	let album_id = -1; // means we couldn't load it from previous page.
	let albumName = "";
	let releaseYear = -1;
	let artistName = "";
	let coverUrl = null;
	let description = "";
	let tracklist = [];
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
		// these HAVE to already be there from searchResults
		albumName = location.state[BACKEND_ALBUM_NAME_KEY];
		releaseYear = location.state[BACKEND_YEAR_KEY];
		artistName = location.state[BACKEND_ARTIST_NAME_KEY];
		coverUrl = location.state[BACKEND_COVER_URL_KEY];
	}

	const result = get_album_info_api(album_id);
	description = result[BACKEND_DESCRIPTION_KEY];
	tracklist = result[BACKEND_TRACKS_KEY];
	let coverImage = <img src="default_cover_art.jpg" alt="Unable to display cover."/>;
	if (coverUrl !== null) {
		console.log(coverUrl);
		coverImage = <img src={coverUrl} alt="Invalid cover url."/>
	}
	return (
		<div className='container-fluid'>
			<h1>Album Info</h1>
			<div className="row album-info">
				<div className="col-4">
					<div className="album-image">
						{/* <img src="default_cover_art.jpg" alt="Album Cover" /> */}
						{coverImage}
					</div>
				</div>
				<div className="col">
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
			<h3 className="album-name">Name: <u>{albumName} ({releaseYear})</u></h3>
			<h3 className="artist-name">Artist: <u>{artistName}</u></h3>
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