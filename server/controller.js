const fs = require('fs');

const apiPath = '/api';

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(apiPath + path, mapping[url]);
            console.log(`注册URL: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(apiPath + path, mapping[url]);
            console.log(`注册URL: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

//扫描controllers
function addControllers(router, dir) {
    var files = fs.readdirSync(__dirname + dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        let mapping = require(__dirname + dir + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir = '/controller/') {
    let router = require('koa-router')();
    addControllers(router, dir);
    return router.routes();
};