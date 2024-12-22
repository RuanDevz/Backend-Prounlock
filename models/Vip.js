module.exports = (sequelize, DataTypes) => {
    const Vip = sequelize.define('Vip', {
        name: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        postDate: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: DataTypes.NOW, 
        }
    });

    return Vip;
};
