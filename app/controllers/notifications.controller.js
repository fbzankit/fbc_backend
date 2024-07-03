const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const Events = db.events;
const Services = db.service;
const Blocktime = db.blocktime;
const practitionerServices = db.practitionerServices;
const BookedEvent = db.bookedEvent;
const User = db.user;
const UserPackages = db.userPackages;
const Packages = db.packages;
const MeetingDetail = db.meetingDetail;
const EventReview = db.eventReview;
const Payments = db.payments;
const Bankaccount = db.bankaccount;
const Notification = db.notifications;
const { Op } = require("sequelize");
const Stripe = require('stripe');
// const stripe = Stripe('sk_test_2BbeCIkWjb5gw7JJtGKEL4HX0096eUDzIw'); //deepak
// const stripe = Stripe('sk_test_51IwYP0KxyHny1crslpD2uINjtIw6S0t4yvkyXWQ9WVAwjeMyypulh8mX30phOEaloo8Pg4j6hfFirNj9LeDYH4oj00tUA2XFXS'); //avni
const stripe = Stripe('sk_test_51K1dQ9LU8HQ73neohkqOFoJvCyBshpTUKG7scdCaiTBVdYfKjJCNeAWqw6oZn6QR7XkVOBBrbGO62shLiGVrZBk800Sg1S77SS'); //client


exports.notificatoinsAll = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: 401,
          success: false,
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };

  var page = 0;
  if (req.body.page) {
    page = req.body.page
  }
  var size = 10;
  if(req.body.limit && Number(req.body.limit) > 0){
    size = Number(req.body.limit);
  }
  var offset = page * size
  Notification.findAll({
    include: [
      {
        model: User
      }
    ],
    where: {
      notifiable_id: userId,
    },
    limit: size,
    offset: offset,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(notifications => {
    // console.log(notifications);
    if (notifications) {
      if (notifications.length > 0) {
        var msg = 'Data fetched!'
      } else {
        var msg = 'No more data in record!'
      }
      setTimeout(() => {
        res.status(200).send({ status: 200, success: true, message: msg, data: notifications });
      },1000);
    } else {
      res.status(201).send({ status: 201, success: false, message: 'No data found' });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};

exports.readNotification = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: 401,
          success: false,
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  if(req.body.id > 0){
    var condition = {
      id:req.body.id,
      notifiable_id: userId
    }
  }else{
    var condition = {
      notifiable_id: userId
    }
  }
  Notification.update({
    reat_at: Date.now()
  },
  {
    where: condition
  }).then(notification => {
    if(notification == 0){
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
      });
    }
    });
};

exports.notificatoinsCheckAdmin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: 401,
          success: false,
          message: "Unauthorized!"
        });
      }
      userId = decoded.id;
    });
  };
  var pendingPaymentCount = 0;
  var pendingPracRequest = 0;

  Payments.count({
    where: {
      status: 'Pending'
    }
  }).then(PaymentsAll => {
    pendingPaymentCount = PaymentsAll
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });

  User.count({
    where: {
      is_practitioner: '2'
    }
  }).then(PendigPracRequestAll => {
    pendingPracRequest = PendigPracRequestAll

  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  }); 

  setTimeout(() => {
    res.status(200).send({ 
      status: 200,
      success: true,
      message: 'success',
      data: {
        "practitioners": pendingPracRequest, 
        "payments": pendingPaymentCount
      } 
    });
  },1000);
};
