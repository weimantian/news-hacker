//模块3（路由模块）；负责路由判断
//负责封装所有路由判断代码


const handler = require('./handler.js')

module.exports = function(req, res) {
    if (req.pathname === '/' || req.pathname === '/index') {

    	handler.index(req, res);

    } else if (req.pathname === '/submit') {

    	handler.submit(req, res);

    } else if (req.pathname === '/detail') {

    	handler.detail(req, res);

    } else if (req.pathname === '/add' && req.method === 'get') {

    	handler.addGet(req, res);

    } else if (req.pathname === '/add' && req.method === 'post') {

    	handler.addPost(req, res);

    } else if (req.url.indexOf('/public') === 0) {
    
    	handler.staticResource(req, res);

    } else if (req.pathname === '/login') {

    	handler.login(req, res);

    } else if (req.pathname === '/loginService' && req.method === 'post') {
        console.log("loginService");
        // post 方式提交用户信息
        // 获取post提交的数据
        var post = '';
        req.on('data', (chunk) => {
            post += chunk;
        });

        req.on('end', () => {
            // 连接数据库
            connection.connect();

            // 查询数据库
            var sql = "SELECT * FROM Websites WHERE name=? and url=?";
            // 获取JSON提交的用户名和数据
            var sqlParams = JSON.stringify(data);
            console.log(sqlParams);

            connection.query(sql, sqlParams, (err, result) => {
                if(err) {
                    console.log("ERROR1: " ,err.message);
                    return;
                }
                if(!result) {
                    console.log(result);
                } else {
                    console.log("无此用户");
                }
                res.statusCode = 302;
                res.statusMessage = 'Found';
                // 跳转，重定向
                res.setHeader('location', '/');
                res.end();
            });
            connection.end();
        });
    } else {

    	handler.errorPage(res);

    }

}
