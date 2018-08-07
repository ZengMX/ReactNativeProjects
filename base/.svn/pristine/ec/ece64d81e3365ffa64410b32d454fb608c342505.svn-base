/**
 处理网络图片
 使用示例
 import { imageUtil } from 'future/src/lib';
 1.get用于处理网络图片返回失败问题
  当ImageUrl出错时，返回一个替代图片
  <Image source={imageUtil.get(ImageUrl)} />
 2.replaceSpec替换图片大小
 如：imageUtil.replaceSpec('nopic_200x200.png', '320X320')
 返回：'nopic_320X320.png'
 */
import _ from 'underscore';
import { Dimensions, PixelRatio } from 'react-native';
const dimensW = Dimensions.get('window').width;
const dimensH = Dimensions.get('window').height;

let get = function (image, spec = '200x200') {
	if (!_.isString(image) || image.trim().length == 0 || image.indexOf("noPic") != -1) {
		let nopic = null;
		switch (spec) {
			case '200x200':
				nopic = require('future/src/commons/res/nopic_200x200.png');
				break;
			case '120x120':
				nopic = require('future/src/commons/res/nopic_120x120.png');
				break;
			default:
				nopic = require('future/src/commons/res/nopic_200x200.png');
				break;
		}
		return nopic;
	} else {
		return { uri: image };
	}
	//返回 require  或者  {uri:image}对象
};

let replaceSpec = function (image, spec) {
	var strs = image.match(/_(\d+X\d+).\S+$/);
	if (strs && strs.length > 1) {
		return image.replace(strs[1], spec);
	} else {
		return image;
	}
};

/*
基于屏幕计算
*/
let realViewHeight = function getRealViewHeight(height) {//根据控件在iphone5所占的百分比计算出实际控件的高度 参数就是设计图的除2
	return dimensH * height / 568.0;
}
/*
基于图片计算
*/
let realWidth = function getRealWidth(width) {//根据控件在iphone5所占的百分比计算出控件显示的实际宽度 参数就是设计图的除2
	return dimensW / 320.0 * width;
}
let realHeight = function getRealHeight(width, height) {//参数就是设计图的除2
	return dimensW / 320.0 * height;//根据图片自身宽高比计算出实际的高度
}

const methods = {
	get get() { return get },
	get replaceSpec() { return replaceSpec },
	get realWidth() { return realWidth; },
	get realHeight() { return realHeight; },
	get realViewHeight() { return realViewHeight; },
	get rW() { return realWidth; },
	get rH() { return realHeight; },
	get rHV() { return realViewHeight; },
}
module.exports = methods;