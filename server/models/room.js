const Sequelize = require('sequelize');
const sequelize = require('../utils/mysql');

/**
 * @class 房间表
 */
module.exports = sequelize.define('room', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    createtime: {
        type: Sequelize.DATE,
        allowNull: false
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
    }
}, {
    tableName: 'room',
    timestamps: false,
    classMethods: {
        associate: function (model) {
            var user = model.user;
            user.hasMany(address);
        }
    }
});
