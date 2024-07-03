const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const Department = db.department;
const { validationResult } = require("express-validator");

exports.departmentAll = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Department.findAll()
    .then(department => {
      res.status(200).send({
        data: department,
        message: 'Success',
        status: 200,
        success: true
      });
    }).catch(err => {
      res.status(200).send({ 
        status: 200,
        success: true,
        message: err.message 
      });
    });
};

exports.addDepartment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Department.findOne({
    where: {
      name: req.body.name,
    }
  }).then(departmentData => {
    if (!departmentData) {
      Department.create({
        name: req.body.name
      }).then(savedDepartment => {
          res.status(200).send({
            status: 200,
            success: true,
            data: {
              id: savedDepartment.id,
              name: savedDepartment.name,
            },
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ 
        status: 200,
        success: false,
        message: 'Department with this name already in record.' 
      })
    }
  })
};

exports.updateDepartment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Department.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedDepartment => {
    if(updatedDepartment == 0){
      res.status(200).send({
        status: 201, 
        success: false,
        message: 'Something went wrong! please check data.',
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

exports.departmentDetail = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Department.findOne({
    where: {
      id: req.body.id,
    }
  }).then(departmentData => {
    if(!departmentData){
      return res.status(200).send({
          data: [],
          message: 'No Department Found',
          status: 201,
          success: true
        });
    }
    res.status(200).send({
      data: departmentData,
      message: 'Success',
      status: 200,
      success: true
    });
  }).catch(err => {
    res.status(200).send({ 
      status: 200,
      success: true,
      message: err.message 
    });
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