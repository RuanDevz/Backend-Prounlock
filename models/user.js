module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
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
        vipExpirationDate: { // Campo para armazenar a data de expiração do VIP
            type: DataTypes.DATE,
            allowNull: true, // Permite que o campo seja nulo inicialmente
        },
        lastLogin: { // Campo para armazenar a última vez que o usuário fez login
            type: DataTypes.DATE,
            allowNull: true,
        },
        recentlyViewed: { // Lista de conteúdos visualizados recentemente
            type: DataTypes.ARRAY(DataTypes.STRING), // Armazena um array de strings
            allowNull: true,
            defaultValue: [], // Inicializa com um array vazio
        },
        transactions: { // Lista de transações feitas pelo usuário
            type: DataTypes.JSONB, // Usando JSONB para armazenar um array de objetos de transações
            allowNull: true,
            defaultValue: [], // Inicializa com um array vazio
        },
        favorites: { // Lista de conteúdos favoritos do usuário
            type: DataTypes.JSONB, // Usando JSONB para armazenar um array de objetos de favoritos
            allowNull: true,
            defaultValue: [], // Inicializa com um array vazio
        },
    }, {});

    return User;
};
