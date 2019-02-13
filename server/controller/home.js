
const fn_home = async (ctx, next) => {
    console.log(`对象1：${JSON.stringify(ctx.request.query)}`)  //对象
    console.log(`字符串：${ctx.request.querystring}`)  //字符串
    ctx.response.body = '<h1>HOME page'+ctx.request.query.id +':'+ctx.request.query.user+'</h1>'
}

module.exports = {
    'GET /home': fn_home
};