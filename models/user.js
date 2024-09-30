module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Adicionei a restrição de unicidade para o email
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVip: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        resetPasswordToken: { // Adicionando a coluna para o token de redefinição
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: { // Adicionando a coluna para a expiração do token
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {});

    return User;
};
