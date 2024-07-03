const db = require("../models");
const config = require("../config/auth.config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const Business = db.business;
const User = db.user;
const Review = db.review;
const ClaimRequest = db.claimRequest;
const ClaimFiles = db.claimFiles;
const Role = db.role;
const Category = db.category;
const Emailverify = db.emailVerify;
const ReviewFiles = db.reviewFiles;
const BusinessImages = db.businessImages;
var nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
var path = require('path');

var bcrypt = require("bcryptjs");
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


exports.addBusinessAsCustomer = (req, res) => {
  // return console.log(req.files)
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

  Business.create({
    bussinessName: req.body.bussinessName,
    address: req.body.location,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    phone: req.body.phone,
    website: req.body.website,
    category: req.body.category,
    subCategory: req.body.subCategory,
    comingSoon: req.body.comingSoon
  }).then(bussinessData => {
    if(bussinessData.id){
      Review.findOne({
        where: {
          userId: userId,
          businessId: bussinessData.id
        }
      }).then(findReview => {
        if (!findReview) {
          Review.create({
            userId : userId,
            businessId : bussinessData.id,
            support: req.body.support,
            category: req.body.reviewCategory,
            subCategory: req.body.reviewSubCategory,
            subSubCategory: req.body.reviewSubSubCategory,
            description: req.body.description
          }).then(reviewData => {
            var files = req.files;
            if (files.length > 0 || files.length != undefined) {
              var uploadedFiles = [];
              for (let i = 0; i < files.length; i++) {
                files[i].originalname = 'app/uploads/review/'+Date.now()+'_'+ files[i].originalname;
                fs.rename(files[i].path, files[i].originalname, function (err) {
                  if (err) {
                    res.status(500).send({ status: 500, success: false, message: err.message });
                  }else{
                    var origName = files[i].originalname.split('app/uploads/review/')[1]
                    ReviewFiles.create({
                      userId: userId,
                      reviewId: reviewData.id,
                      fileName: origName,
                      originalName: origName
                    }).then(ReviewFilesSaved => {
                      var fileUrl = "app/uploads/review/" + ReviewFilesSaved.name;
                      uploadedFiles.push({ 'id': ReviewFilesSaved.id, 'name': ReviewFilesSaved.originalName, 'file': fileUrl });
                    }).catch(err => {
                      res.status(500).send({ status: 500, success: false, message: err.message });
                    });
                  }
                });
              }
            }
            res.status(200).send({
              status: 200,
              success: true,
              data: [],
              message: 'Your review is submitted successfully!'
            });
          });
        }else{
          res.status(201).send({
            status: 201,
            success: false,
            data: [],
            message: 'You have already gave review to this business!'
          });
        }
      })
    }else{
      res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'Something went wrong in adding business. Please try again after sometime!'
      });
    }
  });
};

