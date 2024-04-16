
function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
}

var albumCoverSrc = "default_cover_art.jpg"; // Replace with the path to your album cover image


export default function AlbumPage(){
    return (
        <div>
            <div class="container">
                <div class="row">
                    <div class="album-info">
                        <div class="col">
                            <div class="album-image">
                                <img src={albumCoverSrc} alt="Album Cover"/>
                            </div>
                        </div>
                        <div class="col">
                            <div class="album-details">
                                <h1>Album Name</h1>
                                <h2>Artist Name</h2>
                                <p>Description of the album goes here...</p>
                                <h3>Tracklist:</h3>
                                <ul class="tracklist">
                                    <li> - Song 1</li>
                                    <li> - Song 2</li>
                                    <li> - Song 3</li>
                                
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
           
        </div>
    );
}