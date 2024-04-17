[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/XJErSDDc)
^ due 4-29

# DiscoDB
This repository contains the code for our database application, "DiscoDB".

The goal is to allow users to search for and save albums to "listening lists", 
similar to how goodreads allows readers to save books they want to read.

## Appearance
<figure>
    <img src="./about_images/HomePage_3-30.png">
    <figcaption>When you open the app you are greeted with a search header that looks like this!</figcaption>
</figure>

__**New!**__

 Now you can enter something to the text box on the HomePage (We store it in `location.state.searchString`) then it takes you to the SearchResults page and shows you what you entered. I applied a similar procedure to store the result of the user's `searchBy` dropdown selection.
 
 So far, there is no API call to actually query the database based on the input.
<figure>
    <img width="300px" src="./about_images/example_search_4-17_successfully-sent-to-SearchResults-and-searchby.png">
    <img width="300px" src="./about_images/SearchResults_4-17_receives-searchString-AND-searchBy.png">
    <figcaption>Progress by 4/17: HomePage sends searchString to SearchResults page so it can request the search info from the backend and display it. </figcaption>
</figure>

## [Internal] Sharing information between pages
^ Note for developers:
- Send information by using `navigate`
```js
import { useNavigate } from 'react-router-dom';


export default function SenderComponent() {
    const navigate = useNavigate();
    const value = "Send me!"; // usually from state. See "CustomSearchBar.js"
    // example from "Home/CustomSearchBar.js"
    navigate("/RecipientPage", {state:{attributeName: value}});
}
```
- Receive information by using `location`
```js
import { useLocation } from 'react-router-dom';
// i.e. This is routed at "/RecipientPage"
export default function RecipientComponent() {
    // initialize location variable!
    location = useLocation();

    console.log("Received data: ", location.state.attributeName);
}
```

## Pulling the current dataset
Go to this [Google Drive link](https://drive.google.com/drive/u/1/folders/1pKdHyqLQyvNPYMsrdXC8M1apf1UDdFR4), download all of the files in the folder (the files are titled as follows: "discogs_20240201_artists_modified", "found_missing_releases_masters", "main_releases_modified", and "recovered_missing_releases_modified"), and download and run the file titled "setup_sql.py". The setup file does not yet exist, but these will be the appropriate steps to follow once it is uploaded.
