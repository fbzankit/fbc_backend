const { authJwt,verifySignUp } = require("../middleware");
const controller = require("../controllers/publicServent.controller");
const cors = require("cors");
const multer = require('multer');
const { check, body } = require("express-validator");
var path = require('path');


const storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, path.join(__dirname, '../uploads/publicServent'));
  }, 
  // '../uploads/review/'
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});

const upload = multer({
  storage: storage,
  limits : {fileSize : 50000000}
});

module.exports = function(app) {
  app.use(cors({origin: "*"}));


  app.post(
    "/api/addPublicServentAsCustomer",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      check('location', 'Location is mandatory').not().isEmpty(),
      check('city', 'City is mandatory').not().isEmpty(),
      check('state', 'State is mandatory').not().isEmpty(),
      check('zip', 'Zip is mandatory').not().isEmpty(),
      check('phone', 'Phone Number is mandatory').not().isEmpty(),
      check('website', 'Website Address is mandatory').not().isEmpty(),
      check('category', 'Category is mandatory').not().isEmpty(),
      check('subCategory', 'Sub Category is mandatory').not().isEmpty(),
      check('comingSoon', 'Coming Soon is mandatory').not().isEmpty(),

      check('support', 'Select Support is mandatory').not().isEmpty(),
      check('reviewCategory', 'Select Category is mandatory').not().isEmpty(),
      check('reviewSubCategory', 'Select Sub Category is mandatory').not().isEmpty(),
      check('reviewSubSubCategory', 'Select Sub Sub Category is mandatory').not().isEmpty(),
      check('description', 'Description is mandatory').not().isEmpty(),
    ],
    controller.addPublicServentAsCustomer
  );

  
  app.post(
    "/api/addPublicServentAsAdmin",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      check('location', 'Location is mandatory').not().isEmpty(),
      check('city', 'City is mandatory').not().isEmpty(),
      check('state', 'State is mandatory').not().isEmpty(),
      check('zip', 'Zip is mandatory').not().isEmpty(),
      check('phone', 'Phone Number is mandatory').not().isEmpty(),
      check('website', 'Website Address is mandatory').not().isEmpty(),
      check('category', 'Category is mandatory').not().isEmpty(),
      check('subCategory', 'Sub Category is mandatory').not().isEmpty(),
      
      // check('comingSoon', 'Coming Soon is mandatory').not().isEmpty(),

      // check('email', 'Email is mandatory').not().isEmpty(),
      // check('tags', 'Tags is mandatory').not().isEmpty(),
      // check('currencies', 'Currencies is mandatory').not().isEmpty(),
      // check('bio', 'Bio is mandatory').not().isEmpty(),
      // check('facebook', 'Facebook is mandatory').not().isEmpty(),
      // check('twitter', 'Twitter is mandatory').not().isEmpty(),
      // check('linkedin', 'Linkedin is mandatory').not().isEmpty()
    ],
    controller.addPublicServentAsAdmin
  );

  

  app.post(
    "/api/addPublicServentAsOwner",
    // [authJwt.verifyToken],
    upload.none(),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      check('location', 'Location is mandatory').not().isEmpty(),
      check('city', 'City is mandatory').not().isEmpty(),
      check('state', 'State is mandatory').not().isEmpty(),
      check('zip', 'Zip is mandatory').not().isEmpty(),
      check('phone', 'Phone Number is mandatory').not().isEmpty(),
      check('website', 'Website Address is mandatory').not().isEmpty(),
      check('category', 'Category is mandatory').not().isEmpty(),
      check('subCategory', 'Sub Category is mandatory').not().isEmpty(),
      check('comingSoon', 'Coming Soon is mandatory').not().isEmpty(),

      check('fullName', 'Full Name is mandatory').not().isEmpty(),
      check('email', 'Email is mandatory').not().isEmpty(),
      check('password', 'Password is mandatory').not().isEmpty()
    ],
    verifySignUp.checkDuplicateEmail,
    controller.addPublicServentAsOwner
  );

  app.post(
    "/api/claimRequest",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.claimRequest
  );

  app.post(
    "/api/allPublicServentAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.allPublicServentAdmin
  );
  app.post(
    "/api/allPublicServent",
    [authJwt.verifyToken],
    controller.allPublicServent
  );

  app.post(
    "/api/publicServentDetail",
    [authJwt.verifyToken],
    controller.publicServentDetail
  );

  app.post(
    "/api/publicServentDetailAdmin",
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.publicServentDetailAdmin
  );

  app.post(
    "/api/updateAccreditAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('businessId', 'Business Id is must.').not().isEmpty(),
      check('status', 'Status is must.').not().isEmpty(),
    ],
    controller.updateAccreditAdmin
  );

  
  app.post(
    "/api/updateScoreAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('businessId', 'Business Id is must.').not().isEmpty(),
      check('score', 'Score is must.').not().isEmpty(),
    ],
    controller.updateScoreAdmin
  );

  
  app.post(
    "/api/approveStatusUpdateAdmin",
    // [authJwt.verifyToken, authJwt.isAdmin],
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
      check('status', 'Status is must.').not().isEmpty(),
    ],
    controller.approveStatusUpdateAdmin
  );

  
  app.post(
    "/api/claimRequestsAdmin",
    // [authJwt.verifyToken, authJwt.isAdmin],
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.claimRequestsAdmin
  );


  app.post(
    "/api/updatePublicServentStatus",
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
      check('status', 'Status is must.').not().isEmpty(),
    ],
    controller.updatePublicServentStatus
  );

};