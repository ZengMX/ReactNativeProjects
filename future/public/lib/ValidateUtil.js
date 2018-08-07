import _ from 'underscore';

//判断是否空字符串
function isBlank(object) {
	if (_.isNaN(object) || _.isNull(object) || _.isUndefined(object)) {
		return false;
	} else if (_.isString(object)) {
		object = object.replace(/(^\s*)|(\s*$)/g, '');
		return (object.length > 0 ? false : true);
	}
	return false;
}

//判断是否为空或者空串
function isNull(object) {
	if (_.isNull(object) || _.isUndefined(object)) {
		return true;
	} else if (_.isString(object)) {
		object = object.replace(/(^\s*)|(\s*$)/g, '');
		return (object.length > 0 ? false : true);
	}
	return false;
}

//判断是否包含中文字符
function hasChineseChar(char) {
	if (isBlank(char)) return false;

	var re = /[\u4e00-\u9fa5]/;
	return re.test(char);
}

//是否整数数输入
function isNumberInput(object) {
	if (isBlank(object)) return false;
	return /^-?$/.test(object);
}

//是否整数
function isNumber(object) {
	if (isBlank(object)) return false;
	return /^-?[1-9]\d*$/.test(object);
}

//是否正整数
function isPositiveNum(object) {
	if (isBlank(object)) return false;
	return /^[1-9]\d*$/.test(object);
}

//是否负整数
function isNegativeNum(object) {
	if (isBlank(object)) return false;
	return /^-[1-9]\d*$/.test(object);
}

//是否正浮点数
function isPositiveFloat(object) {
	if (isBlank(object)) return false;
	return /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(object);
}

//是否负浮点数
function isNegativeFloat(object) {
	if (isBlank(object)) return false;
	return /^-[1-9]\d*\.\d*|-0\.\d*[1-9]\d*$/.test(object);
}

//判断邮箱格式是否正确
function isEmail(eamil) {
	if (isBlank(eamil)) return false;
	var re = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
	return re.test(eamil);
}

//手机号
function isPhone(phone) {
	if (isBlank(phone)) return false;
	return /^0?(13|14|15|17|18)[0-9]{9}$/.test(phone);
}

//固定电话
function isTel(tel) {
	if (isBlank(tel)) return false;
	return /^[0-9-()（）]{7,18}$/.test(tel);
}

//身份证验证
function isIDCard(object) {
	if (isBlank(object)) return false;
	return /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(object);
}

//判断银行卡格式
function isBankCart(bankAccount) {
  if (isBlank(bankAccount)) {
    return false;
  }
  var tmp = true,
      total = 0;
  for (var i = bankAccount.length; i > 0; i--) {
    var num = bankAccount.substring(i, i - 1);
    if ( tmp = !tmp, tmp)
      num = num * 2;
    var gw = num % 10;
    total += (gw + (num - gw) / 10);
  }
  return total % 10 == 0;
}
//数字保留两位小数，如果是.00则删除
function fixPrecision(value){
  if(typeof value =='string'){
    value=parseFloat(value);
  }
  return ((value).toFixed(2)).replace(/(\.00$|0$)/,'');
}

//数字前补0
function prefixInteger(num, length) { 
  return (Array(length).join('0') + num).slice(-length);
}

//不可拆分时对输入数量进行处理
function fixedNum(num, midPackTotal) {
	var num1 = (num / midPackTotal).toFixed(1);
	var multiplier = num1.substring(0, num1.length - 2);
	var result = 0;
	if (num >= midPackTotal && ((num % midPackTotal) == 0)) {
		result = multiplier * midPackTotal;
	} else if ((num > 0 && num < midPackTotal) || (num > midPackTotal && ((num / midPackTotal) != 0))) {
		result = multiplier * midPackTotal + midPackTotal;
	}
	console.log("处理后结果----->" + result);
	return result;
}

//检查 true 和 false
function  isTrue(value) {
	if (isNull(value)){
		return false;
	}else if (value==='Y') {
		return true;
	}else {
		return false;
	}
}

//检出空字符串和字符串
function  isEmptyStr(value) {
	if (isNull(value)){
		return '';
	}else {
		return value;
	}
}

exports.isNull = isNull;
exports.isBlank = isBlank;
exports.hasChineseChar = hasChineseChar;
exports.isNumber = isNumber;
exports.isNumberInput = isNumberInput;
exports.isPositiveNum = isPositiveNum;
exports.isNegativeNum = isNegativeNum;
exports.isPositiveFloat = isPositiveFloat;
exports.isNegativeFloat = isNegativeFloat;

exports.isEmail = isEmail;
exports.isPhone = isPhone;
exports.isTel = isTel;
exports.isIDCard = isIDCard;
exports.isBankCart = isBankCart;
exports.fixPrecision = fixPrecision;
exports.prefixInteger = prefixInteger;
exports.fixedNum = fixedNum;
exports.isTrue = isTrue;
exports.isEmptyStr = isEmptyStr;