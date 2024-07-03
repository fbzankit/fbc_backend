module.exports = (sequelize, Sequelize) => {
    const emailTemplates = sequelize.define("email_templates", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subject: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.TEXT
        }
    }); 

    return emailTemplates;
};