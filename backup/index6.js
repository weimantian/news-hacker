// 当前项目（包）的入口文件
//增加index.html页面的渲染
//封装读取文件操作，使用回调函数处理读取的文件数据
// 1. 加载http模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url')
const querystring = require('querystring');
const _ = require('underscore');

// 2. 创建服务
http.createServer().on('request', function(req, res) {
    // 代码部分
    //将render函数挂载到res对象上, templateData为要替换的模板数据
    res.render = function(filename, templateData) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                throw err;
            }
            if (templateData) {
                // 如果传递了模板数据，表示要进行模板替换
                var fn = _.template(data.toString('utf-8'));
                data = fn(templateData);
            }
            res.setHeader('Content-Type', mime.getType(filename));
            res.end(data);

        });
    }

    var urlObj = url.parse(req.url, true);

    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();
    // 设计路由
    // 当用户请求 / 或 /index 时，显示新闻列表 - get 请求
    // 当用户请求 /deatil 时显示新闻详情 - get 请求
    // 当用户请求 /submit 时，显示添加新闻页面 - get 请求
    // 当用户请求 /add 时,将用户提交的新闻保存到 data.json - get 请求
    // 当用户请求 /add 时,将用户提交的新闻保存到 data.json - post 请求
    // 将用户请求的url 和 method 装换为小写字母 

    // 先根据用户提交的路由，显示不同的HTML页面
    if (req.url === '/' || req.url === '/index') {
        // 1. 读取data.json文件，并将读取到的数据转换为list[]
        readData(function(list) {
            // 2. 在服务器端使用underscore模板引擎渲染页面
            res.render(path.join(__dirname, 'htmls', 'index.html'), { item: list });
        });
    } else if (req.url === '/submit') {
        // 1. 读取 submit.html 并返回
        res.render(path.join(__dirname, 'htmls', 'submit.html'));
    } else if (req.url.startsWith('/detail')) {

        // 读取data.json的数据

        readData(function(list) {
            // 获取新闻 id
            var id = urlObj.query.id;
            //使用render函数进行渲染
            res.render(path.join(__dirname, 'htmls', 'detail.html'), { item: list[id] });
        });
    } else if (req.url.startsWith('/add') && req.method === 'get') {
        // get 方式提交一条新闻
        // 1. 获取data.json的数据，并将读取的数据转换位一个数组
        readData((list) => {
            list.push(urlObj.query);

            // 2. 将数据添加到data.json文件中
            writeData(JSON.stringify(list), () => {
                res.statusCode = 302;
                res.statusMessage = 'Found';
                // 跳转，重定向
                res.setHeader('location', '/');
                res.end();
            })
        });

    } else if (req.url === '/add' && req.method === 'post') {
        // 1. 表示 post 方式提交一条新闻
        // post 数据一般比较大，浏览器会分次提交

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

    } else if (req.url.indexOf('/public') === 0) {
        // 加载静态资源
        res.render(path.join(__dirname, req.url));

    } else {
        res.writeHeader(404, 'Not Found', {
            'Content-Type': 'text/plain; charset = utf-8'
        });
        res.end('404,Page Not Found');
    }
}).listen(3000, function() {
    console.log('http://localhost:3000');
});

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