const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const Emailtemplates = db.emailTemplates;
const { validationResult } = require("express-validator");

exports.templatedetail = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Emailtemplates.findByPk(req.body.id)
  .then(emailtemplate => {
    if(emailtemplate){
      res.status(200).send({
        status: 200,
        success: true,
        data: emailtemplate,
        message: 'Success'
      });
    }else{
      res.status(200).send({
        status: 200,
        success: true,
        data: [],
        message: 'No record found!'
      });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
}

exports.allTemplate = (req, res) => {
  var page = 0;
  if(req.query.page){
    page = req.query.page
  }
  var size = 20;
  var offset = page * size;
  Emailtemplates.findAll({
    limit:size, 
    offset:offset,
    order: [
      ['id', 'DESC']
    ]}
  ).then(emailtemplates => {
    res.status(200).send({
      status: 200,
      success: true,
      data: emailtemplates,
      message: 'Success'
    });
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};

exports.addTemplate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Emailtemplates.create({
    subject: req.body.subject,
    body: req.body.body,
  }).then(emailtemplate => {
      res.status(200).send({
        status: 200, 
        success: true,
        message: 'Success',
        data: emailtemplate,
      });
    });
};

exports.deleteTemplate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 200, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Emailtemplates.destroy({
    where:{
      id: req.body.id
    }
  }).then(data => {
      res.status(200).send({
        status: 200,
        success: true,
        message: 'Deleted Successfully',
      });
    }).catch(err => {
      res.status(500).send({
        status: 500,
        success: false,
        message: 'Something went wrong!',
      });
    });
};

exports.updateTemplate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Emailtemplates.update({
    subject: req.body.subject,
    body: req.body.body
  },
  {
    where: {id:req.body.id}
  }).then(emailtemplate => {
    if(emailtemplate == 0){
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
          subject: req.body.subject,
          body: req.body.body
        },
      });
    }
    });
};
