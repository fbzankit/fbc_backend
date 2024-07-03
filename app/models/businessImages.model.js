module.exports = (sequelize, Sequelize) => {
    const BusinessImages = sequelize.define("business_images", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        businessId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        originalName: {
            type: Sequelize.STRING
        }
    });

    return BusinessImages; 
};