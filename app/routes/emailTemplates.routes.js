const { authJwt } = require("../middleware");
const controller = require("../controllers/emailTemplate.controller");
const cors = require("cors");
const multer = require('multer');
const { check, body } = require("express-validator");

module.exports = function(app) {
  app.use(cors({origin: "*"}));

  app.get(
    "/api/allTemplate",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.allTemplate
  );

  app.post(
    "/api/addTemplate",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('subject', 'Subject is must.').not().isEmpty(),
      check('body', 'Body is must.').not().isEmpty()
    ],
    controller.addTemplate
  );
  
  app.post(
    "/api/deleteTemplate",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('id', 'Template Id is must.').not().isEmpty()
    ],
    controller.deleteTemplate
  );

  app.post(
    "/api/updateTemplate",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('id', 'Template Id is must.').not().isEmpty(),
      check('subject', 'Subject is must.').not().isEmpty(),
      check('body', 'Body is must.').not().isEmpty()
    ],
    controller.updateTemplate
  );
  
  app.post(
    "/api/templatedetail",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('id', 'Template Id is must.').not().isEmpty()
    ],
    controller.templatedetail
  );
  
};