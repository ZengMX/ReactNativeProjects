/**
 * Created by timhuo on 2017/6/1.
 */
'use strict';

import {
	Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

function sizeToFit(height) {
	 let realyHeight = screenWidth/320*height;
	 return realyHeight;
}

function isEmpty(str) {
	if (str===null){
		return true;
	}else if (str.length===0){
		return true;
	}else {
		return false
	}
}

exports.sizeToFit = sizeToFit;
exports.isEmpty = isEmpty;