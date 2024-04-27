

app.get("/load_user_saves", function(req, res){
  /*
  - Parameters
    - user_id (integer)
  - Returns the 3 tables to display.
  - reads all of the info from the one "user_listening" table, but seperates it for ease on the frontend.
  {
      "future": [
          "album_id": ...
          "album_name": ...
          (maybe) "album_cover_url": ...

      ], "present" : [...], "past" : [...]
  }
  */
});