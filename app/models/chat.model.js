module.exports = (sequelize, Sequelize) => {
    const chat = sequelize.define("chats", { 
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        group_id: {
            type: Sequelize.STRING
        },
        sender_id: {
            type: Sequelize.INTEGER
        },
        receiver_id: {
            type: Sequelize.INTEGER
        },
        message: {
            type: Sequelize.TEXT
        },
        if_file: {
            type: Sequelize.ENUM(['0', '1']),
            allowNull: true,
            defaultValue: '0'
        },
        extension: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.STRING
        },
        file_name: {
            type: Sequelize.STRING
        },
        is_mute: {
            type: Sequelize.ENUM(['0', '1']),
            allowNull: true,
            defaultValue: '0'
        },
        is_blocked: {
            type: Sequelize.ENUM(['0', '1']),
            allowNull: true,
            defaultValue: '0'
        }
    });

    return chat;
};