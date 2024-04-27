/*
File: user_listening_api.js
Author: Jess Turner
Date: 4/27/24
Description: 
- Get the data to display about albums the user has saved
- currently just uses dummy data :p
*/

import {BACKEND_PAST_LISTENING_KEY, 
        BACKEND_PRESENT_LISTENING_KEY, 
        BACKEND_FUTURE_LISTENING_KEY, 
        FRONTEND_LOADED_TABLES_STATUS_KEY} from "./Constants.js";

import populateDummyListeningTables from "./populateDummyListeningTables.js";

function getListeningTables(user_id, username) {
  
  var user_listening_past = [];
  var user_listening_present = [];
  var user_listening_future = [];
  
  // THIS WOULD BE REPLACED BY AN API CALL!
  try {
    populateDummyListeningTables(user_listening_past, user_listening_present, user_listening_future);
    return {
      [FRONTEND_LOADED_TABLES_STATUS_KEY]: true,
      [BACKEND_PAST_LISTENING_KEY]: user_listening_past,
      [BACKEND_PRESENT_LISTENING_KEY]: user_listening_present,
      [BACKEND_FUTURE_LISTENING_KEY]: user_listening_future
    };
  } catch(err) {
    console.log("Unable to populate dummy listening tables. Error\n\t", err);
    return {
      [FRONTEND_LOADED_TABLES_STATUS_KEY]: false,
      [BACKEND_PAST_LISTENING_KEY]: user_listening_past,
      [BACKEND_PRESENT_LISTENING_KEY]: user_listening_present,
      [BACKEND_FUTURE_LISTENING_KEY]: user_listening_future
    };
  }
}

export default getListeningTables;