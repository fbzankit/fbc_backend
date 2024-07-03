const { authJwt } = require("../middleware");
const controller = require("../controllers/service.controller");
const cors = require("cors");
const { check, body } = require("express-validator");

module.exports = function(app) {
  app.use(cors({origin: "*"}));

  app.get(
    "/api/userServices",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.userServices
  );
  
  app.post(
    "/api/service/add",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('category_id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.add
  );

  app.post(
    "/api/service/all",
    [authJwt.verifyToken],
    [
      check('category_id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.all
  );

  app.post(
    "/api/service/updateService",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Service Id is mandatory').not().isEmpty(),
    ],
    controller.updateService
  );

  
  app.post(
    "/api/service/allServicesForUser",
    [authJwt.verifyToken],
    [
      check('category_id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.allServicesForUser
  );

};