module.exports = (sequelize, Sequelize) => {
  const PublicServent = sequelize.define("publicServent", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    departmentId: {
      type: Sequelize.INTEGER
    },
    publicServentName: {
      type: Sequelize.STRING
    },
    publicServentImage: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    place_id: {
      type: Sequelize.STRING
    },
    placename: {
      type: Sequelize.STRING
    },
    lat: {
      type: Sequelize.STRING
    },
    long: {
      type: Sequelize.STRING
    },
    website: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    subCategory: {
      type: Sequelize.STRING
    },
    addedBy: {
      type: Sequelize.STRING
    },
    comingSoon: {
      type: Sequelize.STRING
    },
    addedBy: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    claimed: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '0',
      comment: "0 => yes, 1 => no"
    },
    claimedBy: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
    accredit: {
      type: Sequelize.ENUM(['0', '1']),
      defaultValue: '0',
      comment: "0 => not accredit, 1 => accredit"
    },
    fbcScore: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  });

  return PublicServent;
};