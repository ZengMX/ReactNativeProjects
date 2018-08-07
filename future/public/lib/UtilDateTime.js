import _ from 'underscore';

exports.getLeftTimeString = function(leftTime){
	var dayStr = 0;
	var hourStr = 0;
	var minuteStr = 0;
	var secondStr = 0;
	if (leftTime <= 0 || !_.isNumber(leftTime)) {
		dayStr = 0;
		hourStr = 0;
		minuteStr = 0;
		secondStr = 0;
	}
	var hour1 = (leftTime - leftTime % 3600) / 3600;
	var day = (leftTime - leftTime % 86400) / 86400;
	dayStr = day;
	
	var hour = (leftTime - day * 86400);
	
	hour = (hour - hour % 3600) / 3600;
	hourStr = (hour < 10 ? "0" : "") + hour;
		
	var minute = (leftTime - hour1 * 3600);
	minute = (minute - minute % 60) / 60;
	minuteStr = (minute < 10 ? "0" : "") + minute;
		
	var second = Math.floor(leftTime % 60);
	secondStr = (second < 10 ? "0" : "") + second;
	var data = {
		dayStr : dayStr,
		hourStr : hourStr,
		minuteStr : minuteStr,
		secondStr : secondStr,
	};
	return data;
};