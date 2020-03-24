// 当前项目（包）的入口文件

// 1. 加载http模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url')
const querystring = require('querystring')
// 2. 创建服务
http.createServer().on('request', function(req, res) {
    // 代码部分
    //将render函数挂载到res对象上 
    res.render = function(filename) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                throw err;
            } else {
                res.setHeader('Content-Type', mime.getType(filename));
                res.end(data);
            }
        });
    }

    var urlObj = url.parse(req.url, true);
    // console.log(urlObj);
    // console.log(urlObj.query.title);
    // console.log(urlObj.query.url);
    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();
    // 设计路由
    // 当用户请求 / 或 /index 时，显示新闻列表 - get 请求
    // 当用户请求 /deatil 时显示新闻详情 - get 请求
    // 当用户请求 /submit 时，显示添加新闻页面 - get 请求
    // 当用户请求 /add 时,将用户提交的新闻保存到 data.json - get 请求
    // 当用户请求 /add 时,将用户提交的新闻保存到 data.json - post 请求
    // 将用户请求的url 和 method 装换为小写字母 
    // req.url = req.url.toLowerCase();
    // req.url = req.method.toLowerCase();
    // // console.log(req.url)

    // 先根据用户提交的路由，显示不同的HTML页面
    // console.log(req.url)
    if (req.url === '/' || req.url === '/index') {
        // 1. 读取 index.html 并返回
        res.render(path.join(__dirname, 'htmls', 'index.html'));
    } else if (req.url === '/submit') {
        // 1. 读取 submit.html 并返回
        res.render(path.join(__dirname, 'htmls', 'submit.html'));
    } else if (req.url === '/detail') {
        // 1. 读取 detail;html 并返回
        res.render(path.join(__dirname, 'htmls', 'detail.html'));
    } else if (req.url.startsWith('/add') && req.method === 'get') {
        // get 方式提交一条新闻
        // res.end('over');
        // 1. 获取data.json的数据，并将读取的数据转换位一个数组
        // var title = urlObj.query.title;
        // var url = urlObj.query.url;
        // var text = urlObj.query.content;
        // 使用utf-8编码，data数据直接就是一个字符串
        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', (err, data) => {
            // err.code != 'ENOENT',不是文件不存在错误
            if (err && err.code != 'ENOENT') {
                throw err;
            }
            //将data字符串解析为list数组
            var list = JSON.parse(data || '[]');
            list.push(urlObj.query);

            // 2. 将数据添加到data.json文件中
            fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), (err) => {
                if (err) {
                    throw err;
                }

                console.log('ok')
                // 3. 跳转到index.html页面
                // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
                // 3.1 以3开头的状态码为跳转状态码
                res.statusCode = 302;
                res.statusMessage = 'Found';
                // 跳转，重定向
                res.setHeader('location', '/');
                res.end();
            });
        })

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
            fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', (err, data) => {
                // err.code != 'ENOENT',不是文件不存在错误
                if (err && err.code != 'ENOENT') {
                    throw err;
                }
                var list = JSON.parse(data || '[]');

                // post='title=2&url=2&content=2'
                console.log(post);
                list.push(querystring.parse(post));
                // 将数据添加到data.json文件中
                fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log('ok')
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