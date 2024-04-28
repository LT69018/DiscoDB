app.post("/save_album_for_user", function(req, res, next) {
  /*
  :param user_id: Which user wants to save this album. 
    From the `users` table. 
    i.e. from the result of `POST /add_user`
  :param username: the username of the person! (needed because it's part of the PK for `users` table)
  :param plan_type: ("past", "present", "future");
  :param album_id: from `albums` table. The album they want to save
  - we'll translate this into an integer

  :return: {"message": ``}
  */
});