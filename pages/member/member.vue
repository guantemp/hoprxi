<template>
	<hoprxi-navigation title="会员管理" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF','left',400]"
		:surplusHeight=46>
		<view slot="extendSlot" class="cu-bar search">
			<view class="search-form radius" style="height:38px">
				<text class="cuIcon-search text-bold text-xl"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入会员编号、手机号、姓名拼音"
					confirm-type="search" placeholder-class="text-df">
				<text class="cuIcon-scan text-blue text-bold text-xxl" @tap="scan"></text>
			</view>
		</view>
	</hoprxi-navigation>
	<!-- <hoprxi-dropdown :menus="categories" id="dropdown"></hoprxi-dropdown> -->

	<!-- 产地选择对话框 -->
	<view class="cu-modal bottom-modal border-radius">
		<view class="cu-dialog">
			<view class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
				<text @tap.stop.prevent="hideOriginDialog">取消</text>
				<text class="text-orange" @tap.stop.prevent="originDialogConfirm">确定</text>
			</view>
			<hoprxi-area-picker @change="change" :initialArea="['四川省','乐山市','井研县']"></hoprxi-area-picker>
		</view>
	</view>
	<!--
	<view class="flex margin-top-xl justify-end">
		<hoprxi-badge count='22'>
			<input :placeholder="item&&item.shelfLife||'0 天'"  type="number" class="text-right">
		</hoprxi-badge>
	</view>
	<view class="flex margin-top-xl justify-end flex-sub">
		<hoprxi-badge :count="'毛利率：20.23%'" left bg-color="red">
			<input :placeholder="item&&item.shelfLife||'0 天'" value="等下过来大厦" type="number" class="text-right">
		</hoprxi-badge>
	</view>
	-->
	<hoprxi-dateTime-selector :prompt="{start:'入住',end:'离开'}" mode='single'
		@confirm="confirm"></hoprxi-dateTime-selector>
	<block v-for="(item,index) in catalog" :key="index">
		<hoprxi-mask :item="item" :buttons="filterButton(item)">
			<template v-slot="{item}">
				<view class="flex padding-lr-sm padding-tb-xs align-center solid-top text-df"
					:data-id="item.id||item.plu" :data-sign="item.id?'id':'plu'">
					<view class="imageWrapper">
						<image class="good-img"
							:src="(item.images&&item.images[0])||(item.barcode?'/static/workflow_icon/archives.png':'/static/workflow_icon/plu.png')"
							mode="aspectFill" />
					</view>
					<view class="flex flex-direction flex-sub">
						<view class="text-cut">{{item.name.name}}</view>
						<view class="flex justify-between">
							<text v-if="item.barcode">条码：{{item.barcode}}</text>
							<text v-else>PLU：{{item.plu}}</text>
							<text>规格：{{item.spec}}</text>
						</view>
						<view>
							产地：{{item.madeIn.name}}
						</view>
						<view class="flex justify-between">
							<view>零售价：<text
									class="text-red">{{item.retailPrice.amount}}/{{item.retailPrice.unit}}</text>
							</view>
							<view>会员价:<text
									class="text-red margin-left-sm">{{item.memberPrice.amount}}/{{item.memberPrice.unit}}</text>
							</view>
						</view>
					</view>
				</view>
			</template>
		</hoprxi-mask>
	</block>
	<!--
	<view class=" coupon">444</view>

		<hoprxi-tree :trees="categories" checkType="checkbox" :disabledIds="disabledIds" :expandedIds="expandedIds"
			:expendAll="false" :checkedIds="checkedIds" class="margin-left-sm" @check="check">
		</hoprxi-tree>
		-->
</template>

