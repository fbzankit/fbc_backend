const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const Service = db.service;
const User = db.user;
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");


exports.serviceDetail = (req, res) => {
  // req.headers && req.headers.authorization
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  User.findByPk(userId)
    .then(user => {

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        // console.log(user.id);
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: req.headers.authorization.split(' ')[1]
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.userServices = (req, res) => {

  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  User.findByPk(userId)
    .then(user => {
      Service.findAll({
        where:{
          cat_id: {
            [Op.in]: JSON.parse("[" + user.category + "]")
          }
        }
      }).then(service => {
        if(service.length > 0){
          res.status(200).send({
            status: 200,
            success: true,
            data: service,
            message: 'Success'
          });
        }else{
          res.status(200).send({
            status: 200,
            success: true,
            data: service,
            message: 'No more data'
          });
        }
      }).catch(err => {
        res.status(500).send({ status: 500, success: false, message: err.message });
      });

    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
};

exports.add = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  Service.findOne({
    where: {
      name: req.body.name
    }
  }).then(cat => {
    if (!cat) {
      Service.create({
        name: req.body.name,
        cat_id: req.body.category_id
      })
        .then(service => {
          console.log(service)
          res.status(200).send({
            data: {
              id: service.id,
              name: service.name,
              category_id: service.cat_id
            },
            status: 200, 
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ message: 'service with this name already in record.' })
    }
  })


};


exports.updateService = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Service.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedService => {
    if(updatedService == 0){
      res.status(200).send({
        status: 201, 
        success: false,
        message: 'Something went wrong',
      });
    }else{
      res.status(200).send({
        status: 200, 
        success: true,
        message: 'Success',
        data: {
          name: req.body.name
        },
      });
    }
    });
};


exports.all = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  Service.findAll({
    where:{
      cat_id: req.body.category_id
    }
  }).then(service => {
    if(service.length > 0){
      res.status(200).send({
        status: 200,
        success: true,
        data: service,
        message: 'Success'
      });
    }else{
      res.status(200).send({
        status: 200,
        success: true,
        data: service,
        message: 'No more data'
      });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};


exports.allServicesForUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  Service.findAll({
    where : {
      cat_id:{
        [Op.in]: JSON.parse("[" + req.body.category_id + "]")
      }
    }
  }).then(service => {
    if(service.length > 0){
      res.status(200).send({
        status: 200,
        success: true,
        data: service,
        message: 'Success'
      });
    }else{
      res.status(200).send({
        status: 200,
        success: true,
        data: service,
        message: 'No more data'
      });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};



exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};