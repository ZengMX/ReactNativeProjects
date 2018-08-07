
module.exports = {
	get Fetch() { return require('./Fetch').default; },              //网络请求
	get ConvertUtil() { return require('./ConvertUtil'); },          //显示小数点
	get Uploader() { return require('./Uploader').default; },        //上传文件
	get ImallCookies() { return require('./ImallCookies').default; },//
	get Cookie() {return require('./Cookie')},
	get Storage() {return require('./Storage').default;},            //数据持久化
	get PureRender() {return require('./PureRender')},              
	get UtilDateTime() {return require('./UtilDateTime')},           //把日期编程时分秒
	get Navigation() {return require('./navigator')},                //导航
	get ValidateUtil() {return require('./ValidateUtil')},           //正则表达式
	get Themes() {return require('./Themes')},                       //样式
	get imageUtil() {return require('./imageUtil')},                       //样式
};
