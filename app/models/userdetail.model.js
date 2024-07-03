module.exports = (sequelize, Sequelize) => {
    const UserDetail = sequelize.define("user_detail", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categories: {
            type: Sequelize.STRING
        }
    });

    return UserDetail;
};