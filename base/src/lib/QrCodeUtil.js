// 解析二维码数据，打开对应的商品等

exports.decode = (data) => {
	if (object = getProduct(data)) {
		//{ productid: m[1] }
		return { action: 0, object };
	} else if (object = getShop(data)) {
		//{ orgId: getParm(data, "orgId") }
		return { action: 1, object };
	} else if (object = getFollow(data)) {
		//{ orgId: json.orgId }
		return { action: 2, object };
	} else if (object = getCoupon(data)) {
		//{ cardNo: json.cardNo, pwd: json.pwd }
		return { action: 3, object };
	} else {
		//未知类型
		return { action: -1, object: data };
	}
};

//产品
function getProduct(data) {
	if (isUrl(data) && has(data, "product-")) {
		var re = new RegExp("product-([0-9]*).html");
		var m = data.match(re);
		if (m && m.length > 0) {
			return { productid: m[1] };
		}
	}
	return null;
}
//同城送
function getShop(data) {
	if (isUrl(data) && (has(data, "sendShopDetail") || has(data, "/citysend/shopIndex.ac"))) {
		let orgId = getParm(data, "orgId");
		if (orgId != null) {
			return { orgId: orgId };
		}
	}
	return null;
}

//关注同城送店铺
function getFollow(data) {
	var json = parseJSON(data);
	if (json != null && json.type == 'follow') {
		return { orgId: json.orgId }
	}
	return null;
}
//优惠券
function getCoupon(data) {
	var json = parseJSON(data);
	if (json != null && json.type == 'addCoupon') {
		return { cardNo: json.cardNo, pwd: json.pwd }
	}
	return null;
}

function isUrl(data) {
	return /^[a-zA-z]+:\/\/[^\s]*$/.test(data);
}

function has(url, value) {
	return url.indexOf(value) != -1
}

function getParm(url, key) {
	var re = new RegExp("[\?\&]{0,1}" + key + "=([^&]*)(&|$)");
	var m = url.match(re);
	if (m && m.length > 0) {
		return m[1];
	}
	return null;
}

function parseJSON(data) {
	try {
		var jsonObject = JSON.parse(data);
		return jsonObject;
	} catch (ex) { }
	return null;
}