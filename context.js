//模块2（扩展模块）：负责扩展 req 和 res 对象，为 req 和 res 提供更方便的API
const url = require('url');
const mime = require('mime');
const fs = require('fs');
const _ = require('underscore');

module.exports = function(req, res) {
	// 1. 为 req 增加一个 query 属性，该属性保存的就是用户 get  请求提交的数据
	// -- req.query
    var urlObj = url.parse(req.url.toLowerCase(), true);
    req.query = urlObj.query;

    // 2. 为 req 增加 pathname属性
    // -- req.pathname
    req.pathname = urlObj.pathname;

    // 3. 将 req.method 转换为小写 
    req.method = req.method.toLowerCase();

	// 4. 为 res 增加一个 render 方法，进行数据加载及模板渲染
	res.render = function(filename, templateData) {
        fs.readFile(filename, function(err, data) {
            if (err && err.code !== "ENOENT") {
                
                throw err;
            }
            if (templateData) {
                // 如果传递了模板数据，表示要进行模板替换
                var fn = _.template(data.toString('utf-8'));
                data = fn(templateData);
            } else {
                //解决跨域问题
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
                res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            }
            res.setHeader('Content-Type', mime.getType(filename));
            res.end(data);

        });
    }
}