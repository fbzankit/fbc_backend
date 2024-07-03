module.exports = (sequelize, Sequelize) => {
    const Forgetpass = sequelize.define("forget_password", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING
        }
    });

    return Forgetpass;
};