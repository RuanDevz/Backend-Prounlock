module.exports = (sequelize, DataTypes) => {
    const Free = sequelize.define('Free', {
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

    return Free;
};
