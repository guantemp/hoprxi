export default {
	units: ["双", "只", "个", "提", "盒", "本", "支", "瓶", "包", "袋", "套", "对", "件", "把", "500g", "条", "台", "罐", "打", "公斤", "箱",
		"卷", "挂", "束", "串", "册", "组", "节", "桶", "碗", "棵", "份"
	],
	grades: ['优等品', '一等品', '合格品', '不合格品'],
	category: [{
		id: "-99",
		name: "未定义",
	}, {
		id: '1',
		name: "生鲜",
		sub: [{
			id: "211",
			name: "水产",
			sub: [{
				id: "dsy",
				name: "淡水鱼"
			}, {
				id: "bl",
				name: "贝类"
			}, {
				id: "hsy",
				name: "海水鱼"
			}, {
				id: "qtscp",
				name: "其他水产品"
			}]
		}, {
			id: "2134",
			name: "肉类",
			sub: [{
				id: "754",
				name: "畜肉",
				sub: [{
					id: "23467",
					name: "猪肉",
				}, {
					id: "324",
					name: "牛肉",
				}, {
					id: "3241",
					name: "羊肉",
				}, {
					id: "3242",
					name: "兔肉",
				}]
			}, {
				id: "1234",
				name: "禽肉",
				sub: [{
					id: "12341",
					name: "鸡",
				}, {
					id: "12342",
					name: "鸭",
				}, {
					id: "12349",
					name: "鸽子",
				}, ]
			}, {
				id: "asfes",
				name: "禽副",
			}]
		}, {
			id: "98874",
			name: "水果",
			sub: [{
				id: "jg",
				name: "浆果"
			}, {
				id: "gj",
				name: "柑橘"
			}, ]
		}, {
			id: "9874",
			name: "蔬菜",
			sub: [{
				id: "syj",
				name: "食用菌"
			}, {
				id: "yc",
				name: "叶菜"
			}]
		}, {
			id: "987",
			name: "熟食"
		}]
	}, {
		id: "9832546898",
		name: "粮油",
		selector: "single",
		sub: [{
			id: "3446",
			name: "食用油啊啊啊",
			sub: [{
				id: "231532",
				name: "菜籽油",
				sub: [{
					id: "2315321",
					name: "低阶酸酸"
				}, {
					id: "2315322",
					name: "高阶酸酸"
				}, {
					id: "2315323",
					name: "不高不矮酸"
				}, {
					id: "2315324",
					name: "好啊好啊酸整的好酸"
				}, {
					id: "2315325",
					name: "还是我"
				}]
			}, {
				id: "1532",
				name: "大豆油"
			}, {
				id: "s1532",
				name: "花生油"
			}, {
				id: "s1534632",
				name: "玉米油"
			}, {
				id: "2332",
				name: "橄榄油",
				sub: [{
					id: "23321",
					name: "希腊的"
				}, {
					id: "23322",
					name: "不清楚产地"
				}]
			}, {
				id: "312",
				name: "葵花籽油"
			}, {
				id: "e25423",
				name: "调和油"
			}, {
				id: "2r5423",
				name: "调味油",
				sub: [{
					id: "2r54231",
					name: "藤椒油"
				}, {
					id: "2r54232",
					name: "小磨香油"
				}]
			}]
		}, {
			id: "898er956",
			name: "粮食",
			sub: [{
				id: "898er9562",
				name: "谷类"
			}, {
				id: "a235423",
				name: "面粉"
			}, {
				id: "a2354231",
				name: "杂粮"
			}, ]
		}, {
			id: "3",
			name: "调味品",
			sub: [{
				id: "t436534",
				name: "酱油",
				sub: [{
					id: "t436535",
					name: "老抽",
				}, {
					id: "t436536",
					name: "生抽",
				}]
			}, {
				id: "t46534",
				name: "醋"
			}, {
				id: "t4534",
				name: "盐"
			}, {
				id: "t453gyk4",
				name: "调味汁"
			}, {
				id: "65898956",
				name: "调味料（酱汁）",
			}]
		}, {
			id: "65898956",
			name: "调味料",
			sub: [{
				id: "335r23325",
				name: "香料"
			}, {
				id: "b235423",
				name: "香草"
			}, ]
		}, {
			id: "242678",
			name: "制品",
			sub: [{
				id: "335r23",
				name: "面包蛋糕"
			}, {
				id: "b235423",
				name: "方便面"
			}, {
				id: "c235423",
				name: "挂面"
			}, {
				id: "06543",
				name: "豆制品"
			}, {
				id: "a25423",
				name: "饼干"
			}]
		}]
	}, {
		id: "8",
		name: "五金家电",
		sub: [{
			id: "24323465345",
			name: "小家电",
		}, {
			id: "x243235",
			name: "小五金",
		}]
	}, {
		id: "4r",
		name: "日化",
		selector: "multi",
		sub: [{
			id: "41",
			name: "纸品",
			sub: [{
				id: "411",
				name: "抽纸",
			}]
		}, {
			id: "42",
			name: "清洁用品",
			sub: [{
				id: "421",
				name: "牙膏牙刷",
			}, {
				id: "422",
				name: "洗发水我好长的你装不下",
			}, {
				id: "423",
				name: "香皂",
			}, {
				id: "424",
				name: "沐浴露",
			}]
		}, {
			id: "43",
			name: "杀虫芳香"
		}]
	}, {
		id: "9",
		name: "针织服饰"
	}, {
		id: "10",
		name: "家居百货"
	}, {
		id: "5",
		name: "文(具)玩(具)"
	}, {
		id: "6",
		name: "烟酒",
		sub: [{
			id: "61",
			name: "香烟"
		}, {
			id: "62",
			name: "酒类",
			sub: [{
				id: "621",
				name: "白酒"
			}, {
				id: "622",
				name: "啤酒",
			}, {
				id: "623",
				name: "葡萄酒"
			}, {
				id: "624",
				name: "黄酒"
			}, {
				id: "625",
				name: "果露酒"
			}]
		}]
	}, {
		id: "7",
		name: "散点"
	}, {
		id: "A1323",
		name: "药品"
	}],
	catalog: [{
		id: "201451060435585024",
		name: {
			name: "彩虹柠檬香电热灭蚊香液",
			mnemonic: "chlmxdrmwxy",
			alias: "彩虹电热灭蚊香液"
		},
		barcode: 6907861191394,
		specs: '150ml',
		placeOfOrigin: '四川省.成都市',
		grade: '合格品',
		shelfLife: "180天",
		category: {
			id: "224",
			name: "杀虫芳香"
		},
		retailPrice: '19.59/盒',
		memberPrice: '18.00/盒',
		vipPrice: '0.00/盒',
		vip: {
			referenceSalePrice: '19.00/瓶',
			referencePurchasePrice: '12.60/瓶'
		},
		storage: {
			lastPurchasePrice: '13.00/瓶',
			amount: 226,
			number: 12,
			stockTurn: 1.33
		},
		promotion: {
			title: '5.1节会员促销',
			price: '1450.00/公斤',
			startDate: "2021-05-06 00:00:00",
			endDate: "2021-05-07 23:59:59",
			explain: '厂家回馈用户，只限于本店PLUS会员用户'
		},
	}, {
		plu: 133,
		name: {
			name: "广西沃柑",
			mnemonic: "chlmxdrmwxy",
			alias: "沃柑"
		},
		specs: '500g',
		placeOfOrigin: '广西壮族自治区.桂林市',
		grade: '优等品',
		category: {
			id: "98874",
			name: "水果"
		},
		shelfLife: "3天",
		retailPrice: '4.59/500g',
		memberPrice: '4.00/500g',
		vipPrice: '2.50/500g',
		vip: {
			referenceSalePrice: '3.99/500g',
			referencePurchasePrice: '1.99/500g'
		},
		storage: {
			lastPurchasePrice: '1.786/500g',
			amount: 22.36,
			number: 10.58,
			stockTurn: 22.756
		},
	}, {
		id: '201452393217567744',
		name: {
			name: "娃哈哈营养快线水果牛奶饮品（菠萝味）",
			mnemonic: "chlmxdrmwxy",
			alias: "营养快线"
		},
		barcode: 6902083898625,
		specs: '550ml',
		placeOfOrigin: '浙江省.杭州市',
		grade: '合格品',
		category: {
			id: '-99',
			name: "未定义",
		},
		retailPrice: '11.98/瓶',
		memberPrice: '10.98/瓶',
		vipPrice: '4.98/瓶',
		vip: {
			referenceSalePrice: '12.00/瓶',
			referencePurchasePrice: '6.98/瓶'
		},
		storage: {
			lastPurchasePrice: '5.9875/瓶',
			amount: 420,
			number: 70,
			stockTurn: 10.25
		},
	}, {
		id: '201452853459475457',
		name: {
			name: "川骄无芯卷纸（白四层）",
			mnemonic: "chlmxdrmwxy",
			alias: "川骄卷纸"
		},
		barcode: 6970981171003,
		specs: '1800g',
		category: {
			id: "234",
			name: "纸品"
		},
		storage: {
			lastPurchasePrice: '7.98/提',
			amount: 420,
			number: 70,
			stockTurn: 10.25
		},
		placeOfOrigin: '四川省.成都市',
		grade: '合格品',
		retailPrice: '11.98/提',
		memberPrice: '0.00/提',
		vipPrice: '0.00/提',
	}, {
		id: '201452966564125697',
		name: {
			"name": "云南三七牙膏（清新留兰）",
			"mnemonic": "chlmxdrmwxy",
			"alias": "云南三七牙膏（清新留兰）"
		},
		barcode: 6953067200880,
		specs: '220g',
		category: {
			id: "24325",
			name: "牙膏牙刷",
		},
		placeOfOrigin: '云南省.昆明市',
		grade: '合格品',
		retailPrice: '34.88/支',
		memberPrice: '32.88/支',
		vipPrice: '0.00/支',
		vip: {
			referenceSalePrice: '32.88/支',
			referencePurchasePrice: '29.88/支',
		},
		storage: {
			lastPurchasePrice: '27.98/支',
			amount: 25,
			number: 70,
			stockTurn: 11.25
		},
	}, {
		plu: 123,
		name: {
			"name": "红苋菜",
			"mnemonic": "chlmxdrmwxy",
			"alias": "红苋菜"
		},
		specs: '500g',
		placeOfOrigin: '江阳区',
		grade: '一级品',
		category_id: "98874",
		shelfLife: "0天",
		retailPrice: '0.99/500g',
		memberPrice: '0.95/500g',
		vipPrice: '0.85/500g',
		vip: {
			referenceSalePrice: '1.59/500g',
			referencePurchasePrice: '0.59/500g'
		},
		storage: {
			lastPurchasePrice: '0.652/500g',
			amount: 3.578,
			number: 6.587,
			stockTurn: 12.24
		},
	}, {
		id: '201452966564158972',
		name: {
			"name": "菊品郁金银屑片",
			"mnemonic": "chlmxdrmwxy",
			"alias": "菊品郁金银屑片"
		},
		barcode: 6926094418474,
		specs: '100片',
		category: {
			id: "A1323",
			name: "药品"
		},
		placeOfOrigin: '陕西省.商洛市',
		grade: '合格品',
		vip: {
			referenceSalePrice: '45.25/瓶',
			referencePurchasePrice: '23.3333/瓶'
		},
		storage: {
			lastPurchasePrice: '22.47/瓶',
			amount: 240.23,
			number: 12,
			stockTurn: 7.33
		},
		retailPrice: '49.98/支',
		memberPrice: '38.88/支',
		vipPrice: '35.00/瓶',
	}, {
		id: '201452966564158973',
		name: {
			"name": "阿维A胶囊",
			"mnemonic": "chlmxdrmwxy",
			"alias": "阿维A胶囊"
		},
		barcode: '6920327600247',
		specs: '10粒/板*3板',
		placeOfOrigin: '重庆市',
		grade: '合格品',
		category: {
			id: '-99',
			name: "未定义",
		},
		vip: {
			referenceSalePrice: '20.30/盒',
			referencePurchasePrice: '12.45/盒'
		},
		storage: {
			lastPurchasePrice: '11.11/盒',
			amount: 14.43,
			number: 1,
			stockTurn: 0.33
		},
		retailPrice: '19.80/盒',
		memberPrice: '18.80/盒',
		vipPrice: '0.00/盒',
	}, {
		id: '201452966564158974',
		name: {
			"name": "阿莫西林胶囊",
			"mnemonic": "chlmxdrmwxy",
			"alias": "阿莫西林胶囊"
		},
		barcode: 6931435340314,
		specs: '0.25g*50粒',
		placeOfOrigin: '黑龙江.哈尔滨市',
		grade: '合格品',
		category: {
			id: '-99',
			name: "未定义",
		},
		vip: {
			referenceSalePrice: '20.30/盒',
			referencePurchasePrice: '12.45/盒'
		},
		storage: {
			lastPurchasePrice: '11.11/盒',
			amount: 14.43,
			number: 1,
			stockTurn: 0.33
		},
		retailPrice: '9.80/盒',
		memberPrice: '8.80/盒',
		vipPrice: '0.00/盒',
	}, {
		id: '201452564158974',
		name: {
			"name": "伊利金典有机纯牛奶",
			"mnemonic": "chlmxdrmwxy",
			"alias": "伊利金典有机纯牛奶"
		},
		barcode: 6907992508191,
		specs: '250ml',
		placeOfOrigin: '内蒙古.呼和浩特市',
		grade: '合格品',
		category: {
			id: '-99',
			name: "未定义",
		},
		vip: {
			referenceSalePrice: '5.30/盒',
			referencePurchasePrice: '4.852/盒'
		},
		storage: {
			lastPurchasePrice: '4.785/盒',
			amount: 180,
			number: 36,
			stockTurn: 21.98
		},
		retailPrice: '5.29/盒',
		memberPrice: '0.00/盒',
		vipPrice: '4.98/盒',
	}]
}
