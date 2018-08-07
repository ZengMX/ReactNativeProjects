
/**
 * 显示小数点，当value为null或undefined时显示defaultValue
 * fixedNumber 默认为2
 * defaultValue 默认为‘0.00’
 */
function toFixed(value, fixedNumber=2, defaultValue='0.00'){
	if(value == undefined || value == null){
		return defaultValue;
	}else{
		if(typeof value === 'number' && !isNaN(value)){
			return value.toFixed(fixedNumber);
		}else{
			return value;
		}
	}
}
exports.toFixed=toFixed;

