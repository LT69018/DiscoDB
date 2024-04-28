var express = require('express');
var router = express.Router();

router.post("/save_album_for_user", function(req, res, next) {
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
  QUERY = `UPDATE listening SET listening_time = ? WHERE user_id = ? AND album_id = ?`;
  const listeningTime = 1; // idk, @coby feel free to update this :p
  req.query["user_id"];
  if (! ("user_id" in req.query)) {
    res.status(404).send("Missing user_id!");
  }
  if (! ("username" in req.query)) {
    res.status(404).send("Missing username!");
  }
  if (! ("plan_type" in req.query)) {
    res.status(404).send("Missing plan_type!");
  }
  if (! ("album_id" in req.query)) {
    res.status(404).send("Missing album_id!");
  }
  res.status(200).send("Todo: Implement Query to save to user listening tables");
});

module.exports = router;