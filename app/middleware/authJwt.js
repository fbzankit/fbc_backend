const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  
  
  if (!req.headers.authorization){
    return res.status(401).send({
      status: 401,
      success: false,
      message: "No token provided!"
    });
  }
  let token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: 401,
      success: false,
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: 401,
        success: false,
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;

    User.findOne({
      where : {
        id: decoded.id,
        status : '1'
      }
    }).then(user_data => {
      // console.log(user_data)
      if(!user_data){
        return res.status(401).send({
          status: 401,
          success: false,
          message: "User Inactive!"
        });
      }
      if(user_data.email_verified != 1){
        return res.status(401).send({
          status: 401,
          success: false,
          message: "User email is not verified."
        });
      }
      next();
    }).catch(err => {
      return res.status(500).send({
        status: 500,
        success: false,
        message: err.message
      });
    })
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(401).send({ status: 401, success: false, message: "User has to be Admin for this section!", data: []});
      // res.status(401).send({
      //   message: "Require Admin Role!"
      // });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(401).send({
        status: 401,
        success: false,
        message: "Require Moderator Role!"
      });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(401).send({
        status: 401,
        success: false,
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;