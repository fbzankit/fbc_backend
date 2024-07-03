const { authJwt,verifySignUp } = require("../middleware");
const controller = require("../controllers/business.controller");
const cors = require("cors");
const multer = require('multer');
const { check, body } = require("express-validator");
var path = require('path');


const storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, path.join(__dirname, '../uploads/review'));
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
    "/api/addBusinessAsCustomer",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      // check('location', 'Location is mandatory').not().isEmpty(),
      // check('city', 'City is mandatory').not().isEmpty(),
      // check('state', 'State is mandatory').not().isEmpty(),
      // check('zip', 'Zip is mandatory').not().isEmpty(),
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
    controller.addBusinessAsCustomer
  );

  
  app.post(
    "/api/addBusinessAsAdmin",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      // check('location', 'Location is mandatory').not().isEmpty(),
      // check('city', 'City is mandatory').not().isEmpty(),
      // check('state', 'State is mandatory').not().isEmpty(),
      // check('zip', 'Zip is mandatory').not().isEmpty(),
      check('place_id', 'Place Id is mandatory').not().isEmpty(),
      check('placename', 'Placename is mandatory').not().isEmpty(),
      check('lat', 'Lat is mandatory').not().isEmpty(),
      check('long', 'Long is mandatory').not().isEmpty(),
      check('phone', 'Phone Number is mandatory').not().isEmpty(),
      check('website', 'Website Address is mandatory').not().isEmpty(),
      check('category', 'Category is mandatory').not().isEmpty(),
      check('subCategory', 'Sub Category is mandatory').not().isEmpty(),
      
      // check('comingSoon', 'Coming Soon is mandatory').not().isEmpty(),

      // check('businessEmail', 'Email is mandatory').not().isEmpty(),
      // check('tags', 'Tags is mandatory').not().isEmpty(),
      // check('currencies', 'Currencies is mandatory').not().isEmpty(),
      // check('bio', 'Bio is mandatory').not().isEmpty(),
      // check('facebook', 'Facebook is mandatory').not().isEmpty(),
      // check('twitter', 'Twitter is mandatory').not().isEmpty(),
      // check('linkedin', 'Linkedin is mandatory').not().isEmpty()
    ],
    controller.addBusinessAsAdmin
  );

  app.post(
    "/api/updateBusinessAsAdmin",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      // check('location', 'Location is mandatory').not().isEmpty(),
      // check('city', 'City is mandatory').not().isEmpty(),
      // check('state', 'State is mandatory').not().isEmpty(),
      // check('zip', 'Zip is mandatory').not().isEmpty(),
      check('place_id', 'Place Id is mandatory').not().isEmpty(),
      check('placename', 'Placename is mandatory').not().isEmpty(),
      check('lat', 'Lat is mandatory').not().isEmpty(),
      check('long', 'Long is mandatory').not().isEmpty(),
      check('phone', 'Phone Number is mandatory').not().isEmpty(),
      check('website', 'Website Address is mandatory').not().isEmpty(),
      check('category', 'Category is mandatory').not().isEmpty(),
      check('subCategory', 'Sub Category is mandatory').not().isEmpty(),
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.updateBusinessAsAdmin
  );

  

  app.post(
    "/api/addBusinessAsOwner",
    // [authJwt.verifyToken],
    upload.none(),
    [
      check('bussinessName', 'Business name is mandatory').not().isEmpty(),
      // check('location', 'Location is mandatory').not().isEmpty(),
      // check('city', 'City is mandatory').not().isEmpty(),
      // check('state', 'State is mandatory').not().isEmpty(),
      // check('zip', 'Zip is mandatory').not().isEmpty(),
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
    controller.addBusinessAsOwner
  );

  app.post(
    "/api/claimRequest",
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
      check('fullName', 'Full Name is mandatory').not().isEmpty(),
      check('email', 'Email is mandatory').not().isEmpty(),
      check('password', 'Password is requried').not().isEmpty(),
      check('confirmPassword', 'Confirm Password is requried').not().isEmpty(),
      check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    ],
    controller.claimRequest
  );

  app.post(
    "/api/claimRequestProofs",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.claimRequestProofs
  );


  app.get(
    "/api/userServices",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.userServices
  );
  
  app.post(
    "/api/allBusinessAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.allBusinessAdmin
  );
  app.post(
    "/api/allBusiness",
    [authJwt.verifyToken],
    controller.allBusiness
  );

  app.post(
    "/api/businessDetail",
    [authJwt.verifyToken],
    controller.businessDetail
  );

  app.post(
    "/api/businessDetailAdmin",
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.businessDetailAdmin
  );

  app.post(
    "/api/applyForAccreditation",
    [authJwt.verifyToken],
    [
      check('answers', 'Answers is mandatory').not().isEmpty(),
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.applyForAccreditation
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
    "/api/claimApprovedAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      check('businessId', 'Business Id is must.').not().isEmpty(),
      check('userId', 'User Id is must.').not().isEmpty(),
    ],
    controller.claimApprovedAdmin
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
    "/api/updateBusinessStatus",
    [authJwt.verifyToken],
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
      check('status', 'Status is must.').not().isEmpty(),
    ],
    controller.updateBusinessStatus
  );

  app.post(
    "/api/uploadBusinessImages",
    [authJwt.verifyToken],
    upload.array('images', 10),
    [
      check('businessId', 'Business Id is mandatory').not().isEmpty(),
    ],
    controller.uploadBusinessImages
  );

};