const Sequelize = require('sequelize');
const sequelize = require('../utils/mysql');
const user_model = require('./user');

/**
 * @class 消息表
 */
const message_model = sequelize.define('message', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    fromid: {
        type: Sequelize.UUID,
        allowNull: false,

    },
    toid: {
        type: Sequelize.UUID,
        allowNull: false
    },
    //发送至类型（user/room/else）
    totype: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    createtime: {
        type: Sequelize.DATE,
        defaultValue: () => new Date()
    },
    content: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    //已读用户数
    readcount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    //消息类型 sys:系统,global:全局,normal:普通
    type: {
        type: Sequelize.STRING(20),
        defaultValue: 'normal'
    }
}, {
    tableName: 'message',
    timestamps: false,
    classMethods: {
        // associate: function (model) {
        //     model.message.belongsTo(model.user, );
        // }
    }
});

message_model.belongsTo(user_model, { foreignKey: 'fromid', targetKey: 'id' });

module.exports = message_model;
