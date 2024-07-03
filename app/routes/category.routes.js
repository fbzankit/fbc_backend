const { authJwt } = require("../middleware");
const controller = require("../controllers/category.controller");
const cors = require("cors");
const { check, body } = require("express-validator");

module.exports = function(app) {
  app.use(cors({origin: "*"}));

  
  app.post(
    "/api/category/addBusinessCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      // check('parentCatId', 'Parent Category Id is mandatory').not().isEmpty(),
    ],
    controller.addBusinessCategory
  );

  app.post(
    "/api/category/updateCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.updateCategory
  );

  // Review Business Category
  app.post(
    "/api/category/reviewBusinessCategory",
    [authJwt.verifyToken],
    controller.reviewBusinessCategory
  );
  
  app.post(
    "/api/category/addReviewBusinessCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      // check('parentCatId', 'Parent Category Id is mandatory').not().isEmpty(),
    ],
    controller.addReviewBusinessCategory
  );

  app.post(
    "/api/category/updateReviewBusinessCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.updateReviewBusinessCategory
  );

  
  // Public Servent Category
  app.post(
    "/api/category/publicServentCategory",
    [authJwt.verifyToken],
    controller.publicServentCategory
  );
  
  app.post(
    "/api/category/addPublicServentCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      // check('parentCatId', 'Parent Category Id is mandatory').not().isEmpty(),
    ],
    controller.addPublicServentCategory
  );

  app.post(
    "/api/category/updatePublicServentCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.updatePublicServentCategory
  );

  
  // Review Public Servent Category
  app.post(
    "/api/category/reviewPublicServentCategory",
    [authJwt.verifyToken],
    controller.reviewPublicServentCategory
  );
  
  app.post(
    "/api/category/addReviewPublicServentCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      // check('parentCatId', 'Parent Category Id is mandatory').not().isEmpty(),
    ],
    controller.addReviewPublicServentCategory
  );

  app.post(
    "/api/category/updateReviewPublicServentCategory",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('name', 'Name is mandatory').not().isEmpty(),
      check('id', 'Category Id is mandatory').not().isEmpty(),
    ],
    controller.updateReviewPublicServentCategory
  );


  app.post(
    "/api/category/businessCategory",
    [authJwt.verifyToken],
    controller.businessCategory
  );

};