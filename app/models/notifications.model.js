module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notifications", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING
        },
        notifiable_type: {
            type: Sequelize.STRING
        },
        notifiable_id: {
            type: Sequelize.INTEGER
        },
        data: {
            type: Sequelize.TEXT
        },
        reat_at: {
            type: Sequelize.DATE,
        }
    }); 

    return Notification;
};