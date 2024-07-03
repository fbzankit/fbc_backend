module.exports = (sequelize, Sequelize) => {
    const BankAccount = sequelize.define("bank_accounts", { 
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        stripe_bank_id: {
            type: Sequelize.STRING
        },
        is_verified: {
            type: Sequelize.ENUM(['0', '1']),
            allowNull: true,
            defaultValue: '0'
        },
        is_default: {
            type: Sequelize.ENUM(['0', '1']),
            allowNull: true,
            defaultValue: '0'
        }
    });

    return BankAccount;
};