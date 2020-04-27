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

    } else if (req.pathname === '/denlu' && req.method === 'post') {

        handler.denlu(req, res);
        
    } else if(req.pathname === '/addcmm') {

        handler.addcmm(req, res);
    } else {

    	handler.errorPage(res);

    }

}
