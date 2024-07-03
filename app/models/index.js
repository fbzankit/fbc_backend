const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    // port: config.PORT,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.userdetail = require("../models/userdetail.model")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.category1 = require("../models/category.model.js")(sequelize, Sequelize);
db.service = require("../models/service.model.js")(sequelize, Sequelize);
db.forgetpass = require("./forgetpass.model.js")(sequelize, Sequelize);
db.userImages = require("./userImages.model")(sequelize, Sequelize);
db.reportUser = require("./reportUser.model")(sequelize, Sequelize);
db.bankaccount = require("./bankAccount.model")(sequelize, Sequelize);
db.payments = require("./payment.model")(sequelize, Sequelize);
db.emailTemplates = require("./emailTemplates.model")(sequelize, Sequelize);
db.notifications = require("./notifications.model")(sequelize, Sequelize);
db.chat = require("./chat.model")(sequelize, Sequelize);
db.emailVerify = require("./emailVerify.model")(sequelize, Sequelize);
db.business = require("./business.model")(sequelize, Sequelize);
db.review = require("./review.model")(sequelize, Sequelize);
db.reviewFiles = require("./reviewFiles.model")(sequelize, Sequelize);
db.claimRequest = require("./claimrequest.model")(sequelize, Sequelize);
db.claimFiles = require("./claimFiles.model")(sequelize, Sequelize);
db.publicServent = require("./publicServent.model")(sequelize, Sequelize);
db.department = require("./department.model")(sequelize, Sequelize);
db.businessImages = require("./businessImages.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});


db.claimRequest.hasOne(db.business, {sourceKey: 'businessId', foreignKey: 'id'});
db.claimRequest.hasOne(db.user, {sourceKey: 'userId', foreignKey: 'id'});
db.claimRequest.hasMany(db.claimFiles, {sourceKey: 'id', foreignKey: 'claimRequestId'});
db.business.hasOne(db.user, {sourceKey: 'addedBy',foreignKey: 'id', as:'businessAddedUser'});
db.business.hasOne(db.user, {sourceKey: 'claimedBy',foreignKey: 'id', as:'businessClaimedBy'});
db.category.hasMany(db.category1, {sourceKey: 'id', foreignKey: 'parentId', as:'subCat'});
db.business.hasOne(db.category, {sourceKey: 'category', foreignKey: 'id', as:'businessCat'});
db.business.hasOne(db.category, {sourceKey: 'subCategory', foreignKey: 'id', as:'businessSubCat'});
db.business.hasMany(db.businessImages, {sourceKey: 'id', foreignKey: 'businessId'});


db.ROLES = ["user", "admin", "owner", "public_servant", "sub_admin"];

module.exports = db;