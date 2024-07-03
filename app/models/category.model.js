module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        parentId: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        type: {
            type: Sequelize.ENUM(['B', 'PS','RB','RPS']),
            allowNull: true,
            defaultValue: 'B'
        }
    });

    return Category;
};