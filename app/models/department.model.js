module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define("departments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Department;
  };