import _ from 'underscore';
import ValidateUtil from './ValidateUtil';

exports.get = function (image, spec = '200x200') {
	if (ValidateUtil.isNull(image) || ValidateUtil.isBlank(image) || image.indexOf("noPic") != -1) {
		let nopic = null;
		switch (spec) {
			case '200x200':
				nopic = require('future/public/commons/res/nopic_200x200.png');
				break;
			case '120x120':
				nopic = require('future/public/commons/res/nopic_120x120.png');
				break;
			default:
				nopic = require('future/public/commons/res/nopic_200x200.png');
				break;
		}
		return nopic;
	} else {
		return { uri: image };
	}
	//返回 require  或者  {uri:image}对象
};

exports.replaceSpec = function (image, spec) {
	var strs = image.match(/_(\d+X\d+).\S+$/);
	if (strs && strs.length > 1) {
		return image.replace(strs[1], spec);
	} else {
		return image;
	}
};
