const { authJwt } = require("../middleware");
const controller = require("../controllers/department.controller");
const cors = require("cors");
const { check, body } = require("express-validator");

module.exports = function(app) {
  app.use(cors({origin: "*"}));

  app.get(
    "/api/departmentAll",

    [authJwt.verifyToken],
    controller.departmentAll
  );
  
  app.post(
    "/api/addDepartment",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      // check('parentCatId', 'Parent Category Id is mandatory').not().isEmpty(),
    ],
    controller.addDepartment
  );

  app.post(
    "/api/updateDepartment",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Id is mandatory').not().isEmpty(),
    ],
    controller.updateDepartment
  );

  app.get(
    "/api/departmentDetail",
    [authJwt.verifyToken],
    [
      check('id', 'Id is mandatory').not().isEmpty(),
    ],
    controller.departmentDetail
  );

};