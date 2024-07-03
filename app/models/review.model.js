module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("reviews", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER
    },
    businessId: {
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.TEXT,
    },
    support: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '1',
      comment: "0 => yes, 1 => no"
        },
    category: {
      type: Sequelize.INTEGER
    },
    subCategory: {
      type: Sequelize.INTEGER
    },
    subSubCategory: {
      type: Sequelize.INTEGER
    },
    approved: {
      type: Sequelize.ENUM(['0', '1', '2']),
      defaultValue: '0',
      comment: "0 => pending, 1 => approved, 2 => deny"
    },
    status: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '1',
      comment: "0 => inactive, 1 => active"
    },
  });

  return Review;
};