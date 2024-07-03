module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      exclude: true
    },
    name: {
      type: Sequelize.STRING
    },
    language: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    platform: {
      type: Sequelize.STRING
    },
    social_id: {
      type: Sequelize.STRING
    },
    social_image: {
      type: Sequelize.STRING
    },
    social_token: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    email_verified: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.ENUM(['0', '1','2']),
      defaultValue: '1',
      comment: "0 => inactive, 1 => active, 2 => hide"
    },
  });

  return User;
};