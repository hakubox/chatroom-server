const http = require('http'),
      Koa = require('koa'),
      bodyParser = require('koa-bodyparser'),
      onerror = require('koa-onerror'),
      koaWebpack = require('koa-webpack'),
      webpackDevConf = require('./build/webpack.base.conf'),
      history = require('./middleware/koa2-connect-history-api-fallback'),
      session = require('koa-session'),
      MysqlStore = require('koa-mysql-session');

require('dotenv').config();

const app = new Koa();

app.keys = ['some secret hurr'];

//http.createServer(app.callback()).listen(3000)

var server = require('http').Server(app.callback());
var io = require('socket.io')(server);

server.listen(process.env.APP_PORT, () => {
    console.log('服务器已启动')
});

io.on('connection', function(socket) {
    // socket.broadcast.emit('server_message', {
    //     type: 'client_user_login',
    //     msg: '一个新用户登录了！'
    // });

    //发送消息
    socket.on('message', function(data) {
        io.emit('client_message', {
            type: 'client_message',
            data: {
                userGId: socket.id
            },
            msg: data
        });
    });

    //下线
    // socket.on('disconnect', function(data) {
    //     io.emit('server_message', {
    //         type: 'client_disconnect',
    //         data: data,
    //         msg: '用户断开连接'
    //     });
    // });

    //数据库新增用户
    // socket.on('adduser', function(data) {
    //     socket.broadcast.emit('server_message', {
    //         type: 'client_user_create',
    //         data: data,
    //         msg: '有人新建了一个账号：' + data + '，请大家注意！'
    //     });
    //     socket.broadcast.emit('server_adduser', data);
    // });

})

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    let start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(bodyParser());

const CONFIG = {
    key: 'chatroom201812102051', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

onerror(app);

let Router = require('koa-better-router')
let router = Router().loadMethods()

//导入controller middleware:
const controller = require('./server/controller');

app.use(controller());

let api = Router({ prefix: '/api' })

api.extend(router)

app.use(history({
    whiteList: ['/api'],    //白名单
    verbose: true           //打出转发日志
}));

onerror(app);

koaWebpack({
    config: webpackDevConf
}).then(middleware => {
    app.use(middleware);
})

app.use(router.middleware())
app.use(api.middleware())
