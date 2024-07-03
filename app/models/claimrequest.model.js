module.exports = (sequelize, Sequelize) => {
  const ClaimRequest = sequelize.define("claimRequests", {
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
    // file: {
    //   type: Sequelize.STRING,
    // },
    // approved: {
    //   type: Sequelize.ENUM(['0', '1', '2']),
    //   defaultValue: '0',
    //   comment: "0 => pending, 1 => approved, 2 => deny"
    // },
    status: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '0',
      comment: "0 => inactive, 1 => active"
    },
  });

  return ClaimRequest;
};