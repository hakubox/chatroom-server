let user = require('../models/user');

async function getAll(ctx, next) {
    await user.findAll().then(result => {
        ctx.body = JSON.stringify(result);
    });
}

async function setSocketId(ctx, next) {
    const params = ctx.request.body;
    await user.update({
        socketid: params.socketid
    }, {
        where: {
            id: params.id
        },
        fields: ['socketid']
    }).then(result => {
        ctx.body = JSON.stringify(result);
    });
}

module.exports = {
    'GET /user/getall': getAll,
    'POST /user/setSocketId': setSocketId
};
