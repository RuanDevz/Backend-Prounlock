module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVip: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        resetPasswordToken: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: { 
            type: DataTypes.DATE,
            allowNull: true,
        },
        vipExpirationDate: { 
            type: DataTypes.DATE,
            allowNull: true, 
        },
    }, {});

    return User;
};
 