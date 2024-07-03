const { authJwt } = require("../middleware");
const controller = require("../controllers/notifications.controller");
const cors = require("cors");
const multer = require('multer');
const { check, body } = require("express-validator");

const upload = multer({
  dest: '../uploads/event/'
});


module.exports = function(app) {
  app.use(cors({origin: "*"}));

  app.post(
    "/api/notificatoinsAll",
    [authJwt.verifyToken],
    controller.notificatoinsAll
  );

  app.post(
    "/api/readNotification",
    [authJwt.verifyToken],
    [
      check('id', 'Notification Id field is Mandatory.').not().isEmpty()
    ],
    controller.readNotification
  );

  app.post(
    "/api/notificatoinsCheckAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.notificatoinsCheckAdmin
  );
};