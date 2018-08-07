
(function (self) {
	'use strict';
	if (self.NumberInit) {
		return
	}
	Object.assign(Number.prototype, {
		/** 
		 * 加法得到金额数据（保留精度问题） 
		 * 调用例子：let total = Number(0.09999999).add(0.09999999); 
		 * @param arg 
		 * @returns {String} 
		 */
		add(arg) {
			let r1, r2, m;
			try { r1 = this.toString().split(".")[1].length } catch (e) { r1 = 0 }
			try { r2 = arg.toString().split(".")[1].length } catch (e) { r2 = 0 }
			m = Math.pow(10, Math.max(r1, r2))

			let val = (this * m + arg * m) / m;
			m = val.toString();
			let num = m.split(".");
			if (num.length > 1) {
				let l = num[1];
				if (l.length < 2) {
					m = m + "0";
				}
			}
			return m;
		},

		/** 
		 * 减法得到金额数据（保留精度问题） 
		 * 调用例子：let total = Number(-0.09999999).sub(0.00000001); 
		 * @param arg 
		 * @returns {String} 
		 */
		sub(arg) {
			return this.add(-arg);
		},

		/** 
		* 乘法得到金额数据（保留精度问题） 
		* 调用例子：let total = Number(parseInt(num)).mul(parseFloat(dj)); 
		* @param arg 
		* @returns {String} 
		*/
		mul(arg) {
			let m = 0, s1 = this.toString(), s2 = arg.toString();
			try { m += s1.split(".")[1].length } catch (e) { }
			try { m += s2.split(".")[1].length } catch (e) { }
			let val = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
			m = val.toString();
			let num = m.split(".");
			if (num.length > 1) {
				let l = num[1];
				if (l.length < 2) {
					m = m + "0";
				}
			}
			return m;
		},

		/** 
		 * 除法得到金额数据（保留精度问题） 
		 * 调用例子：let total = Number(0.000001).div(0.00000001); 
		 * @param arg 
		 * @returns {String} 
		 */
		div(arg) {
			let t1 = 0, t2 = 0, r1, r2;
			try { t1 = this.toString().split(".")[1].length } catch (e) { }
			try { t2 = arg.toString().split(".")[1].length } catch (e) { }
			r1 = Number(this.toString().replace(".", ""))
			r2 = Number(arg.toString().replace(".", ""))
			return (r1 / r2) * Math.pow(10, t2 - t1);
		},

		/** 
		* 格式化金额 
		* 调用例子：
		* @param  
		* @returns {String} 
		*/
		formatMoney() {
			let m;
			try { m = this.toString(); } catch (e) { m = 0 }
			let num = m.split(".");
			if (num.length == 1) {
				m += ".00";
			} else if (num.length > 1) {
				let l = num[1];
				if (l.length < 2) {
					m += "0";
				}
			}
			return m;
		}
	});
	self.NumberInit = true;
})(typeof self !== 'undefined' ? self : this);