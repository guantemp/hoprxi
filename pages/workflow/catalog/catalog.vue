<template>
	<hoprxi-navigation title="商品目录" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF','left',400]"
		id="navBar" :surplusHeight="46">
		<template slot="extendSlot" class="cu-bar search">
			<view class="search-form radius" style="height:38px">
				<text class="cuIcon-search text-bold text-xl"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品条码/名称/拼音首字母"
					confirm-type="search" placeholder-class="text-df">
				<text class="cuIcon-scan text-blue text-bold text-xxl" @tap="scan"></text>
			</view>
			<view class="action text-white cuIcon-filter text-xxl" @tap="filterWindows = !filterWindows">
			</view>
		</template>
	</hoprxi-navigation>
	<hoprxi-dropdown :menus="categories" id="dropdown" style="font-size: 15px;"></hoprxi-dropdown>
	<view v-if="catalog.length === 0" class="flex justify-center flex-direction align-center"
		:style="{height:'calc(100vh - ' + (navigatorHeight + dropdownHeight) + 'px)'}">
		<text class="cuIcon-like text-red text-xsl"></text>
		<text>吔、吔、切克闹...</text>
	</view>
	<scroll-view v-else scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
		:style="{height:'calc(100vh - ' + (navigatorHeight + dropdownHeight) + 'px)'}" class="text-df">
		<hoprxi-slider :buttons="buttons" :items="catalog" @del="del" @history="history" @favor="favor" @share="share"
			@click="navigationToDetail">
			<template v-slot="{item}">
				<view class="flex padding-lr-sm padding-tb-xs align-center solid-top" @longpress="onLongPress"
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
		</hoprxi-slider>
	</scroll-view>
	<hoprxi-drag-fab :menus="menus" @appendGood="$util.navTo('/pages/workflow/catalog/good?sign=good&action=new')"
		@appendScale="$util.navTo('/pages/workflow/catalog/good?sign=scale&action=new')"
		@editCategories="$util.navTo('/pages/workflow/catalog/category')"
		@recovery="$util.navTo('/pages/public/recovery')" @editBrands="$util.navTo('/pages/workflow/catalog/brand')">
	</hoprxi-drag-fab>
	<!-- 遮罩层-->
	<view :class="['mask',{'show':filterWindows}]" @tap="filterWindows = false"></view>
	<!-- 高级过滤对话框 -->
	<view class="filterWindow" :class="{'show':filterWindows}" :style="{top:navigatorHeight + 'px'}">
		<view class="flex" id="filter"><text class="flex-twice text-center">筛选</text><text
				class="cuIcon-roundclose text-xl" @tap="filterWindows = false"></text></view>
		<scroll-view scroll-y class="margin-top" :style="{height:'calc(100% - '+filterContentHeight+'px + 10px)'}">
			<view class="flex justify-between padding-lr-xs text-df text-bold">排序
				<view class="text-sm" @tap="sortExchange === 'asc'?sortExchange = 'desc':sortExchange ='asc'"
					:class="sortExchange === 'asc'?'text-red':'text-green'">{{sortExchange === 'asc'?'升序':'降序'}}
					<text
						:class="['margin-left-xs',{'icon-asc':sortExchange === 'asc','icon-desc':sortExchange === 'desc'}]"></text>
				</view>
			</view>
			<view class="flex flex-wrap margin-bottom-sm">
				<block v-for="(sort,index) in sorts" :key="sort">
					<view :class="['lattice',{'selected':sort === selectedFilter[0]}]" @tap.top="sortChecked(sort)">
						<text>{{sort}}</text>
					</view>
				</block>
			</view>
			<view
				class="flex justify-between margin-bottom-sm solid-top padding-top-xs padding-lr-xs text-df text-bold">
				价格
				<view class="text-sm text-center" @tap="showPrice=!showPrice">
					{{showPrice?'收缩':'更多'}}<text
						:class="['margin-left-xs',{'cuIcon-fold':showPrice,'cuIcon-unfold':!showPrice}]"></text>
				</view>
			</view>
			<view class="flex justify-between padding-lr-xs">
				<input placeholder="最低零售价" class="input1" type="digit">
				<text class="cuIcon-move margin-lr  padding-top-sm"></text>
				<input placeholder="最高零售价" class="input1" type="digit">
			</view>
			<view v-show="showPrice" class="flex justify-between padding-lr-xs margin-top-xs">
				<input placeholder="最低会员价" class="input1" type="digit">
				<text class="cuIcon-move margin-lr  padding-top-sm"></text>
				<input placeholder="最高会员价" class="input1" type="digit">
			</view>
			<view v-show="showPrice" class="flex justify-between padding-lr-xs margin-top-xs">
				<input placeholder="最低VIP价" class="input1" type="digit">
				<text class="cuIcon-move margin-lr  padding-top-sm"></text>
				<input placeholder="最高VIP价" class="input1" type="digit">
			</view>
			<view v-show="showPrice" class="flex justify-between padding-lr-xs margin-top-xs">
				<input placeholder="最低入库价" class="input1" type="digit">
				<text class="cuIcon-move margin-lr  padding-top-sm"></text>
				<input placeholder="最高入库价" class="input1" type="digit">
			</view>
			<view class="margin-top-sm solid-top padding-top-xs text-df text-bold">品牌</view>
			<view class="flex flex-wrap">
				<block v-for="(brand,index) in brands" :key="brand">
					<view :class="['lattice',{'selected':isCheckedBrand(brand)}]" @tap.top="brandChecked(brand)">
						<text>{{brand}}</text>
					</view>
				</block>
			</view>
		</scroll-view>
		<view class="flex margin-top-xs">
			<button class="cu-btn basis-sm bg-white" @tap.stop="restFilter">重置</button>
			<button class="cu-btn radius shadow bg-grey margin-left-sm flex-twice" @tap.stop="">确定</button>
		</view>
	</view>
	<!-- 删除对话框 -->
	<view class="cu-modal" :class="{'show':delGoodModalDialog}">
		<view class="cu-dialog">
			<view class="cu-bar bg-white">
				<view class="content text-bold text-orange">警 告</view>
			</view>
			<view class="padding-xs bg-white">
				<text class="text-bold text-lg">确定要删除商品?</text><br />
				<br />
				<text class="text-blue margin-top-xl text-sm">您可以在回收站中找回删除的商品！</text>
			</view>
			<view class="cu-bar">
				<view class="action margin-0 flex-sub text-green" @tap="delGoodModalDialog = false">取消</view>
				<view class="action margin-0 flex-sub solid-left" @tap="remove(selectedGood.id||selectedGood.plu)">
					确定</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onBeforeMount,
		onMounted,
		watch
	} from 'vue';
	import {
		toast
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import ajax from '@/uni_modules/u-ajax'
	import catalog_test from '@/data/catalog_test_data.js'; //用例
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
	const share = (data) => {
		toast('分享：' + (data.id || data.plu));
	};
	const history = (data) => {
		toast('历史：' + (data.id || data.plu));
		console.log(data);
	};
	const favor = (data) => {
		toast('收藏：' + (data.id || data.plu));
	};
	const navigationToDetail = (data) => {
		if (data.id) uni.navigateTo({
			url: '/pages/workflow/catalog/good?id=' + data.id + '&sign=good'
		})
		else if (data.plu) uni.navigateTo({
			url: '/pages/workflow/catalog/good?plu=' + data.plu + '&sign=scale'
		})
	};
	const menus = [{
		iconFont: 'cuIcon-goods',
		text: '新增商品',
		event: 'appendGood'
	}, {
		iconFont: 'icon-scale',
		text: '新增散秤',
		event: 'appendScale'
	}, {
		iconFont: 'cuIcon-cascades',
		text: '商品类目',
		event: 'editCategories'
	}, {
		iconFont: 'cuIcon-comment',
		badge: 10,
		text: '商品品牌',
		event: 'editBrands'
	}, {
		iconFont: 'cuIcon-delete',
		badge: 100,
		text: '回收站',
		event: 'recovery'
	}];
	let scanResult = ref('');
	const scan = () => {
		uni.scanCode({
			scanType: ['barCode'],
			success: function(res) {
				scanResult = res.result;
				console.log(scanResult)
			},
			fail: function(res) {
				console.log(JSON.stringify(res));
			},
		});
	};
	const navigatorHeight = ref(0);
	const dropdownHeight = ref(0);
	const filterContentHeight = ref(0);
	let delGoodModalDialog = ref(false);
	let selectedGood = reactive({});
	const del = (data) => {
		delGoodModalDialog.value = true;
		selectedGood = {};
		if (data.id) selectedGood.id = data.id;
		else selectedGood.plu = data.plu;
		selectedGood.name = data.name.name
	};
	const remove = (key) => {
		toast('模拟删除：' + key); //还没找到方法
		delGoodModalDialog.value = false;
	};
	const filterWindows = ref(false);
	const sorts = ['待审', '新品', '异常', '条码', '品名', '零售价', '最近入库价', '毛利率', '规格', '会员价', 'VIP价'];
	const selectedFilter = reactive([sorts[0],
		[],
		[]
	]);
	let sortExchange = ref('asc');
	let showPrice = ref(false);
	const restFilter = () => {
		selectedFilter[0] = sorts[0];
		selectedFilter[1] = [];
		selectedFilter[2] = [];
	};
	const sortChecked = (sort) => {
		selectedFilter[0] = sort
	};
	const brandChecked = (brand) => {
		let brands = selectedFilter[2];
		let has = false;
		for (let i = 0, j = brands.length; i < j; i++) {
			if (brands[i] === brand) {
				selectedFilter[2].splice(i, 1);
				has = true;
				break;
			}
		}
		if (!has) selectedFilter[2].push(brand)
	};
	const isCheckedBrand = (brand) => {
		for (const b of selectedFilter[2])
			if (b === brand) return true;
		return false;
	};
	const onLongPress = (e) => {
		console.log(e.currentTarget);
		console.log(e.target);
	};
	const catalog = reactive([]);
	const items = reactive([]);
	const categories = reactive([]);
	const brands = reactive([]);
	onBeforeMount(() => {
		const _translate = (data) => {
			let result = {
				id: data.id,
				name: data.name.name
			};
			if (data.expand) result.expand = true;
			if (data.children && Array.isArray(data.children)) {
				let items = [];
				for (const child of data.children) {
					items.push(_translate(child))
				}
				result.children = items;
			}
			return result;
		};
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		ajax({ //categoryies
			url: 'https://hoprxi.tooo.top/catalog/core/v1/categories',
		}).then(res => {
			for (let category of res.data.categories) {
				if (category.id === "-1") {
					categories.splice(1, 0, {
						id: category.id,
						name: category.name.name
					});
					continue;
				}
				category.expand = true;
				categories.push(_translate(category));
			}
		}).catch(err => {
			toast('无法加载商品类，请联系管理员');
		});
		categories.splice(0, 0, {
			id: "-9999",
			name: "全部"
		});
		ajax({ //items
			url: 'https://hoprxi.tooo.top/catalog/core/v1/items',
		}).then(res => {
			for (const item of res.data.items) {
				items.push(item)
			}
		}).catch(err => {
			toast('加载商品目录错误，请联系管理员');
		});
		//
		ajax({ //brand
			url: 'https://hoprxi.tooo.top/catalog/core/v1/brands',
		}).then(res => {
			for (const brand of res.data.brands) {
				brands.push(brand.name.name)
			}
		}).catch(err => {
			uni.showModal({
				title: '错误',
				content: '加载商品品牌超时！',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		});
		//item
		for (const item of catalog_test.catalog) {
			catalog.push(item);
		}
		uni.hideLoading();
	});
	onMounted(() => {
		uni.createSelectorQuery().select('#navBar').boundingClientRect(res => {
			navigatorHeight.value = res.height;
		}).exec();
		uni.createSelectorQuery().select('#dropdown').boundingClientRect(res => {
			dropdownHeight.value = res.height;
		}).exec();
		uni.createSelectorQuery().select('.margin-top .flex').boundingClientRect(res => {
			filterContentHeight.value = res.height + dropdownHeight.value
		}).exec();
		uni.createSelectorQuery().select('#filter').boundingClientRect(res => {
			filterContentHeight.value += res.height
		}).exec();
		uni.hideLoading();
	});
	/*
		watch(items, (n, o) => {
			console.log(n)
			
		});
		*/
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

	.mask {
		display: flex;
		position: fixed;
		z-index: 8;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;

		&.show {
			opacity: 1;
			transition-duration: 0.3s;
			pointer-events: auto;
		}
	}

	.filterWindow {
		display: flex;
		position: fixed;
		flex-direction: column;
		width: 100%;
		bottom: 0;
		z-index: 9;
		transform: scale(0.9, 0.9) translateY(100%);
		background-color: #fff;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		opacity: 0;
		transition: all 0.4s;
		padding: 8px;

		&.show {
			transform: scale(1, 1) translateX(0%);
			opacity: 1;
			pointer-events: all;
		}

		.lattice {
			display: flex;
			font-size: 14px;
			/*重要设置上下左右居中*/
			text-align: center;
			min-height: 30px;
			margin-right: calc(6px*4 / 3);
			background-color: #f0f0f0;
			border-radius: 6px;
			margin-top: 6px;
			border: solid #f5f5f5 1px;
			padding: 4px 12px;

			&.selected {
				background-color: #f37b1d;
				color: #fff;
			}

			/*重要设置上下左右居中*/
			>text {
				margin: auto;
			}
		}

		.input1 {
			overflow: hidden;
			border: solid #f5f5f5 1px;
			border-radius: 12px;
			padding: 0 10px;
			flex: 1;
			line-height: 1;
			font-size: 13px;
			min-height: 30px;
		}
	}
</style>