exports.addBusinessAsOwner = (req, res) => {
  // return console.log(req.files)
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

  
  User.create({
    name: req.body.fullName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(user => {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });
      Business.create({
        bussinessName: req.body.bussinessName,
        address: req.body.location,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone,
        website: req.body.website,
        category: req.body.category,
        subCategory: req.body.subCategory,
        comingSoon: req.body.comingSoon,
        addedBy: user.id
      });

      // var verifyUrl = req.headers.host+'/api/emailverify/'+user.email;
      var verifyUrl = '';
      Emailverify.create({
        email: req.body.email,
        token: bcrypt.hashSync(req.body.email, 8)
      }).then(emailToVerify => {
        verifyUrl = req.headers.host+"/emailVerification?email=" + emailToVerify.email + "&token=" + emailToVerify.token;
        const mailData = {
          from: 'liberate.dev@gmail.com',  // sender address
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
      role.push('owner');
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
              message: "Registration successfully! A verification email sent to your email id.",
              // data: {accessToken: token} 
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            status: 200,
            success: true,
            message: "Registration successfully! A verification email sent to your email id.",
            // data: {accessToken: token}
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
    // }else{
    //   res.status(201).send({
    //     status: 201,
    //     success: false,
    //     data: [],
    //     message: 'Something went wrong in adding business. Please try again after sometime!'
    //   });
  //   }
  // });
};

exports.addBusinessAsAdmin = (req, res) => {
  // return console.log(req.files)
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

  Business.create({
    bussinessName: req.body.bussinessName,
    address: req.body.location,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    place_id: req.body.place_id,
    placename: req.body.placename,
    lat: req.body.lat,
    long: req.body.long,
    phone: req.body.phone,
    website: req.body.website,
    category: req.body.category,
    subCategory: req.body.subCategory,
    comingSoon: req.body.comingSoon,
    addedBy: 0,
    approved: '1',
    businessEmail:req.body.businessEmail,
    tags:req.body.tags,
    air:req.body.air,
    monero:req.body.monero,
    bitcoin:req.body.bitcoin,
    bio:req.body.bio,
    facebook:req.body.facebook,
    twitter:req.body.twitter,
    instagram:req.body.instagram,
    linkedin:req.body.linkedin,
  }).then(saveBusiness => {
    res.status(200).send({ status: 200, success: true, message: "Business Added Successfully!", data: saveBusiness });
  }).catch(err => {
  res.status(500).send({
    status: 500,
    success: false, 
    message: err.message });
  });
};


exports.updateBusinessAsAdmin = (req, res) => {
  // return console.log(req.files)
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

  Business.update({
    bussinessName: req.body.bussinessName,
    address: req.body.location,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    place_id: req.body.place_id,
    placename: req.body.placename,
    lat: req.body.lat,
    long: req.body.long,
    phone: req.body.phone,
    website: req.body.website,
    category: req.body.category,
    subCategory: req.body.subCategory,
    comingSoon: req.body.comingSoon,
    businessEmail:req.body.businessEmail,
    tags:req.body.tags,
    air:req.body.air,
    monero:req.body.monero,
    bitcoin:req.body.bitcoin,
    bio:req.body.bio,
    facebook:req.body.facebook,
    twitter:req.body.twitter,
    instagram:req.body.instagram,
    linkedin:req.body.linkedin,
  },
  {
    where:{ id: req.body.businessId }
}).then(updateBusiness => {
    res.status(200).send({ status: 200, success: true, message: "Business Updated Successfully!", data: [] });
  }).catch(err => {
  res.status(500).send({
    status: 500,
    success: false, 
    message: err.message });
  });
};


exports.claimRequest = (req, res) => {
  // return console.log(req.files)
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

  User.create({
    name: req.body.fullName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(user => {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 2629800 // 24 hours
      });
      ClaimRequest.create({
        userId: userId,
        businessId: req.body.businessId
      });

      // var verifyUrl = req.headers.host+'/api/emailverify/'+user.email;
      var verifyUrl = '';
      Emailverify.create({
        email: req.body.email,
        token: bcrypt.hashSync(req.body.email, 8)
      }).then(emailToVerify => {
        verifyUrl = req.headers.host+"/emailVerification?email=" + emailToVerify.email + "&token=" + emailToVerify.token;
        console.log(verifyUrl);
        const mailData = {
          from: 'liberate.dev@gmail.com',  // sender address
            to: user.email,   // list of receivers
            subject: 'Thanks for registration',
            html: "Hello<br>Thank your for signing up with fbc. Please click on the link below to confirm your email.<br><a href='"+verifyUrl+"'>Confirm Email</a> <br>Regards<br>FBC"
          };
          transporter.sendMail(mailData, function (err, info) {
            if(err)
              return console.log(err)
            else
              return console.log(info);
          });
      });
      // return  console.log(req.headers.host);
      
      var role = [];
      role.push('owner');
      if (role) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: role
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            return res.send({
              status: 200,
              success: true,
              message: "Registration successfully! A verification email sent to your email id.",
              // data: {accessToken: token} 
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          return res.send({
            status: 200,
            success: true,
            message: "Registration successfully! A verification email sent to your email id.",
            // data: {accessToken: token}
          });
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        status: 500,
        success: false, 
        message: err.message });
    });
};

exports.claimRequestProofs = (req, res) => {
  // return console.log(req.files)
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
  var files = req.files;
  if (files.length < 1 || files.length === undefined) {
    res.status(201).send({ status: 201, success: false, message: 'Please upload at lest one Document!' });
  }

  ClaimRequest.findOne({
    where:{
      businessId: req.body.businessId,
      status: '1'
    }
  }).then(isClaimed => {
    if(isClaimed){
      return res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'This Business was already claimed!'
      });
    }
  });

  ClaimRequest.findOne({
    where:{
      userId: userId,
      businessId: req.body.businessId,
      // status: '0'
    }
  }).then(claimRequested => {
    if(!claimRequested){
      ClaimRequest.create({
        userId: userId,
        businessId: req.body.businessId,
      }).then(savedClaimRequest => {
        var uploadedFiles = [];
        for (let i = 0; i < files.length; i++) {
          
          files[i].originalname = 'app/uploads/claim/' +Date.now()+'_'+ files[i].originalname;
          fs.rename(files[i].path, files[i].originalname, function (err) {
            if (err) {
              return res.status(500).send({ status: 500, success: false, message: err.message });
            } else {
              var origName = files[i].originalname.split('app/uploads/claim/')[1]
              ClaimFiles.create({
                userId: userId,
                claimRequestId: savedClaimRequest.id,
                fileName: origName,
                originalName: origName
              }).then(fileData => {
                var fileUrl = "app/uploads/claim/" + fileData.name;
                uploadedFiles.push({ 'id': fileData.id, 'is_main': '0', 'name': fileData.originalName, 'file': fileUrl });
              }).catch(err => {
                return res.status(500).send({ status: 500, success: false, message: err.message });
              });
            }
          });
        }
        setTimeout(() => {
          res.status(200).send({ status: 200, success: true, message: 'Claim request raised successfully!' });
        }, 2000)
      }).catch(err => {
        res.status(500).send({ status: 500, success: false, message: err.message });
      });
    }else{
      res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'You have already requested to claim this business!'
      });
    }
  })

  
};

exports.businessDetail = (req, res) => {
  // req.headers && req.headers.authorization
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
  ClaimRequest.findOne({
    include:[
      {
        model: Business,
        include:[
          {
            model: User,
            as:'businessAddedUser',
            attributes: { exclude: ['password'] },
          },
          {
            model: User,
            as:'businessClaimedBy',
            attributes: { exclude: ['password'] },
          },{
            model: Category,
            as: 'businessCat'
          },{
            model: Category,
            as:'businessSubCat'
          },
        ],
      },
    ],
    where:{
      userId: userId
    }
  }).then(businessDetail => {
    if(businessDetail){
      res.status(200).send({ 
        status: 200, 
        success: true, 
        message: 'Successfully Fetched!',
        data: businessDetail
      });
    }else{
      res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'No detail found!'
      });
    }
    
  })
  .catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
}

