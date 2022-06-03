export default {
	labelList: [{
		id: 45,
		type: 'barcode',
		url: '/static/workflow/c.png',
		name: '条码标签',
		specs: '32mm(宽)*19mm(高)*3列',
	}, {
		id: 34,
		type: 'special',
		url: '/static/workflow/a.png',
		name: '特价标签',
		specs: '78mm(宽)*38mm(高)*1列'
	}, {
		id: 78,
		type: 'normal',
		url: '/static/workflow/a.png',
		name: '正价标签',
		specs: '78mm(宽)*38mm(高)*1列'
	}, {
		id: 334,
		type: 'normal',
		url: '/static/workflow/b.png',
		name: '正价标签',
		specs: '90mm(宽)*38mm(高)*1列'
	}],
	prints: [{
		id: 'system',
		name: '系统设置',
	}, {
		id: 'Q8_one',
		name: '博思得Q8（正价签）',
	}, {
		id: 'Q8_two',
		name: '博思得Q8（特价签）',
	}, {
		id: 'SNBC-001581B6AE86',
		name: '新北洋BTP-P33蓝牙便携（001581B6AE86）',
	}, {
		id: 'HRRT-001581B6AE86',
		name: '汉印HM-A300S蓝牙便携',
	}],
	labels: [{
		id: '201452393217567744',
		name: '哇哈哈营养快线水果牛奶饮品（菠萝味）',
		barcode: 6902083898625,
		specs: '550ml',
		placeOfOrigin: '浙江省.杭州市',
		grade: '合格品',
		retailPrice: '11.98/瓶',
		memberPrice: '10.98/瓶',
		vipPrice: '4.98/瓶',
		label: {
			id: 334,
			type: 'special',
			name: "特价标签",
			printQuantity: 1,
			specs: "90mm(宽)*38mm(高)*1列",
			url: "/static/workflow/c.png",
		},
		promotion: {
			endDate: "2021-05-07 23:59:59",
			explain: "厂家回馈用户，只限于本店PLUS会员用户",
			price: "1450.00/公斤",
			startDate: "2021-05-06 00:00:00",
			title: "5.1节会员促销"
		}
	}, {
		id: '201452853459475457',
		name: '川骄无芯卷纸（白四层）',
		barcode: 6970981171003,
		specs: '1800g',
		placeOfOrigin: '四川省.成都市',
		grade: '合格品',
		retailPrice: '11.98/提',
		memberPrice: '0.00/提',
		vipPrice: '0.00/提',
		label: {
			id: 334,
			name: "正价标签",
			type: 'normal',
			printQuantity: 1,
			specs: "90mm(宽)*38mm(高)*1列",
			url: "/static/workflow/b.png",
		}
	}]
}
