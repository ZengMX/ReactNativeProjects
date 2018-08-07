/**
 * 参考
 * http://stackoverflow.com/questions/30257915/extend-a-string-class-in-es6
 */
(function (self) {
	'use strict';
	if (self.StringInit) {
		return
	}
	/** 
	* 移除字符串中的空格 
	* 调用例子：let str = ' vaaaa cc '.trims() 
	* @param arg 
	* @returns {String} 
	*/
	Object.assign(String.prototype, {
		trims() {
			let text;
			try { text = this.replace(/\s/g, ''); } catch (e) { text = ''; }
			return (text);
		}
	});
	self.StringInit = true;
})(typeof self !== 'undefined' ? self : this);
