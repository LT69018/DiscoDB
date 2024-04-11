import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css'; 
/* <- according to https://create-react-app.dev/docs/adding-bootstrap/
      we can use `sass` to globally use bootstrap styles. */
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AppBar, Toolbar } from "@mui/material";
import { Button, Navbar} from "react-bootstrap";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Show the app bar across all the pages! */}
    {/* Use "sticky" instead of fixed so the items aren't covered up */}
    <AppBar position="sticky" sx={{bgcolor:"white"}}>
      <Toolbar style={{justifyContent:"spaceBetween"}}>
        <Navbar.Brand href="/">
          <img
            src="/DiscoDB_logo-clearbg.png"
            height="100px"
            className="d-inline-block align-top"
            alt="DiscoDB logo"
          />
        </Navbar.Brand>
        <Button style={{marginLeft:"auto"}} href="#signup">
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
