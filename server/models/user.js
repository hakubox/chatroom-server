const Sequelize = require('sequelize');
const sequelize = require('../utils/mysql');

/**
 * @class 用户表
 */
const user_model = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING(50),
    },
    createtime: {
        type: Sequelize.DATE,
        defaultValue: () => new Date()
    },
    lastlogintime: {
        type: Sequelize.DATE,
    },
    score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    headurl: {
        type: Sequelize.STRING(100),
        get() {
            const _headurl = this.getDataValue('headurl');
            return _headurl ? `url('${_headurl}')` : '';
        }
    },
    remark: {
        type: Sequelize.STRING(200),
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    isenable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isactive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'user',
    timestamps: false,
    classMethods: {
        associate: function (model) {
            var user = model.user;
            user.hasMany(address);
        }
    }
});

module.exports = user_model;
