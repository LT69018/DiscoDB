import React, { useState } from "react";
// will use this once I'm able to install it.
// import SearchBar from "material-ui-search-bar";
/* 
TODO: replace this with our search bar for DiscoDB
- [X] Change placeholder and button names
- [ ] IMPORTANT: dropdown for what they want to search by
-- i.e. Artist, Album
- [ ] Create another page to take the user to when they do search something!
- [ ] Navigate to a
- [ ] Change backend/result of pressing search button
- Consider using MUI search bar and asking team about what function 
in the backend I should call once the user enters something.

Note - we will ALWAYS display album results. don't bother displaying artists with clickable links.
*/
// example of how  I want the backend to show me their data.

// i.e. it gives me three table results
// artist_results
// album_results
// collaborator_results

// i.e. GET /search?'stevie wonder'
// todo: how will backend return relevant related artists?
const test_api_result = [
  {'artist': 'Stevie Wonder', 'album': 'Innervision', 'year': 1970},
  {'artist': '', 'album': '', 'year': 2000}
];

function CustomSearchBar() {
  const [userInput, setUserInput] = useState('');

  let searchResults = '';

  const handleInputTyping = (event) => {
    const value = event.target.value;
    setUserInput(value);
    console.log("I see you typing! Current saved value: ", userInput);
  };

  const navigateToResultsPage = () => {
    if (userInput === "") {
      console.log("Please enter something in the text field before pressing `Search`!!");
      
    } else {
      // currently use the test_api_results to display something!
      console.log("From search bar, about to switch to results page");
      console.log("They entered: ", userInput);

      // todo: replace with page switching! (i.e. react-router-dom)
      console.log("TODO: implement a page to navigate them to!")
    }
  }

  return (
    <div>
      {/*  Signup form */}
      {/*  * * * * * * * * * * * * * * * */}
      {/* * * SB Forms Contact Form * * */}
      {/* * * * * * * * * * * * * * * * */}
      {/* This form is pre-integrated with SB Forms. */}
      {/* To make this form functional, sign up at */}
      {/* https://startbootstrap.com/solution/contact-forms */}
      {/* to get an API token! */}
      <form
        id="searchForm"
        // data-sb-form-api-token="API_TOKEN"
      >
        {/* Email address input */}
        <div className="row">
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
            <button
              className="btn btn-primary btn-lg"
              id="submitButton"
              type="submit"
              onClick={navigateToResultsPage}
            >
              Search
            </button>
          </div>
        </div>
        {/* todo: figure out if I'll need to use these. */}
        {/* Submit success message */}
        {/* */}
        {/* This is what your users will see when the form */}
        {/* has successfully submitted */}
        <div className="d-none" id="submitSuccessMessage">
          <div className="text-center mb-3">
            <div className="fw-bolder">
              Form submission successful!
            </div>
            <p>To activate this form, sign up at</p>
            <a
              className="text-white"
              href="https://startbootstrap.com/solution/contact-forms"
            >
              https://startbootstrap.com/solution/contact-forms
            </a>
          </div>
        </div>
        {/* Submit error message */}
        {/* */}
        {/* This is what your users will see when there is */}
        {/* an error submitting the form */}
        <div className="d-none" id="submitErrorMessage">
          <div className="text-center text-danger mb-3">
            Error sending message!
          </div>
        </div>
      </form>
    </div>
  );
}

export default CustomSearchBar;
