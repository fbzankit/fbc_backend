module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define("services", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cat_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
    });

    return Service;
};