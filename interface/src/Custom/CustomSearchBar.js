import React, { Component } from "react";
// will use this once I'm able to install it.
// import SearchBar from "material-ui-search-bar";

/* 
TODO: replace this with our search bar for DiscoDB
- [X] Change placeholder and button names
- [ ] Change backend/result of pressing search button
- Consider using MUI search bar and asking team about what function 
in the backend I should call once the user enters something.
*/
function CustomSearchBar() {
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
        className="form-subscribe"
        id="contactForm"
        data-sb-form-api-token="API_TOKEN"
      >
        {/* Email address input */}
        <div className="row">
          <div className="col">
            <input
              className="form-control form-control-lg"
              id="emailAddress"
              type="email"
              placeholder="Enter an album or artist name."
              data-sb-validations="required,email"
            />
            
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary btn-lg"
              id="submitButton"
              type="submit"
            >
              Search
            </button>
          </div>
        </div>
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
