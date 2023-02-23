let _debounceTimeout = null,
	_throttleRunning = false
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms  
 */
export const throttle = (fn, delay = 500) => {
	if (_throttleRunning) {
		return;
	}
	_throttleRunning = true;
	fn();
	setTimeout(() => {
		_throttleRunning = false;
	}, delay);
}
/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms   
 */
export const debounce = (fn, delay = 500) => {
	clearTimeout(_debounceTimeout);
	_debounceTimeout = setTimeout(() => {
		fn();
	}, delay);
}
//简化的toast
export const toast = (title, duration = 3000, mask = false, icon = 'none') => {
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
export const hasLogin = (options = {}) => {
	const token = uni.getStorageSync('accessToken');
	if (token) {
		return true;
	}
	if (options.nav !== false) {
		uni.navigateTo({
			url: '/pages/user/auth/login'
		})
	}
	return false;
}
export const navTo = (url) => {
	console.log(url);
	uni.navigateTo({
		url
	})
}
export const navBack = function() {
	uni.navigateBack();
}
export const checkMobile = (val) => {
	return /^[1](([3][0-9])|([4][5,7,9])|([5][^4,6,9])|([6][6])|([7][3,5,6,7,8])|([8][0-9])|([9][8,9]))[0-9]{8}$/
		.test(val);
}
export const checkPassword = (val) => {
	return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/.test(val);
	//(?=.*[~@#$%\*-\+=:,\\?\[\]\{}]) 如果需要特殊字符加上
}
export const checkSmsCode = (val) => {
	return /^\d{6,6}$/.test(val);
}
export const checkEmail = (val) => {
	return /^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$/.test(val);
}
/**
 *将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export function formatDate(date, format) {
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
			k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return format;
}
export function formatMoney(money, currency) {
	let patt = new RegExp(/^¥(0+)([0-9]+(\.[0-9]{0,})?$)/);
	money = money.replace(patt, function($0, $1, $2) {
		return $2;
	});
	console.log("mon:" + money);
	patt = new RegExp(/^[1-9][0-9]*\.[0-9]{1}$|^0\.[0-9]{1}$/);
	if (patt.test(money)) money = money + '0';
	patt = new RegExp("^[1-9][0-9]*$|^0$");
	if (patt.test(money)) money = money + '.00';
	patt = new RegExp("^[1-9][0-9]*.$|^0.$");
	if (patt.test(money)) money = money + '00';
	switch (currency) {
		case "USD":
			return '$' + money;
			break;
		default:
			return '¥' + money;
	}
}
export function clone(data) {
	const type = typeof data
	let obj;
	if (type === 'array') {
		obj = [];
	} else if (type === 'object') {
		obj = {};
	} else {
		// 不再具有下一层次
		return data;
	}
	if (type === 'array') {
		for (let i = 0, len = data.length; i < len; i++) {
			obj.push(this.clone(data[i]));
		}
	} else if (type === 'object') {
		// 对原型上的方法也拷贝了....
		for (const key in data) {
			obj[key] = this.clone(data[key]);
		}
	}
	return obj;
}
export function getPropertyFromData(data, props, prop) {
	const config = props[prop];
	if (typeof config === 'function') {
		return config(data);
	} else if (typeof config === 'string') {
		return data[config];
	} else if (typeof config === 'undefined') {
		const dataProp = data[prop];
		return dataProp === undefined ? '' : dataProp;
	}
}
