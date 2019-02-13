let message = require('../models/message');
let user = require('../models/user');
const Sequelize = require('sequelize');

async function send(ctx, next) {
    const params = ctx.request.body;
    await message.create({
        fromid: params.fromid,
        toid: params.toid,
        totype: 'room',
        content: params.content,
        type: 'normal',
        createtime: new Date()
    }).then(result => {
        if(result) {
            ctx.body = ''
        } else {
            ctx.throw(400, '!system_error');
        }
    }).catch(err => {
        console.log(err);
        ctx.throw(400, '!system_error');
    });
}

async function getHistory(ctx, next) {
    //console.log(ctx.request.query);
    // Sequelize.query("SELECT * FROM `Message` as a Order By a.createtime DESC", {
    //     type: Sequelize.QueryTypes.SELECT
    // }).then(d => {

    // });
    await message.findAll({
        //attributes: [ 'id', 'content', 'createtime', 'type', 'readcount' ],
        include: [
            { model: user }
        ],
        limit: 20,
        order: [
            ['createtime', 'DESC']
        ],
        where: {
            createtime: {
                [Sequelize.Op.lt]: new Date,
            },
            toid: ctx.request.query.toid
        }
    }).then(result => {
        if(result) {
            ctx.body = JSON.stringify(result.map(i => ({
                id: i.id,
                content: i.content,
                createtime: i.createtime,
                type: i.type,
                readcount: i.readcount,
                nickname: i.user.nickname || i.user.username
            })));
        } else {
            ctx.throw(400, '!system_error');
        }
    }).catch(err => {
        console.log(err);
        ctx.throw(400, '!system_error');
    });
}

module.exports = {
    'POST /message/send': send,
    'GET /message/getHistory': getHistory
};
