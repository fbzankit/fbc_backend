const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { check } = require("express-validator");


module.exports = function(app) {
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // app.post("/api/auth/signin", (req, res) => {
  //   console.log(req.body);
  // });

  
  // app.post(
  //   "/api/auth/testmail",
  //   [
  //     check('email', 'Email is not valid').isEmail() 
  //   ],
  //   controller.testmail
  // );


  app.post(
    "/api/auth/signup",
    [
      // check('name', 'Name is not valid').not().isEmail(),
      check('username', 'Username is requried').not().isEmpty(),
      check('email', 'Email is not valid').isEmail(),

      check('place_id', 'Place Id is requried').not().isEmpty(),
      check('placename', 'Placename is requried').not().isEmpty(),
      check('lat', 'Lat is requried').not().isEmpty(),
      check('long', 'Long is requried').not().isEmpty(),

      check('password', 'Password is requried').not().isEmpty(),
      check('confirmPassword', 'Confirm Password is requried').not().isEmpty(),
      check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
      verifySignUp.checkDuplicateUsernameOrEmail,
      // verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    "/api/auth/socialsignup", [
      check('email', 'Email is not valid').isEmail(),
      check('social_id', 'Social Id is requried').not().isEmpty(),
      check('platform', 'Platform is requried').not().isEmpty(),
    ],
    controller.socialsignup
  );

  app.post(
    "/api/auth/checkUsername", [
      check('username', 'Username is not valid').not().isEmpty(),
    ],
    controller.checkUsername
  );

  
  app.post(
    "/api/auth/checkEmail", [
      check('email', 'Email is not valid').isEmail()
    ],
    controller.checkEmail
  );

  //Admin SignIn
  app.post("/api/auth/adminSignIn", [
    // check('email', 'Email is not valid').isEmail().normalizeEmail(),
    check('email', 'Email is not valid').not().isEmpty().isEmail(),
    check('password', 'Password is requried').not().isEmpty().isLength({ min: 1 })
  ], 
  controller.adminSignIn
);

  //User SignIn
  app.post("/api/auth/userSignIn", [
      // check('email', 'Email is not valid').isEmail().normalizeEmail(),
      check('email', 'Email is not valid').not().isEmpty().isEmail(),
      check('password', 'Password is requried').not().isEmpty().isLength({ min: 1 })
    ], 
    controller.userSignIn
  );

  // Business SignIn
  app.post("/api/auth/businessSignIn", [
      // check('email', 'Email is not valid').isEmail().normalizeEmail(),
      check('email', 'Email is not valid').not().isEmpty().isEmail(),
      check('password', 'Password is requried').not().isEmpty().isLength({ min: 1 })
    ], 
    controller.businessSignIn
  );

  //Public Servant SignIn
  app.post("/api/auth/publicServantSignIn", [
      // check('email', 'Email is not valid').isEmail().normalizeEmail(),
      check('email', 'Email is not valid').not().isEmpty().isEmail(),
      check('password', 'Password is requried').not().isEmpty().isLength({ min: 1 })
    ], 
    controller.publicServantSignIn
  );
};