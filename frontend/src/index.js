import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css'; 
/* <- according to https://create-react-app.dev/docs/adding-bootstrap/
      we can use `sass` to globally use bootstrap styles. */
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AppBar, Toolbar } from "@mui/material";
import { Button, Navbar, Dropdown } from "react-bootstrap";


function toggleDropdown() {
  var dropdownContent = document.getElementById("dropdown-content");
  if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
  } else {
      dropdownContent.style.display = "block";
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Show the app bar across all the pages! */}
    {/* Use "sticky" instead of fixed so the items aren't covered up */}
    <AppBar position="sticky" sx={{bgcolor:"white", maxHeight: "15vh"}}>
      <Toolbar style={{justifyContent:"space-between"}}>
        <Navbar.Brand href="/">
          <img
            src="/DiscoDB_logo-clearbg.png"
            // height="100px"
            style={{height:"15vh", width:"auto", marginTop: "auto", marginBottom: "auto"}}
            className="d-inline-block align-top"
            alt="DiscoDB logo"
          />

        </Navbar.Brand>

        <Dropdown className="float-center" sx={{bgcolor:"white", maxHeight: "10vh"}}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Menu
          </Dropdown.Toggle>
          <Dropdown.Menu>
                <Dropdown.Item href="http://localhost:3000/">Home</Dropdown.Item>
                {/*<Dropdown.Item href="#">Log in</Dropdown.Item>*/}
                <Dropdown.Item href="/UserProfile">Profile</Dropdown.Item>
                {/*<Dropdown.Item href="#">Settings</Dropdown.Item>*}
                {/*<Dropdown.Item href="#">Log Out</Dropdown.Item>*/}
          </Dropdown.Menu>
        </Dropdown>
      </Toolbar>
    </AppBar>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
