module.exports = (sequelize, Sequelize) => {
    const UserImages = sequelize.define("user_images", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        originalName: {
            type: Sequelize.STRING
        }
    });

    return UserImages; 
};