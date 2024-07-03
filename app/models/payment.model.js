module.exports = (sequelize, Sequelize) => {
    const Payments = sequelize.define("payments", { 
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING
        },
        from: {
            type: Sequelize.INTEGER
        },
        to: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.STRING
        },
        stripe_id: {
            type: Sequelize.STRING
        },
        eventId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        ratingId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packageId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        extendedHourId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM(['Released', 'Held','Refunded','Cancelled','Withdrawn','Pending']),
            allowNull: true,
            defaultValue: 'Pending'
        },
        stripe_transfer_id: {
            type: Sequelize.STRING
        }
    });

    return Payments;
};