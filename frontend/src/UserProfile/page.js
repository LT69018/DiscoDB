import {React 
  /*, useState, useLocation */} from "react";
// import {Container} from "react-bootstrap";
import ListeningTable from "./Components/ListeningTable.js" 

import getListeningTables from "./data/ApiGetUserListening.js"; // todo: make sure this eventually uses real API results.
import { 
  BACKEND_PAST_LISTENING_KEY, BACKEND_PRESENT_LISTENING_KEY, BACKEND_FUTURE_LISTENING_KEY,
  FRONTEND_LOADED_TABLES_STATUS_KEY } from "./data/Constants.js";

const TEST_USER_ID = 123456;
const TEST_USERNAME = "testingUserWithoutAPI";

export default function UserProfile() {
  /* Gather Primary Keys that are necessary for backend! */
  const userID = TEST_USER_ID;
  const username = TEST_USERNAME;

  let apiResult = getListeningTables(userID, username);
  const status = apiResult[FRONTEND_LOADED_TABLES_STATUS_KEY];
  let statusHtml = null;
  let pastTable = <div></div>
  let presentTable = <div></div>
  let futureTable = <div></div>
  if (status === false) {
    statusHtml = <div>[FAIL] Unable to get listening tables from API for user: '{username}'</div>
  } else {
    statusHtml = <div>[SUCCESS] Gathered listening tables from API for user: '{username}'</div>
    console.log("[UserProfile] Got data to display: ", apiResult);
    pastTable = <ListeningTable rows={apiResult[BACKEND_PAST_LISTENING_KEY]}/>
    presentTable = <ListeningTable rows={apiResult[BACKEND_PRESENT_LISTENING_KEY]}/>
    futureTable = <ListeningTable rows={apiResult[BACKEND_FUTURE_LISTENING_KEY]}/>
  }

  return (
    <div className="container-fluid">
      <h1> User Profile </h1>
      {statusHtml}
      <hr></hr>
      <div className="row">
        <div className="col-4">
          <h2 className="columnTitle">Past</h2>
        </div>
        <div className="col-4">
          <h2 className="columnTitle">Present</h2>
        </div>
        <div className="col-4">
          <h2 className="columnTitle">Future</h2>
        </div>
      </div>
      <div className="row gx-5 allTablesRow">
        
        <div className="col-4 albumsColumn">
          <div className="col-spaced" >
            {pastTable}
          </div>
        </div>
        <div className="col-4 albumsColumn">
          <div className="col-spaced " id="presentColumn">
            {presentTable}
          </div>
        </div>
        <div className="col-4 albumsColumn">
          <div className="col-spaced " id="futureColumn">
            {futureTable}
          </div>
        </div>
      </div>
    </div>
  );
}