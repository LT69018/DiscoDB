This will contain the backend (node.js express) code for DiscoDB.

The main section of this README is the endpoints I am writing to interface with the database. However, we also need to discuss the two different ways you may run this backend/express server. 
- **Docker**: If you are running this with docker, you should be able to see the console of that from when you did `docker compose up`
- **Local** : If you are NOT running the docker (i.e. we couldn't fix the backend image before Sun 4/29), __please scroll down to the header with "local run instructions"__ 
    - TLDR: create a .env file with the constant names used in `config.js` with mapped info from `compose.yaml` i.e. make sure to check the expected type and convert and change values as needed (i.e. if your current database table is different, change that, etc.)

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

# Instructions for Running Locally
- Todo: consider having a virtual environment for this (`nodenv`):
    - https://pypi.org/project/nodeenv/#configuration


Since docker set important database environment variables for us, you have to set it manually. I've heard that best practice isn't to push the .env file to github, but I don't think we can get around it this time.

## 1. Make sure backend/.env file has this info (create/modify)
I use the `dotenv` package in express so that I can import these values.

## (1. cont) Important note **If you used db/setup_sql.py**
<span style="color: red;"><u>You must make sure these constants match up to the values in `db/config.py`</u></span>. If you don't, you'll get an error about invalid database configuration, i.e. invalid database name.

```
DATABASE_DB="discodb-mini-top-100"
DATABASE_USER="root"
DATABASE_PASSWORD="../db/password.txt"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
NODE_ENV="development"
```
Feel free to consolidate the values with what is shown in `~/compose.yaml`.

**Note 4-25 8pm-ish**     
- Currently struggling to make docker use the database table name specified here though :(
- Todo: make sure our mySql server is using the right database table name. Maybe have another .env in the root to set the database name so we don't have to check the name in multiple places?

2. Set the `IS_RUNNING_LOCAL` constant in config.js (true)

3. Run using `npm run [chosenRunCmd]`
- without the code resetting for changes: `npm start`
- (i.e. if debugging) with resetting for changes `npm start-watch` (this is what the docker is currently set to use as well).

# Packages / Dependencies
Todo: make sure these installations are being run in the docker backend image if we fix that.

As a backup, you can run the backend locally and install the packages using `npm install` (which will get all of the libraries from `package.json`).

These are the individual dependencies:
- express
```
npm install express
```
- mysql and mysql2 (we're still between the two, so do both to be safe :) )
```
npm install mysql2 && npm install mysql
```
- (only if running locally) 
    - dotenv
    ```
    npm install dotenv
    ```

If running into problems revolving around the backend unable to load dependencies, make sure to run: 
```
docker-compose down -v
```
Followed by the normal command
```
docker compose up
```

Characteristic Error:
```
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
```

https://stackoverflow.com/questions/42040317/cannot-find-module-for-a-node-js-app-running-in-a-docker-compose-environment

