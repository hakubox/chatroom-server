const forge = require('node-forge'),
      fs = require('fs'),
      jwt = require('jsonwebtoken');

/**
 * @method 加密用户密码
 * @param {String} pwd 用户密码的明码
 * @return 加密后的密码
 */
const encryptForPassword = (pwd) => {
    let md = forge.md.md5.create();
    let md2 = forge.md.sha256.create();
    let result = '';
    md.update(pwd);
    result = md.digest().toHex();
    md2.update(result);
    result = md2.digest().toHex();
    return result;
}

/**
 * @method 加密token
 * @param {String} uid 用户id
 * @param {Date} createtime 从用户表直接取得的创建日期
 * @return 加密后的token
 */
const encryptForToken = (uid, createtime) => {
    let md = forge.md.md5.create();
    let md2 = forge.md.sha256.create();
    let result = '';
    md.update(uid + ':' + createtime);
    result = md.digest().toHex();
    md2.update(result);
    result = md2.digest().toHex();
    return result;
}

/**
 * @method 校验客户端传入的Token
 * @param {Object} req 传入的request
 */
const checkToken = async (req) => {
    return new Promise((resolve, reject) => {
        let token = req.headers['x-authorization'];
        if(token) {
            token = token.replace('Bearer ', '');
            let cert = fs.readFileSync('./public.key');
            // 先解密
            jwt.verify(token, cert, { algorithms: ['RS256'] }, async (err, decoded) => {
                if(err || !decoded) {
                    switch (err.name) {
                        case 'TokenExpiredError':
                            reject('token_expired');
                            break;

                        default:
                            reject(err);
                    }
                } else {
                    if(decoded.id == req.headers['x-auth-id']) {
                        resolve(decoded);
                    } else {
                        reject();
                    }
                }
            });
        } else {
            reject();
        }
    })
}

module.exports = {
    encryptForPassword,
    encryptForToken,
    checkToken
}
