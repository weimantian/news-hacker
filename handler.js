//模块4（业务模块）：负责处理具体路由的业务处理

const fs = require('fs');
const path = require('path');
const querystring = require('querystring');//负责将字符串解析街详细为json
const _ = require('underscore');

const dbHandler = require("./dbHandler.js");



// index.html 
module.exports.index = function(req, res) {
    readData(function(list) {
        res.render(path.join(__dirname, 'htmls', 'index.html'), {
            item: list
        });
    });
}

// submit.html
module.exports.submit = function(req, res) {
    res.render(path.join(__dirname, 'htmls', 'submit.html'));
}

// detail.htmml
module.exports.detail = function(req, res) {
    // 读取data.json的数据
    readData(function(list) {
        // 获取新闻 id
        var id = req.query.id;
        //使用render函数进行渲染
        res.render(path.join(__dirname, 'htmls', 'detail.html'), {
            item: list[id]
        });
    });
}

// ligin.html
module.exports.login = function(req, res) {
    res.render(path.join(__dirname, 'htmls', 'login.html'));
}

// denlu
module.exports.denlu = function(req, res) {
    // post 方式提交用户信息
    // 获取post提交的数据
    // 连接数据库
    var post = '';
    req.on('data', (chunk) => {
        post += chunk;
    });
    req.on('end', () => {

        var userInfo = querystring.parse(post);

        dbHandler.conn(() => {

            dbHandler.select(res, userInfo, ()=> {

                dbHandler.close();

            })
        })
    });
}

// addcmm()
module.exports.addcmm = function(req, res) {

    var post = '';
    req.on('data', (chunk) => {
        post += chunk;
    });
    req.on('end', () => {
        
        var postJson = querystring.parse(post);

        var filename = req.query.id+'.json';

        fs.readFile(path.join(__dirname, 'public', 'news', filename), 'utf-8', (err, data) => {
            
            if(err && err.code !== "ENOENT") {

                throw err;
            } 

            var list = JSON.parse(data || '[]');

            var cmm = {"id": list.length, "content": postJson.content, "time": dateFormate(new Date()),"commentator": postJson.commentator }
        
            list.push(cmm);
            fs.writeFile(path.join(__dirname, 'public', 'news', filename), JSON.stringify(list), (err)=>{

                if(err) throw err;
            })

        });
    });


}

// addGet()
module.exports.addGet = function(req, res) {
    // get 方式提交一条新闻
    // 1. 获取data.json的数据，并将读取的数据转换位一个数组
    readData((list) => {
        list.push(req.query);
        // 2. 将数据添加到data.json文件中
        writeData(JSON.stringify(list), () => {
            res.statusCode = 302;
            res.statusMessage = 'Found';
            // 跳转，重定向
            res.setHeader('location', '/');
            res.end();
        })
    });
}


module.exports.addPost = function(req, res) {
    // post 方式提交一条新闻
    // 获取post提交的数据
    var post = '';
    req.on('data', (chunk) => {
        post += chunk;
    });
    req.on('end', () => {
        // 在数据提交完成后，将post转为数组,并添加到data.json文件中
        readData((list) => {

            list.push(querystring.parse(post));
            // 将数据添加到data.json文件中
            writeData(JSON.stringify(list), () => {
                // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
                res.statusCode = 302;
                res.statusMessage = 'Found';
                // 跳转，重定向
                res.setHeader('location', '/');
                res.end();
            });
        });
    });
}

// 加载静态资源
module.exports.staticResource = function(req, res) {

    res.render(path.join(__dirname, req.url));

}

module.exports.errorPage = function(res) {
    res.writeHeader(404, 'Not Found', {
        'Content-Type': 'text/plain; charset = utf-8'
    });
    res.end('404,Page Not Found');
}

module.exports.submit = function(req, res) {
    res.render(path.join(__dirname, 'htmls', 'submit.html'));
}

//封装读取data.json文件操作
function readData(callbanck) {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', (err, data) => {
        // err.code != 'ENOENT',不是文件不存在错误
        if (err && err.code != 'ENOENT') {
            throw err;
        }
        //将data字符串解析为list数组
        var list = JSON.parse(data || '[]');

        //使用回调函数callback()将读取到的数据list传递出去
        callbanck(list);
    });
}

// 封装向文件写数据的函数,data 为字符串,callban为文件写入完成后要执行的方法
function writeData(data, callback) {
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), data, (err) => {
        if (err) {
            throw err;
        }
        callback();
    });
}

//封装 post 提交数据的代码
function postSubmit(req, callback) {
    // 获取post提交的数据
    var post = '';
    req.on('data', (chunk) => {
        post += chunk;
    });
    req.on('end', () => {
        // 在数据提交完成后，将post转为数组,并添加到data.json文件中
        readData((list) => {
            // 将提交的数据添加到list数组
            list.push(querystring.parse(post));

            callback(list);
        });
    });
}
function dateFormate(dateStr) {//时间格式化
    var date = new Date(dateStr);

    var y = date.getFullYear().toString().padStart(2, '0');
    var m = (date.getMonth()+1).toString().padStart(2, '0');
    var d = date.getDay().toString().padStart(2, '0');
    var hh = date.getHours().toString().padStart(2, '0');
    var mm = date.getMinutes().toString().padStart(2, '0');
    var ss = date.getSeconds().toString().padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`; 
}