exports.businessDetailAdmin = (req, res) => {
  // req.headers && req.headers.authorization
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
  Business.findOne({
    include:[
      {
        model: User,
        as:'businessAddedUser',
        attributes: { exclude: ['password'] },
      },
      {
        model: User,
        as:'businessClaimedBy',
        attributes: { exclude: ['password'] },
      },{
        model: Category,
        as: 'businessCat'
      },{
        model: Category,
        as:'businessSubCat'
      },
    ],
    where:{
      id: req.body.businessId
    }
  }).then(businessDetail => {
    if(businessDetail){
      res.status(200).send({ 
        status: 200, 
        success: true, 
        message: 'Successfully Fetched!',
        data: businessDetail
      });
    }else{
      res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'No detail found!'
      });
    }
    
  })
  .catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
}

exports.updateAccreditAdmin = (req, res) => {
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
  // console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId
    }
  }).then(businessData => {
    Business.update({
      accredit: req.body.status,
    },{
      where: { id: businessData.id }
    }).then(updateStatus => {
      if(updateStatus == 1){
        setTimeout(() => {
          res.status(200).send({ status: 200, success: true, message: "Business accredit is updated!" });
        },1000);
      }else{
        res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};


exports.applyForAccreditation = (req, res) => {
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
  // console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId
    }
  }).then(businessData => {
    Business.update({
      accreditAnswers: req.body.answers,
    },{
      where: { id: businessData.id }
    }).then(updateAnswers => {
      if(updateAnswers == 1){
        setTimeout(() => {
          res.status(200).send({ status: 200, success: true, message: "You have applied for Accreditation!" });
        },1000);
      }else{
        res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};



exports.updateScoreAdmin = (req, res) => {
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
  // console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId
    }
  }).then(businessData => {
    Business.update({
      fbcScore: req.body.score,
    },{
      where: { id: businessData.id }
    }).then(updateStatus => {
      if(updateStatus == 1){
        setTimeout(() => {
          res.status(200).send({ status: 200, success: true, message: "Business FBC Score is updated!" });
        },1000);
      }else{
        res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};

exports.approveStatusUpdateAdmin = (req, res) => {
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
  // console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId
    }
  }).then(businessData => {
    Business.update({
      approved: req.body.status,
    },{
      where: { id: businessData.id }
    }).then(updateStatus => {
      if(updateStatus == 1){
        setTimeout(() => {
          res.status(200).send({ status: 200, success: true, message: "Business Approval Status is updated!" });
        },1000);
      }else{
        res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
      }
    }).catch(err => {
      res.status(500).send({ status: 500, success: false, message: err.message });
    });
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};

exports.claimRequestsAdmin = (req, res) => {
  // req.headers && req.headers.authorization
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
  ClaimRequest.findAll({
    include:[
      {
        model: User,
        attributes: { exclude: ['password'] },
      },
      {
        model: ClaimFiles,
      }
    ],
    where:{
      businessId: req.body.businessId
    }
  }).then(businessDetail => {

    if(businessDetail){
      res.status(200).send({ 
        status: 200, 
        success: true, 
        message: 'Successfully Fetched!',
        data: businessDetail
      });
    }else{
      res.status(201).send({
        status: 201,
        success: false,
        data: [],
        message: 'No detail found!'
      });
    }
    
  })
  .catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
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


exports.allBusinessAdmin = (req, res) => {
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
  Business.findAll({
    include:[
      {
        model: User,
        as:'businessAddedUser'
      },
      {
        model: User,
        as:'businessClaimedBy'
      },{
        model: Category,
        as: 'businessCat'
      },{
        model: Category,
        as:'businessSubCat'
      },
    ],
  }).then(businesses => {
    if(businesses.length > 0){
      res.status(200).send({
        status: 200,
        success: true,
        data: businesses,
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


exports.allBusiness = (req, res) => {
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
  Business.findAll({
    include:[
      {
        model: User,
        as:'businessAddedUser'
      },
      {
        model: User,
        as:'businessClaimedBy'
      },
      {
        model: BusinessImages,
      },
    ],
    where : {
      approved: '1',
      status: '1',
    },
    order: [
      ['id', 'DESC']
    ]
  }).then(businesses => {
    if(businesses.length > 0){
      res.status(200).send({
        status: 200,
        success: true,
        data: businesses,
        message: 'Success'
      });
    }else{
      res.status(200).send({
        status: 200,
        success: true,
        data: businesses,
        message: 'No more data'
      });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  });
};


exports.updateBusinessStatus = (req, res) => {
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
  // return console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId
    }
  }).then(businessData => {
    // return console.log(req.body)
    if(businessData.approved == req.body.status){
      var statusVal = (req.body.status == '1')? 'Approved':'Deny';
      res.status(500).send({ status: 500, success: false, message: 'Business is already '+statusVal });
    }else{
      Business.update({
        approved: req.body.status,
      },{
        where: { id: businessData.id }
      }).then(updateStatus => {
        if(updateStatus == 1){
          setTimeout(() => {
            res.status(200).send({ status: 200, success: true, message: "Business status is updated!" });
          },1000);
        }else{
          res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
        }
      }).catch(err => {
        res.status(500).send({ status: 500, success: false, message: err.message });
      });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};


exports.claimApprovedAdmin = (req, res) => {
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
  // console.log(userId);
  Business.findOne({
    where : {
      id : req.body.businessId,
      claimed : 0
    }
  }).then(businessData => {
    if(!businessData){
      ClaimRequest.update({
        status: '1',
      },{
        where:{
          businessId: req.body.businessId,
          userId: req.body.userId,
        }
      }).then(updateStatus => {
        if(updateStatus == 1){
          Business.update({
            claimed: '1',
            claimedBy: req.body.userId,
          },{
            where:{
              id: req.body.businessId,
            }
          });
          setTimeout(() => {
            res.status(200).send({ status: 200, success: true, message: "Claim Approved Successfully!" });
          },1000);
        }else{
          res.status(500).send({ status: 500, success: false, message: "Something went wrong!" });
        }
      }).catch(err => {
        res.status(500).send({ status: 500, success: false, message: err.message });
      });
    }else{
      res.status(201).send({ status: 201, success: true, message: 'Fail!, Business already claimed!' });
    }
  }).catch(err => {
    res.status(500).send({ status: 500, success: false, message: err.message });
  })
};

exports.uploadBusinessImages = (req, res) => {
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

  var files = req.files;
  if (files.length < 1 || files.length === undefined) {
    res.status(201).send({ status: 201, success: false, message: 'Please upload at lest one image' });
  }
  var uploadedFiles = [];
  for (let i = 0; i < files.length; i++) {
    
    files[i].originalname = 'app/uploads/business/' +Date.now()+'_' + files[i].originalname;
    fs.rename(files[i].path, files[i].originalname, function (err) {
      if (err) {
        res.status(500).send({ status: 500, success: false, message: err.message });
      } else {
        var origName = files[i].originalname.split('app/uploads/business/')[1]
        BusinessImages.create({
          businessId: req.body.businessId,
          name: origName,
          originalName: origName
        }).then(fileData => {
          var fileUrl = "app/uploads/business/" + fileData.name;
          uploadedFiles.push({ 'id': fileData.id, 'is_main': '0', 'name': fileData.originalName, 'file': fileUrl });
        }).catch(err => {
          res.status(500).send({ status: 500, success: false, message: err.message });
        });
      }
    });
  }
  setTimeout(() => {
    // console.log(uploadedFiles);
    res.status(200).send({ status: 200, success: true, message: 'Images uploaded Successfully', data: uploadedFiles });
  }, 2000)

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