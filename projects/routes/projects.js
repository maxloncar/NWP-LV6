let express = require("express");
let router = express.Router();

/*
 * GET projectlist.
 */
router.get("/projectlist", function (req, res) {
  let db = req.db;
  let collection = db.get("projectlist");
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/*
 * POST to addproject.
 */
router.post("/addproject", function (req, res) {
  let db = req.db;
  let collection = db.get("projectlist");
  collection.insert(req.body, function (err, result) {
    res.send(err === null ? { msg: "" } : { msg: err });
  });
});

/*
 * DELETE to deleteproject.
 */
router.delete("/deleteproject/:id", function (req, res) {
  let db = req.db;
  let collection = db.get("projectlist");
  let projectToDelete = req.params.id;
  collection.remove({ _id: projectToDelete }, function (err) {
    res.send(err === null ? { msg: "" } : { msg: "error: " + err });
  });
});

module.exports = router;
