//模块化当前项目
//模块1（服务模块）：负责启动服务
//模块2（扩展模块）：负责扩展 req 和 res 对象，为 req 和 res 提供更方便的API
//模块3（路由模块）；负责路由判断
//模块4（业务模块）：负责处理具体路由的业务处理
//模块5（数据操作模块）：负责进行数据库操作模块
//模块6（配置信息模块）：负责保存项目的配置信息
// 加载http模块
const http = require('http');

// 加载context.js
const context = require('./context.js');
const router = require('./router.js');
const config = require('./config.js')

// 创建服务
http.createServer().on('request', function(req, res) {

    context(req, res);
    console.log(req.url);

    router(req, res);

}).listen(config.port, function() {
    console.log('http://localhost:'+config.port);
});

