const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const User = require('./User');

const Resume = sequelize.define('Resume', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    analysis_data: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'resumes',
    timestamps: false,
});

User.hasMany(Resume, { foreignKey: 'user_id' });
Resume.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Resume;