<script setup>
	import {
		reactive,
		ref,
		onBeforeMount,
		watch,
		computed
	} from 'vue';
	import {
		formatMoney,
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import catalog_test from '@/data/catalog_test_data.js'; //用例
	const catalog = reactive([]);
	const menus = [{
		iconFont: 'cuIcon-goods',
		text: '新增商品',
		event: 'appendGood'
	}, {
		iconPath: '/static/workflow_icon/new_kg.png',
		selectedIconPath: '/static/workflow_icon/new_kg.png',
		text: '新增散秤',
		event: 'appendScale'
	}, {
		iconFont: 'cuIcon-cascades',
		text: '商品类目',
		event: 'editCategories'
	}, {
		iconPath: '/static/workflow_icon/new_kg.png',
		iconFont: 'cuIcon-comment',
		badge: 10,
		text: '商品品牌',
		event: 'recovery'
	}, {
		iconFont: 'cuIcon-delete',
		badge: 100,
		text: '回收站',
		event: 'recovery'
	}];
	const buttons = [{
		name: '分享',
		width: 100,
		background: '#39b54a',
		icon: 'cuIcon-share',
		fontColor: '#fff',
		event: 'share'
	}, {
		name: '历史',
		width: 100,
		fontColor: '#fff',
		background: '#8799a3',
		icon: 'cuIcon-time',
		event: 'history',
	}, {
		name: '收藏',
		width: 100,
		fontColor: '#fff',
		background: '#0081ff',
		icon: 'cuIcon-favor',
		event: 'favor'
	}, {
		name: '删除',
		width: 100,
		background: '#e54d42',
		icon: 'cuIcon-delete',
		fontColor: '#fff',
		event: 'del'
	}];
	for (const item of catalog_test.catalog) {
		catalog.push(item);
	}
	/*
	a: "撒旦法",
	disabledIds: ["-99"],
	expandedIds: ["1", "3446", "a25423", "gj"],
	checkedIds: ["-99", "43645", "754", "1234", "98874", "1532", "b25423", "24325", "24326", "24323465345"],
	defaultProps: {
		id: 'id', // 指定id为节点对象的某个属性值
		sub: 'sub', // 指定子树为节点对象的某个属性值
		name: 'name', // 指定标签为节点对象的某个属性值
		selector: 'selector' //选择类型 single_select,multi_select
	},
	*/
	const categories = reactive([]);
	onBeforeMount(() => {
		for (const c of catalog_test.category) categories.push(c)
		categories.splice(0, 0, {
			id: "-9999",
			name: "全部",
		});
	});
	const filterButton = computed(
		() => (item) => {
			let temp = buttons.map(a => a);
			try {
				switch (item.type) {
					case 'process':
						temp.splice(0, 0, {
							name: '审核',
							width: 100,
							fontColor: '#fff',
							background: '#8799a3',
							icon: 'cuIcon-time',
							event: 'process',
						});
						console.log(temp)
						return temp;
						break;
					case 'new':
						temp.splice(0, 0, {
							name: '新品',
							width: 100,
							fontColor: '#fff',
							background: '#8799a3',
							icon: 'cuIcon-time',
							event: 'new',
						});
						return temp;
						break;
					default:

				}
			} catch (error) {}
			return buttons;
		}
	);
	const customTheme = ref({
		color: 'red',
		txt: '萨尔图区而为'
	});
	const confirm = (e) => {
		console.log(e)
	}
	const check = (object) => {
		console.log("member");
		console.log(object);
	};
	const forMoney = () => {
		let patt = new RegExp(/^¥?[1-9][0-9]*\.[0-9]{1}$|^0\.[0-9]{1}$/);
		"¥ 25.000/盒".replace(/^(¥|￥|¥ |￥ )(\d+.\d{2,})/, function(m, $1, $2, $3, $4) {
			console.log(m)
			console.log($1)
			console.log($2)
			console.log($3)
			console.log($4)
		});
		console.log("¥ 25.000/盒".replace(/\/([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/, '').replace(
			/^(¥|￥|¥ |￥ )(\d+.\d{2,}$)/, '$2'));
		console.log("021".replace(/(0)?(\d+)(.)?/, "$2.00"));
		console.log("021.".replace(/(0)?(\d+)(.)?/, "$2.00"));
		console.log("0".replace(/(0)(.)?/, "$1.00"));
		console.log("0.".replace(/(0)(.)?/, "$1.00"));
		/*
		console.log("0".replace(/0/, '0.00'))
		console.log("0.2".replace(/((0)?\d+)|((0)?.\d{1})/, '$1.00$2.00$30$40'))
		console.log(".21".replace(/.(\d{1})/, '0.$1'))
		
		console.log("23.245754/规格".replace(patt, ''))
		console.log("0.245754/规格".replace(patt, ''))
		*/
		const unitPattern = new RegExp(/\/([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
		console.log("unit:" + "¥23.245754/规格".replace(unitPattern, ''))
	};
</script>

<style lang='scss'>
	.imageWrapper {
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
	}

	.good-img {
		width: 54px;
		height: 54px;
	}

	.profitRate {
		&::before {
			content: '奥术洪流';
			position: relative;
			top: 0;
			right: 35%;
			background-color: v-bind("customTheme.color");
			border-radius: 200rpx;
			min-width: 26px;
			min-height: 14px;

			text-align: center;
			padding: 0 20rpx;
			font-size: 26rpx;
			z-index: 9;

			white-space: nowrap;
		}
	}

	.coupon {
		width: 240px;
		height: 100px;
		background: linear-gradient(to right, #fd6868, #fd5252 60px) no-repeat left / 60px 100%,
			radial-gradient(circle at 8px 8px, transparent 8px, #fd5252 8px) repeat-y 60px -8px / 16px 100%,
			linear-gradient(to right, #fd5252 76px, #fe0000) no-repeat 76px 0 / 100% 100%;
		position: relative;
		border-radius: 10px;
		/*纯色
		background-image: radial-gradient(circle at 9px 8px ,transparent 0%, transparent 8px,#e15852 8px, #e15852 100%);
		    background-position: 66px -8px;
		    background-size: 100% 100%;
			*/
		filter: drop-shadow(2px 4px 6px black);
	}
</style>