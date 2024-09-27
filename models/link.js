module.exports = (sequelize, DataTypes) => {
    const Link = sequelize.define('Link', {
        name: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false, 
        }
    }, {});

    return Link;
};
