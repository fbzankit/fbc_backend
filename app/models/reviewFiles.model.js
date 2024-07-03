module.exports = (sequelize, Sequelize) => {
  const ReviewFiles = sequelize.define("reviewFiles", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER
    },
    reviewId: {
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

  return ReviewFiles;
};