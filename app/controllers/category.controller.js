const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const Category = db.category;
const Category1 = db.category1;
const { validationResult } = require("express-validator");

// Business Categories
exports.businessCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentIdVal = 0
  if(req.body.parentId){
    parentIdVal = req.body.parentId
  }
  Category.findAll({
    include:[
      {
        model: Category1,
        as:'subCat'
      },
    ],
    where:{
      parentId : parentIdVal,
      type: 'B'
    }
  })
    .then(category => {
      // var categories = [];
      // category.forEach((categoryOne) => {
      //   categories.push({ id: categoryOne.id, name: categoryOne.name });
      // });
      res.status(200).send({
        data: category,
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

exports.addBusinessCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentCatId = 0
  if(req.body.parentCatId){
    parentCatId = req.body.parentCatId
  }
  // res.status(201).send({ parentCatId: parentCatId});
  Category.findOne({
    where: {
      name: req.body.name,
      parentId: parentCatId,
      type: 'B'
    }
  }).then(cat => {
    if (!cat) {
      Category.create({
        name: req.body.name,
        parentId: parentCatId,
        type: 'B'
      })
        .then(category => {
          res.status(200).send({
            status: 200,
            success: true,
            data: {
              id: category.id,
              name: category.name,
              parentId: category.parentId
            },
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ 
        status: 200,
        success: false,
        message: 'Category with this name already in record.' 
      })
    }
  })


};

exports.updateCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Category.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedCategory => {
    if(updatedCategory == 0){
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



// Review Business Categories
exports.reviewBusinessCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentIdVal = 0
  if(req.body.parentCatId){
    parentIdVal = req.body.parentCatId
  }
  Category.findAll({
    include:[
      {
        model: Category1,
        as:'subCat'
      },
    ],
    where:{
      parentId : parentIdVal,
      type: 'RB'
    }
  })
    .then(category => {
      // var categories = [];
      // category.forEach((categoryOne) => {
      //   categories.push({ id: categoryOne.id, name: categoryOne.name });
      // });
      res.status(200).send({
        data: category,
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

exports.addReviewBusinessCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentCatId = 0
  if(req.body.parentCatId){
    parentCatId = req.body.parentCatId
  }
  Category.findOne({
    where: {
      name: req.body.name,
      parentId: parentCatId,
      type: 'RB'
    }
  }).then(cat => {
    if (!cat) {
      Category.create({
        name: req.body.name,
        parentId: parentCatId,
        type: 'RB'
      })
        .then(category => {
          res.status(200).send({
            status: 200,
            success: true,
            data: {
              id: category.id,
              name: category.name
            },
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ 
        status: 200,
        success: false,
        message: 'Category with this name already in record.' 
      })
    }
  })


};

exports.updateReviewBusinessCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Category.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedCategory => {
    if(updatedCategory == 0){
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


// Public Servent Categories
exports.publicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentIdVal = 0
  if(req.body.parentId){
    parentIdVal = req.body.parentId
  }
  Category.findAll({
    include:[
      {
        model: Category1,
        as:'subCat'
      },
    ],
    where:{
      parentId : parentIdVal,
      type: 'PS'
    }
  })
    .then(category => {
      // var categories = [];
      // category.forEach((categoryOne) => {
      //   categories.push({ id: categoryOne.id, name: categoryOne.name });
      // });
      res.status(200).send({
        data: category,
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

exports.addPublicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentCatId = 0
  if(req.body.parentCatId){
    parentCatId = req.body.parentCatId
  }
  Category.findOne({
    where: {
      name: req.body.name,
      parentId: parentCatId,
      type: 'PS'
    }
  }).then(cat => {
    if (!cat) {
      Category.create({
        name: req.body.name,
        parentId: parentCatId,
        type: 'PS'
      })
        .then(category => {
          res.status(200).send({
            status: 200,
            success: true,
            data: {
              id: category.id,
              name: category.name
            },
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ 
        status: 200,
        success: false,
        message: 'Category with this name already in record.' 
      })
    }
  })


};

exports.updatePublicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Category.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedCategory => {
    if(updatedCategory == 0){
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


// Review Public Servent Categories
exports.reviewPublicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentIdVal = 0
  if(req.body.parentId){
    parentIdVal = req.body.parentId
  }
  Category.findAll({
    include:[
      {
        model: Category1,
        as:'subCat'
      },
    ],
    where:{
      parentId : parentIdVal,
      type: 'RPS'
    }
  })
    .then(category => {
      // var categories = [];
      // category.forEach((categoryOne) => {
      //   categories.push({ id: categoryOne.id, name: categoryOne.name });
      // });
      res.status(200).send({
        data: category,
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

exports.addReviewPublicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  var parentCatId = 0
  if(req.body.parentCatId){
    parentCatId = req.body.parentCatId
  }
  Category.findOne({
    where: {
      name: req.body.name,
      parentId: parentCatId,
      type: 'RPS'
    }
  }).then(cat => {
    if (!cat) {
      Category.create({
        name: req.body.name,
        parentId: parentCatId,
        type: 'RPS'
      })
        .then(category => {
          res.status(200).send({
            status: 200,
            success: true,
            data: {
              id: category.id,
              name: category.name
            },
            message: 'Success',
          });
        });
    } else {
      res.status(200).send({ 
        status: 200,
        success: false,
        message: 'Category with this name already in record.' 
      })
    }
  })


};

exports.updateReviewPublicServentCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).send({ status: 201, message: "Something went wrong.", success: false, data: errors.array() });
  }
  Category.update({
    name: req.body.name
  },
  {
    where: {id:req.body.id}
  }).then(updatedCategory => {
    if(updatedCategory == 0){
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


exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};