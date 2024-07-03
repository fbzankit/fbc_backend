const { authJwt } = require("../middleware");
const controller = require("../controllers/chat.controller");
const cors = require("cors");
const multer = require('multer');
const { check, body } = require("express-validator");

const upload = multer({
  dest: '../uploads/event/'
});


module.exports = function(app) {
  app.use(cors({origin: "*"}));

  app.post(
    "/api/saveMsg",
    [authJwt.verifyToken],
    [
      check('receiver_id', 'Receiver Id field is Mandatory.').not().isEmpty(),
      check('message', 'Message field is Mandatory.').not().isEmpty()
    ],
    controller.saveMsg
  );

  app.post(
    "/api/allMsg",
    [authJwt.verifyToken],
    [
      check('group_id', 'group Id field is Mandatory.').not().isEmpty()
      // check('receiver_id', 'Receiver Id field is Mandatory.').not().isEmpty()
    ],
    controller.allMsg
  );

  app.post(
    "/api/conversations",
    [authJwt.verifyToken],
    controller.conversations
  );
};