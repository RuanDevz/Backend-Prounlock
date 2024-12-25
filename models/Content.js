module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('Content', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      service: {  
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    return Content;
  };
  