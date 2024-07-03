const db = require("../models");
const config = require("../config/auth.config");
var nodemailer = require('nodemailer');
const User = db.user;
const Role = db.role;
const Emailverify = db.emailVerify;
const UserRoles = db.userRoles;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { body, validationResult, check } = require("express-validator");
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
     auth: {
          // user: 'ankit.enacteservices@gmail.com',
          // pass: 'wtecgywjhqmvxueq',
          user: 'liberate.dev@gmail.com',
          pass: "ibrxffgycwienvip"
       },
  secure: true,
  });

  exports.checkEmail = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, message: "Something went wrong.", success:false, data: errors.array() });
    }
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(201).send({
          status: 201,
          success: false,
          message: "Failed! Email is already in use!"
        });
      }else{
        res.status(200).send({
          status: 200,
          success: true,
          message: "No data found!"
        });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }
  
  
  exports.checkUsername = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, message: "Something went wrong.", success:false, data: errors.array() });
    }
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(user => {
      if (user) {
        res.status(201).send({
          status: 201,
          success: false,
          message: "Failed! Username is already in use!"
        });
      }else{
        res.status(200).send({
          status: 200,
          success: true,
          message: "No data found!"
        });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }
  
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 400, message: "Something went wrong.", success:false, data: errors.array() });
  }
  // Save User to Database
  User.create({
    email: req.body.email,
    username: req.body.username,
    place_id: req.body.place_id,
    placename: req.body.placename,
    lat: req.body.lat,
    long: req.body.long,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(user => {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });

      // var verifyUrl = req.headers.host+'/api/emailverify/'+user.email;
      var verifyUrl = '';
      Emailverify.create({
        email: req.body.email,
        token: bcrypt.hashSync(req.body.email, 8)
      }).then(emailToVerify => {
        verifyUrl = req.headers.host+"/emailVerification?email=" + emailToVerify.email + "&token=" + emailToVerify.token;
        const mailData = {
          from: 'fbc.dev@gmail.com',  // sender address
            to: user.email,   // list of receivers
            subject: 'Thanks for registration',
            html: "Hello<br>Thank your for signing up with fbc. Please click on the link below to confirm your email.<br><a href='"+verifyUrl+"'>Confirm Email</a><br>Regards<br>FBC"
          };
          transporter.sendMail(mailData, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
      });
      // return  console.log(req.headers.host);
      
      var role = [];
      role.push('user');
      if (role) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: role
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({
              status: 200,
              success: true,
              message: "User was registered successfully!",
              data: {accessToken: token} 
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            status: 200,
            success: true,
            message: "User was registered successfully!",
            data: {accessToken: token}});
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};


exports.adminSignIn = (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success:false, data: errors.array() });
  }
    User.findOne({
      include: [
        {
          model: Role,
        }
      ],
      where: {
        email: req.body.email,
      }
    })
    .then(user => {

      if (!user || user.roles[0].id != 3) {
        return res.status(201).send({
          status: 201,
          success: false,
          message: "User Not found." });
      }

      if (user.email_verified != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "User email is not verified."
        });
      }

      
      if (user.status != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Your account is not active to login. Please conatct our support team."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });

      var authorities = "";
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          // authorities.push(roles[i].name);
          authorities = roles[i].name
        }
        res.status(200).send({
          status: 200,
          success: true,
          data: {
            id: user.id,
            email: user.email,
            roles: authorities,
            accessToken: token,
            email_verified: user.email_verified,
            status: user.status,
            image: (user.image) ? "/user/" + user.image : '',
          }
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};


exports.userSignIn = (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success:false, data: errors.array() });
  }
    User.findOne({
      include: [
        {
          model: Role,
        }
      ],
      where: {
        email: req.body.email,
      }
    })
    .then(user => {

      if (!user || user.roles[0].id != 1) {
        return res.status(201).send({
          status: 201,
          success: false,
          message: "User Not found." });
      }

      if (user.email_verified != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "User email is not verified."
        });
      }

      
      if (user.status != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Your account is not active to login. Please conatct our support team."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });

      var authorities = "";
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          // authorities.push(roles[i].name);
          authorities = roles[i].name
        }
        res.status(200).send({
          status: 200,
          success: true,
          data: {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: authorities,
            accessToken: token,
            signup_step: user.signup_step,
            email_verified: user.email_verified,
            status: user.status,
            place_id: user.place_id,
            placename: user.placename,
            lat: user.lat,
            long: user.long,
            image: (user.image) ? "/user/" + user.image : '',
          }
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};


exports.businessSignIn = (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success:false, data: errors.array() });
  }
    User.findOne({
      include: [
        {
          model: Role,
        }
      ],
      where: {
        email: req.body.email,
      }
    })
    .then(user => {
console.log(user.roles[0].id)
      if (!user || user.roles[0].id != 2) {
        return res.status(201).send({
          status: 201,
          success: false,
          message: "User Not found." });
      }

      if (user.email_verified != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "User email is not verified."
        });
      }

      
      if (user.status != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Your account is not active to login. Please conatct our support team."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });

      var authorities = "";
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          // authorities.push(roles[i].name);
          authorities = roles[i].name
        }
        res.status(200).send({
          status: 200,
          success: true,
          data: {
            id: user.id,
            email: user.email,
            roles: authorities,
            accessToken: token,
            signup_step: user.signup_step,
            email_verified: user.email_verified,
            status: user.status,

          }
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};


exports.publicServantSignIn = (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success:false, data: errors.array() });
  }
    User.findOne({
      include: [
        {
          model: Role,
        }
      ],
      where: {
        email: req.body.email,
      }
    })
    .then(user => {

      if (!user || user.roles[0].id != 4) {
        return res.status(201).send({
          status: 201,
          success: false,
          message: "User Not found." });
      }

      if (user.email_verified != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "User email is not verified."
        });
      }

      
      if (user.status != '1') {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Your account is not active to login. Please conatct our support team."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(201).send({
          status: 201,
          success: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });

      var authorities = "";
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          // authorities.push(roles[i].name);
          authorities = roles[i].name
        }
        res.status(200).send({
          status: 200,
          success: true,
          data: {
            email: user.email,
            roles: authorities,
            accessToken: token,
            signup_step: user.signup_step,
            email_verified: user.email_verified,
            status: user.status,
          }
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};

exports.socialsignup = (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ 
      status: 400, 
      message: "Something went wrong.", 
      success:false, 
      data: errors.array() });
  }
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        User.create({
          email: req.body.email,
          platform: req.body.platform,
          social_id: req.body.social_id,
          social_image: req.body.social_image,
          social_token: req.body.social_token,
          email_verified: '1'
        })
        .then(user => {
          var role = [];
          role.push('user');
          Role.findAll({
            where: {
              name: {
                [Op.or]: role
              }
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 2629800 // 24 hours
              });
        
              var authorities = [];
              user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                  authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                  status: 200,
                  success: true,
                  message: 'Data fetched',
                  data: {
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    signup_step: user.signup_step,
                    email_verified: user.email_verified,
                    social_token: user.social_token,
                    is_parctitioner: user.is_parctitioner,
                    social_id: user.social_id,
                    social_image: user.social_image
                  }
                });
              });
            });
          });
        });
      }else{
        User.update({
          platform: req.body.platform,
          social_id: req.body.social_id,
          social_image: req.body.social_image,
          social_token: req.body.social_token,
          email_verified: '1'
        },
        {
          where: {id:user.id}
        })
          .then(user1 => {
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 2629800 // 24 hours
            });
            var authorities = [];
            user.getRoles().then(roles => {
              for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
              }
              var dataarray = {
                email: user.email,
                roles: authorities,
                accessToken: token,
                signup_step: user.signup_step,
                email_verified: user.email_verified,
                social_token: user.social_token,
                is_parctitioner: user.is_parctitioner,
                social_id: user.social_id,
                social_image: user.social_image
              };
              res.status(200).send({
                status: 200,  
                message: "User saved successfully!", 
                success: true, 
                data: dataarray });
            });
          })
          .catch(err => {
            res.status(500).send({status: 200, success: false, message: err.message });
          });
        
      }
      
    })
    .catch(err => {
      res.status(500).send({status: 200, success: false, message: err.message });
    });
};
