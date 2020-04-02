const mysql = require('mysql');

const mysqlConfig = require('./mysqlConfig.js');

var connection = mysql.createConnection(mysqlConfig);


module.exports.conn = function(callback) {
    
    connection = connection = mysql.createConnection(connection.config);
    connection.connect();
    callback();
}

module.exports.select = function(res, userInfo, callback) {
    // 查询数据库
    var sql = "SELECT * FROM userinfo WHERE username=? and password=?";
    // 获取JSON提交的用户名和数据
    var sqlParams = [userInfo.username, userInfo.password];

    connection.query(sql, sqlParams, (err, result) => {
        if (err) {
            console.log("ERROR1: ", err.message);
        }
        if (result[0] === undefined) {

            console.log("无此用户...");
            res.statusCode = 302;
            res.statusMessage = 'Found';
            // 跳转，重定向
            res.setHeader('location', '/login');
            res.end();

        } else {

            console.log("用户: " + result[0].username + " 登陆成功...")
            res.statusCode = 302;
            res.statusMessage = 'Found';
            // 跳转，重定向
            res.setHeader('location', '/');
            res.end();
        }
        callback(connection);

    });
}

module.exports.close = function() {

    connection.end();
    
}