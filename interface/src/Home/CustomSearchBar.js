import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
// will use this once I'm able to install it.
// import SearchBar from "material-ui-search-bar";
/* 
TODO: replace this with our search bar for DiscoDB
- [X] Change placeholder and button names
- [X] IMPORTANT: dropdown for what they want to search by
-- i.e. Artist, Album
-- [ ] Add state to save the value they select for the dropdown (what they want to search by)
- [X] Create another page to take the user to when they do search something!
- [X] Navigate to a
- [ ] Change backend/result of pressing search button


*/
// example of how  I want the backend to show me their data.

// i.e. it gives me three table results
// artist_results
// album_results
// collaborator_results

// i.e. GET /search?'stevie wonder'
// todo: how will backend return relevant related artists?


function CustomSearchBar() {
  const navigate = useNavigate(); // was going to use `useHistory` but that isn't in react-v6.
  const [userInput, setUserInput] = useState('');
  const [dropdownInput, setDropdownInput] = useState('');

  const handleInputTyping = (event) => {
    const value = event.target.value;
    setUserInput(value);
    console.log("I see you typing! Current saved value: ", userInput);
  };

  // When they press [Search]
  const handleSubmit = () => {
    if (userInput === "") {
      console.log("Please enter something in the text field before pressing `Search`!!");
      
    } else {
      // currently use the test_api_results to display something!
      console.log("From search bar, about to switch to results page");
      console.log("They entered: ", userInput);

      // todo: replace with page switching! (i.e. react-router-dom)
      // calling my data variable "state" because of convention.
      navigate("/SearchResults", {state:{searchString: userInput}});
    }
  }

  return (
    <div>
      <Form>
        {/* User search input for our database. */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col">
            <input
              className="form-control form-control-lg"
              id="userSearchInput"
              type="text"
              placeholder="Enter an album or artist name."
              onChange={handleInputTyping}
              required
            />
            
          </div>
          <div className="col-auto">
            {/* Use Form.Select so that it is formatted nicely (I don't have to manually style it, react-bootstrap does it for me.) */}
            <Form.Select id="search_by">
              <option value="artist">Artist</option>
              <option value="album">Album Name</option>
              <option value="song">Song Name</option> 
            </Form.Select>
          </div>
          
          <div className="col-auto">
            <Link to="/SearchResults" state={{
              searchString: userInput, searchBy: dropdownInput
            }}>
              <Button>Submit</Button>
            
            </Link>
          </div>
          <div className="col-1"></div>
        </div>
      </Form>
    </div>
  );
}

export default CustomSearchBar;
