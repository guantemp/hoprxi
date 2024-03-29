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
		children: [{
			id: "211",
			name: "水产",
			children: [{
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
			children: [{
				id: "754",
				name: "畜肉",
				children: [{
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
				children: [{
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
			children: [{
				id: "jg",
				name: "浆果"
			}, {
				id: "gj",
				name: "柑橘"
			}, ]
		}, {
			id: "9874",
			name: "蔬菜",
			children: [{
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
		children: [{
			id: "3446",
			name: "食用油啊啊啊",
			children: [{
				id: "231532",
				name: "菜籽油",
				children: [{
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
				children: [{
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
				children: [{
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
			children: [{
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
			children: [{
				id: "t436534",
				name: "酱油",
				children: [{
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
				id: "hjlkhj",
				name: "调味料（酱汁）",
			}]
		}, {
			id: "65898956",
			name: "调味料",
			children: [{
				id: "ewtrew",
				name: "香料"
			}, {
				id: "tyuty",
				name: "香草"
			}, ]
		}, {
			id: "242678",
			name: "制品",
			children: [{
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
		children: [{
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
		children: [{
			id: "41",
			name: "纸品",
			children: [{
				id: "411",
				name: "抽纸",
			}]
		}, {
			id: "42",
			name: "清洁用品",
			children: [{
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
		expand:true,
		children: [{
			id: "61",
			name: "香烟"
		}, {
			id: "62",
			name: "酒类",
			children: [{
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
		id: '52496163982907400',
		name: {
			name: "彩虹柠檬香电热灭蚊香液",
			mnemonic: "chlmxdrmwxy",
			alias: "彩虹电热灭蚊香液"
		},
		images: ["https://gd4.alicdn.com/imgextra/i3/478986120/O1CN01d9KJwK1v50WLzCYx3_!!478986120.jpg",
			"https://gw.alicdn.com/imgextra/i1/761145626/O1CN01eY7pud1rQl0Z0FWQQ_!!761145626.jpg_Q75.jpg_.webp"
		],
		barcode: 6907861191394,
		spec: '150ml',
		madeIn: {
			code: 510100,
			name: '成都市'
		},
		grade: '一等品',
		shelfLife: "180天",
		category: {
			id: "224",
			name: "杀虫芳香"
		},
		retailPrice: {
			amount: "￥19.59",
			unit: "盒"
		},
		memberPrice: {
			amount: "￥18.88",
			unit: "盒"
		},
		vipPrice: {
			amount: "￥17.15",
			unit: "盒"
		},
		vip: {
			referenceSalePrice: '19.00/瓶',
			referencePurchasePrice: '12.60/瓶'
		},
		storage: {
			lastPurchasePrice: {
				amount: "¥13.00",
				unit: "盒"
			},
			amount: 226,
			number: 12,
			stockTurn: 1.33
		},
		promotion: {
			title: '5.1节会员促销',
			price: {
				amount: "￥13",
				unit: "盒"
			},
			startDate: "2021-05-06 00:00:00",
			endDate: "2021-05-07 23:59:59",
			explain: '厂家回馈用户，只限于本店PLUS会员用户'
		},
	}, {
		plu: 133,
		name: {
			name: "广西沃柑",
			mnemonic: "gxwg",
			alias: "沃柑"
		},
		spec: '500g',
		images: ['https://gd1.alicdn.com/imgextra/i1/1844773088/O1CN01KhI8VV1YgLqtKA4O6_!!1844773088.jpg',
			"https://gd1.alicdn.com/imgextra/i1/2206854062979/O1CN01RhNe4F1XsQh47fQ6j_!!2206854062979.png"
		],
		madeIn: {
			code: 451300,
			name: '来宾市'
		},
		grade: '优等品',
		category: {
			id: "98874",
			name: "水果"
		},
		shelfLife: "3天",
		retailPrice: {
			amount: "￥4.59",
			unit: "500g"
		},
		memberPrice: {
			amount: "￥4.00",
			unit: "500g"
		},
		vipPrice: {
			amount: "￥3.10",
			unit: "500g"
		},
		vip: {
			referenceSalePrice: '3.99',
			referencePurchasePrice: '3221.99'
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥1.79",
				unit: "500g"
			},
			amount: 22.36,
			number: 10.58,
			stockTurn: 22.756
		},
	}, {
		id: '52496163982907403',
		name: {
			name: "娃哈哈营养快线水果牛奶饮品（菠萝味）",
			mnemonic: "chlmxdrmwxy",
			alias: "营养快线"
		},
		barcode: 6902083898625,
		type:'new',
		spec: '550ml',
		images: ['https://gd3.alicdn.com/imgextra/i3/2380078362/O1CN01m8D6Qi2BdqcFco9Eb_!!2380078362.jpg'],
		madeIn: {
			code: 330100,
			name: '杭州市'
		},
		grade: '合格品',
		category: {
			id: '-99',
			name: "未定义",
		},
		retailPrice: {
			amount: "￥11.98",
			unit: "瓶"
		},
		memberPrice: {
			amount: "￥11.98",
			unit: "瓶"
		},
		vipPrice: {
			amount: "￥4.98",
			unit: "瓶"
		},
		vip: {
			referenceSalePrice: '12.00/瓶',
			referencePurchasePrice: '6.98/瓶'
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥5.9875",
				unit: "瓶"
			},
			amount: 420,
			number: 70,
			stockTurn: 10.25
		},
	}, {
		id: '52496321492179002',
		name: {
			name: "川骄无芯卷纸（白四层）",
			mnemonic: "chlmxdrmwxy",
			alias: "川骄卷纸"
		},
		barcode: 6970981171003,
		type:'process',
		spec: '1800g',
		images: ['https://gd4.alicdn.com/imgextra/i4/3053115674/TB2LRXVisIrBKNjSZK9XXagoVXa_!!3053115674.jpg'],
		category: {
			id: "234",
			name: "纸品"
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥7.98",
				unit: "瓶"
			},
			amount: 420,
			number: 70,
			stockTurn: 10.25
		},
		madeIn: {
			code: 510100,
			name: '成都市'
		},
		grade: '合格品',
		memberPrice: {
			amount: "￥0.00",
			unit: "提"
		},
		retailPrice: {
			amount: "￥11.98",
			unit: "提"
		},
		vipPrice: {
			amount: "￥0.00",
			unit: "提"
		}
	}, {
		id: '52496321492179000',
		name: {
			"name": "云南三七牙膏（清新留兰）",
			"mnemonic": "chlmxdrmwxy",
			"alias": "云南三七牙膏（清新留兰）"
		},
		barcode: 6953067200880,
		spec: '220g',
		images: ['https://gd2.alicdn.com/imgextra/i2/2270196201/O1CN017IoRqi1vg6fAvkZey_!!2270196201.jpg'],
		category: {
			id: "24325",
			name: "牙膏牙刷",
		},
		madeIn: {
			code: 530100,
			name: '昆明市'
		},
		grade: '合格品',
		retailPrice: {
			amount: "￥34.88",
			unit: "支"
		},
		memberPrice: {
			amount: "￥31.88",
			unit: "支"
		},
		vipPrice: {
			amount: "￥0",
			unit: "支"
		},
		vip: {
			referenceSalePrice: '32.88/支',
			referencePurchasePrice: '29.88/支',
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥27.98",
				unit: "瓶"
			},
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
		spec: '500g',
		images: ['https://img.alicdn.com/imgextra/i4/1071273746/O1CN0132LZ5q1dXiPRSpI2l_!!1071273746.jpg'],
		madeIn: {
			code: 511500,
			name: '宜宾市'
		},
		grade: '一级品',
		category_id: "98874",
		shelfLife: "0天",
		retailPrice: {
			amount: "￥1.98",
			unit: "kg"
		},
		memberPrice: {
			amount: "￥1.683",
			unit: "kg"
		},
		vipPrice: {
			amount: "￥1.48",
			unit: "kg"
		},
		vip: {
			referenceSalePrice: '1.59/500g',
			referencePurchasePrice: '0.59/500g'
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥1.243",
				unit: "kg"
			},
			amount: 3.578,
			number: 6.587,
			stockTurn: 12.24
		},
	}, {
		id: '52496321492179005',
		name: {
			"name": "菊品郁金银屑片",
			"mnemonic": "chlmxdrmwxy",
			"alias": "菊品郁金银屑片"
		},
		barcode: 6926094418474,
		spec: '100片',
		images: [],
		category: {
			id: "A1323",
			name: "药品"
		},
		madeIn: {
			code: 611000,
			name: '商洛市'
		},
		grade: '合格品',
		vip: {
			referenceSalePrice: '45.25/瓶',
			referencePurchasePrice: '23.3333/瓶'
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥22.47",
				unit: "瓶"
			},
			amount: 240.23,
			number: 12,
			stockTurn: 7.33
		},
		retailPrice: {
			amount: "￥49.98",
			unit: "瓶"
		},
		memberPrice: {
			amount: "￥38.88",
			unit: "瓶"
		},
		vipPrice: {
			amount: "￥35",
			unit: "瓶"
		}
	}, {
		id: '52496321492179007',
		name: {
			"name": "阿维A胶囊",
			"mnemonic": "chlmxdrmwxy",
			"alias": "阿维A胶囊"
		},
		barcode: '6920327600247',
		spec: '10粒/板*3板',
		images: ['https://gw.alicdn.com/imgextra/i2/2212886861762/O1CN01IcXcEK1Ot2bCZVGQW_!!2212886861762.jpg_Q75.jpg_.webp'],
		madeIn: {
			code: 500100,
			name: '重庆市'
		},
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
			lastPurchasePrice: {
				amount: "￥11.11",
				unit: "盒"
			},
			amount: 14.43,
			number: 1,
			stockTurn: 0.33
		},
		retailPrice: {
			amount: "￥19.80",
			unit: "盒"
		},
		memberPrice: {
			amount: "￥18.80",
			unit: "盒"
		},
		vipPrice: {
			amount: "￥0.00",
			unit: "盒"
		}
	}, {
		id: '52496321492179006',
		name: {
			"name": "阿莫西林胶囊",
			"mnemonic": "chlmxdrmwxy",
			"alias": "阿莫西林胶囊"
		},
		barcode: 6931435340314,
		spec: '0.25g*50粒',
		images: [],
		madeIn: {
			code: 230100,
			name: '哈尔滨市'
		},
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
			lastPurchasePrice: {
				amount: "￥8.8",
				unit: "盒"
			},
			amount: 14.43,
			number: 1,
			stockTurn: 0.33
		},
		retailPrice: {
			amount: "￥9.80",
			unit: "盒"
		},
		memberPrice: {
			amount: "￥8.80",
			unit: "盒"
		},
		vipPrice: {
			amount: "￥6.00",
			unit: "盒"
		}
	}, {
		id: '52496321492179004',
		name: {
			"name": "伊利金典有机纯牛奶",
			"mnemonic": "chlmxdrmwxy",
			"alias": "伊利金典有机纯牛奶"
		},
		barcode: 6907992508191,
		spec: '250ml',
		images: ['https://gd3.alicdn.com/imgextra/i3/2968065430/O1CN01geurKn1pyzQnSUi1m_!!2968065430.png'],
		madeIn: {
			code: 150100,
			name: '呼和浩特市'
		},
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
			lastPurchasePrice: {
				amount: "￥4.785",
				unit: "盒"
			},
			amount: 180,
			number: 36,
			stockTurn: 21.98
		},
		retailPrice: {
			amount: "￥5.19",
			unit: "盒"
		},
		memberPrice: {
			amount: "￥5.023",
			unit: "盒"
		},
		vipPrice: {
			amount: "￥4.12",
			unit: "盒"
		}
	}, {
		plu: 1243,
		name: {
			"name": "方山梨",
			"mnemonic": "fsl",
			"alias": "方山梨"
		},
		spec: '#70',
		madeIn: {
			code: 510500,
			name: '泸州市'
		},
		grade: '一级品',
		category: {
			id: '98874',
			name: "水果",
		},
		shelfLife: "0天",
		retailPrice: {
			amount: "￥1.989",
			unit: "500g"
		},
		memberPrice: {
			amount: "￥1.95",
			unit: "500g"
		},
		vipPrice: {
			amount: "￥1.79",
			unit: "500g"
		},
		vip: {
			referenceSalePrice: '1.59/500g',
			referencePurchasePrice: '0.59/500g'
		},
		storage: {
			lastPurchasePrice: {
				amount: "￥0.652",
				unit: "500g"
			},
			amount: 3.578,
			number: 6.587,
			stockTurn: 12.24
		},
	}]
}
