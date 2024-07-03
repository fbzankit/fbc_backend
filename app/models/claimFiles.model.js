module.exports = (sequelize, Sequelize) => {
  const ClaimFiles = sequelize.define("claimFiles", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER
    },
    claimRequestId: {
      type: Sequelize.INTEGER
    },
    fileName: {
      type: Sequelize.STRING
    },
    originalName: {
        type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '1',
      comment: "0 => inactive, 1 => active"
    },
  });

  return ClaimFiles;
};