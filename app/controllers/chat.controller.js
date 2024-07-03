const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const User = db.user;
const Chat = db.chat;
const { Op } = require("sequelize");

exports.allMsg = (req, res) => {
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
  var size = 50;
  if(req.body.limit && Number(req.body.limit) > 0){
    size = Number(req.body.limit);
  }
  var offset = page * size
  // var group_id = (userId < req.body.receiver_id) ? userId+''+req.body.receiver_id : req.body.receiver_id+''+userId;
  // console.log('group_id ->>>>', group_id);
  Chat.findAll({
    where: {
      group_id: req.body.group_id
      // sender_id: userId,
      // receiver_id: req.body.receiver_id,
    },
    limit: size,
    offset: offset,
    // order: [
    //   ['createdAt', 'ASC']
    // ]
  }).then(messages => {
    // console.log(notifications);
    if (messages) {
      if (messages.length > 0) {
        var msg = 'Data fetched!'
      } else {
        var msg = 'No more data in record!'
      }
      setTimeout(() => {
        res.status(200).send({ status: 200, success: true, message: msg, data: messages });
      },1000);
    } else {
      res.status(201).send({ status: 201, success: false, message: 'No data found' });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};

exports.saveMsg = (req, res) => {
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

  // var group_id = (userId < req.body.receiver_id) ? userId+''+req.body.receiver_id : req.body.receiver_id+''+userId;

  Chat.create({
    group_id: req.body.group_id,
    sender_id: userId,
    receiver_id: req.body.receiver_id,
    message: req.body.message
  }).then(saveMsg => {
    res.status(200).send({
      status: 200, 
      success: true,
      message: 'Success',
      data: saveMsg
    });
  }).catch(err => {
    res.status(500).send({ 
      status: 500, 
      success: false, 
      message: err.message
    });
  });
};

exports.conversations = (req, res) => {
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

  var page = 0;
  if (req.body.page) {
    page = req.body.page
  }
  var size = 20;
  if(req.body.limit){
    size = parseInt(req.body.limit)
  }
  if(req.body.limit && Number(req.body.limit) > 0){
    size = Number(req.body.limit);
  }
  var offset = page * size

  db.sequelize.query("Select dataFinal.*, users.name, users.username, users.email, CASE WHEN users.image IS NOT NULL THEN CONCAT('/user/',users.image) ELSE users.image END AS image, users.createdAt AS user_created_at FROM ((SELECT *, sender_id AS user_id from chats WHERE sender_id != "+userId+" AND receiver_id = "+userId+" GROUP BY sender_id) UNION (SELECT *, receiver_id AS user_id from chats WHERE receiver_id != "+userId+" AND sender_id = "+userId+" GROUP BY receiver_id)) AS dataFinal JOIN users on dataFinal.user_id = users.id GROUP BY dataFinal.user_id ORDER BY dataFinal.createdAt DESC", {
    model: Chat,
    mapToModel: true // pass true here if you have any mapped fields
  }).then(finalData => {
    if(finalData){
      res.status(200).send({ status: 200, success: true, message: "Data fetched", data: finalData});
    }else{
      res.status(201).send({ status: 201, success: true, message: "No Conversation"});
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message, code: '143' });
  })
};