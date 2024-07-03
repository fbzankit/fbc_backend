module.exports = (sequelize, Sequelize) => {
    const ReportUser = sequelize.define("report_user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          userId: {
            type: Sequelize.STRING
          },
          reportedBy: {
            type: Sequelize.STRING
          },
          reason: {
            type: Sequelize.STRING
          },
          comment: {
            type: Sequelize.STRING
          }
    });
    return ReportUser;
};