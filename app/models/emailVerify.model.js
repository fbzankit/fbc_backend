module.exports = (sequelize, Sequelize) => {
    const Emailverify = sequelize.define("emailVerify", {
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

    return Emailverify;
};