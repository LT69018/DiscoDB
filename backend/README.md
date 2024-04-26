This will contain the backend code for DiscoDB.

I will use these emojis to talk about the status of each of these.
- 🟢 : done
- 🟡 : in progress
- 🔴 : not started

Currently also marking priority of if we will implement this endpoint in brackets.

# Endpoints (Supported Functionality)
## 🟡 Create/add a user (sign up) [definitely]
```
POST /add_user
- Parameters:
    - username (string)
- Expect return (json)
    {"username": username,
    "user_id": user_id,
    "message": message}
```
- **Note**: Make sure to save the `user_id`. This is required to save albums for this user.
- Todo: maybe require a password. 
    - Not a priority right now as we want to focus on functionality for a single local user.
    - i.e. just run this with a "testUser" username from frontend and save the "user_id"

Example (as of 4/24)
- Todo: replace example once our db query actually returns a user_id
```
POST localhost:8080/add_user?username=jess
=>
200 OK
{
    "username": "jess",
    "user_id": null,
    "message": "TODO: database insert / create table!"
}
```

## 🔴 Load user (log in) [maybe]
```
GET /log_in
```

## 🔴 Search for Albums by (Album Name/ Artist /Song) [definitely]
```
GET /query_user_search 
- params: 
    - searchString (string) i.e. "Thriller"
    - searchBy (string) i.e. "album name" (other options: "artist", "song")   
- return top 50 results  
```
Usage: Frontedn `SearchResults` page.

## 🔴 Save album [definitely]
```
POST /save_album_for_user
- Parameters:
    - user_id (integer)
    - album_id (integer)
    - plan_type (string). Options: "past", "present", "future"
- Return (json)
{
    "message": "successfully saved album to user's!"
}
```
- Todo: consider if we wanna also have them just pass in the `username`, `album_name` so that it's easy to display in the log/return message without having to look it back up :P
- This endpoint name was chosen over "save_album" in case we have to add albums to our database using an endpoint with a similar name.
- `user_id`: remember this from signing up!
- `album_id`: i.e. from Frontend "SearchResults" page.
- `plan_type`: i.e. the user selection when they press [Save]

## 🔴 Check if album already saved [maybe]
```
GET /is_album_saved_for_user
- Params:
    - user_id
    - album_id
- Return: (example)
    {
        'past': False
        'present': False
        'future: True
    }
```
Helper function for frontend and/or `POST /save_album_for_user`. Won't let the user select a particular plan to save to if they already saved it there.

## 🔴 Load saved albums [definitely]
```
GET /load_user_saves
- Parameters
    - user_id (integer)
- Returns the 3 tables to display.
- reads all of the info from the one "user_listening" table, but seperates it for ease on the frontend.
{
    "past": [
        "album_id": ...
        "album_name": ...
        (maybe) "album_cover_url": ...

    ],
    "present" : [...],
    "future" : [...]
}
```

# Packages / Dependencies
- mysql
```
npm install mysql
```



If running into problems revolving around the backend unable to load dependencies, make sure to run: 

docker-compose down -v

Followed by the normal command
docker compose up

Characteristic Error:

node:internal/modules/cjs/loader:1146
project-discodb-main-backend-1   |   throw err;
project-discodb-main-backend-1   |   ^
project-discodb-main-backend-1   | 
project-discodb-main-backend-1   | Error: Cannot find module 'cors'
project-discodb-main-backend-1   | Require stack:
project-discodb-main-backend-1   | - /code/src/server.js
project-discodb-main-backend-1   |     at Module._resolveFilename (node:internal/modules/cjs/loader:1143:15)
project-discodb-main-backend-1   |     at Module._load (node:internal/modules/cjs/loader:984:27)
project-discodb-main-backend-1   |     at Module.require (node:internal/modules/cjs/loader:1231:19)
project-discodb-main-backend-1   |     at require (node:internal/modules/helpers:179:18)
project-discodb-main-backend-1   |     at Object.<anonymous> (/code/src/server.js:15:12)
project-discodb-main-backend-1   |     at Module._compile (node:internal/modules/cjs/loader:1369:14)
project-discodb-main-backend-1   |     at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)
project-discodb-main-backend-1   |     at Module.load (node:internal/modules/cjs/loader:1206:32)
project-discodb-main-backend-1   |     at Module._load (node:internal/modules/cjs/loader:1022:12)
project-discodb-main-backend-1   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:135:12) {
project-discodb-main-backend-1   |   code: 'MODULE_NOT_FOUND',
project-discodb-main-backend-1   |   requireStack: [ '/code/src/server.js' ]
project-discodb-main-backend-1   | }
project-discodb-main-backend-1   | 
project-discodb-main-backend-1   | Node.js v20.12.2
project-discodb-main-backend-1   | [nodemon] app crashed - waiting for file changes before starting...


https://stackoverflow.com/questions/42040317/cannot-find-module-for-a-node-js-app-running-in-a-docker-compose-environment

