const user = require('../models/user');
const encrypt = require('../utils/encrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/**
 * @method login 用户登录
 * @param {String} username 用户名
 * @param {String} password 密码
 */
async function login(ctx, next) {
    const params = ctx.request.body;

    //判断账户名为空
    if(!params.username || !params.username.trim()) {
        ctx.throw(400, '!login_user_not_found');
    }
    //判断密码为空
    if(!params.password || !params.password.trim()) {
        ctx.throw(400, '!login_password_error');
    }

    const loginuser = await user.findOne({
        where: { username: params.username }
    });

    if(!loginuser) {
        ctx.throw(400, '!login_user_not_found');
    }

    var cert = fs.readFileSync('private.key');

    //校验密码
    if(loginuser.password !== encrypt.encryptForPassword(params.password)) {
        ctx.throw(400, '!login_password_error');
    }

    // 生成JWT
    var token = await jwt.sign({
        id : loginuser.id,
        username : loginuser.username
    }, cert, { algorithm: 'RS256', expiresIn: '1h' });

    //保存到Session（已弃用，采用JWT）
    // ctx.session.userinfo = {
    //     id: loginuser.id,
    //     username: loginuser.username,
    //     email: loginuser.email,
    //     token: token
    // };

    //将数据返回客户端
    ctx.body = {
        id: loginuser.id,
        username: loginuser.username,
        nickname: loginuser.nickname || loginuser.username,
        email: loginuser.email,
        token: token
    };
}

async function checkToken(ctx, next) {
    let params = ctx.request.body;
    jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
        console.log(token);
    });

    ctx.body = token;
}

/**
 * @method 用户注册
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} email 邮箱
 */
async function register(ctx, next) {
    let params = ctx.request.body;
    if(!params.username) {
        ctx.throw(400, '!username_blank');
    } else if(!params.password) {
        ctx.throw(400, '!password_blank');
    } else if(!params.email) {
        ctx.throw(400, '!email_blank');
    }
    user.create({
        username: params.username,
        password: encrypt.encryptForPassword(params.password),
        email: params.email
    }).then(result => {
        if(result) {
            ctx.body = result
        } else {
            ctx.throw(400, '!user_add_error');
        }
    }).catch(err => {
        console.log(err);
        ctx.throw(400, '!user_add_error');
    });
}

//

async function isLogin(ctx, next) {
    await encrypt.checkToken(ctx).then(async result => {

        const loginuser = await user.findById(result.id);
        ctx.body = JSON.stringify({
            id: loginuser.id,
            username: loginuser.username,
            nickname: loginuser.nickname || loginuser.username,
            email: loginuser.email,
            token: (ctx.headers['x-authorization'] || '').replace('Bearer ', '')
        });

    }).catch(err => {
        ctx.body = '';
    });
}

async function getSession(ctx, next) {
    await new Promise((resolve, reject) => {
        if(ctx.session.userinfo) {
            resolve();
        } else {
            reject('!userinfo_not_found');
        }
    }).then(result => {
        ctx.body = JSON.stringify(result);
    });
}

module.exports = {
    'POST /login': login,
    'POST /isLogin': isLogin,
    'POST /register': register,
    'GET /getSession': getSession
};
