/**
 接收leftTime秒数
 返回对象：
{
  dayStr: dayStr, //0，正整数
  hourStr: hourStr, // '00' - '23'
  minuteStr: minuteStr, // '00' - '59'
  secondStr: secondStr, // '00' - '59'
}
 */

import _ from 'underscore';

exports.getLeftTimeString = function (leftTime) {
	let dayStr = 0;
	let hourStr = 0;
	let minuteStr = 0;
	let secondStr = 0;
	leftTime = parseInt(leftTime);
	if (_.isNumber(leftTime) && leftTime > 0) {
		let hour1 = (leftTime - leftTime % 3600) / 3600;
		let day = (leftTime - leftTime % 86400) / 86400;
		dayStr = day;

		let hour = (leftTime - day * 86400);

		hour = (hour - hour % 3600) / 3600;
		hourStr = (hour < 10 ? "0" : "") + hour;

		let minute = (leftTime - hour1 * 3600);
		minute = (minute - minute % 60) / 60;
		minuteStr = (minute < 10 ? "0" : "") + minute;

		let second = leftTime % 60;
		secondStr = (second < 10 ? "0" : "") + second;
	}
	let data = {
		dayStr: dayStr.toString(),
		hourStr: hourStr.toString(),
		minuteStr: minuteStr.toString(),
		secondStr: secondStr.toString(),
	};
	return data;
};