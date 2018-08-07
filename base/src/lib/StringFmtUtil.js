import _ from 'underscore';

//返回格式化后的手机号。例：138 0013 8000
exports.fmtPhoneNum = function (phoneNum) {
	return _.isString(phoneNum) ? (phoneNum.replace(/\s/g, '').substring(0, 11).replace(/(\d{3})(?=\d)(\d{4})?(?=\d)(\d{4})?/g, "$1 $2 $3")) : '';

	// if (_.isString(phoneNum)) {
	// 	let phoneStr = phoneNum.replace(/\s+/g, "");
	// 	return (phoneStr.substring(0, 3) + ' ' + phoneStr.substring(3, 7) + ' ' + phoneStr.substring(7, 11)).trim();
	// } else {
	// 	return '';
	// }
}

//返回格式化后的银行卡号。例：6228 4804 0256 4890 018
exports.fmtBankCard = function (cardNum) {
	return _.isString(cardNum) ? (cardNum.replace(/\s/g, '').substring(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ")) : '';
}