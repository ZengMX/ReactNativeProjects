exports.get = function (medicinalTypeCode, prescriptionTypeCode) {
	// private String medicinalTypeCode;//"0"--药品 1}">保健品 2}">医疗器械 3}">药妆 4}">其他
	// private String prescriptionTypeCode;//药品 处方 类型 编码 "0"-RX处方药 "1"-OTC甲类非处方药 "2"-OTC乙类非处方药
	if (medicinalTypeCode == "0") {
		if (prescriptionTypeCode == "0") return require("future/src/commons/res/000chufangyao_d.png");
		if (prescriptionTypeCode == "1") return require("future/src/commons/res/000yaojia_d.png");
		if (prescriptionTypeCode == "2") return require("future/src/commons/res/000yaoyi_d.png");
	} else {
		return null;
	}
};