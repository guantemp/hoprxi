<template>
	<view class="text-df" ref="catalog1">
		<hoprxi-navigation title="商品目录" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]"
			:titleFont="['#FFF','left',1200]" id="navBar" :surplusHeight="46">
			<template slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品条码、名称、助记码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white" @tap="filterWindows = !filterWindows">
					<text class="cuIcon-filter"></text>
				</view>
			</template>
		</hoprxi-navigation>
		<hoprxi-dropdown :menus="categories" id="dropdown"></hoprxi-dropdown>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height:'calc(100vh - ' + navigatorHeight + 'px)'}">
			<hoprxi-slider :buttons="buttons" :items="catalog" @del="del" @history="history"
				@click="navigationToDetail">
				<template v-slot="{item}">
					<view class="flex padding-lr-sm padding-tb-xs align-center solid-top" @longpress="onLongPress"
						:data-id="item.id||item.plu" :data-sign="item.id?'id':'plu'">
						<view class="imageWrapper">
							<image class="good-img"
								:src="item.img||(item.barcode?'/static/workflow_icon/archives.png':'/static/workflow_icon/plu.png')"
								mode="aspectFill" />
						</view>
						<view class="flex flex-direction flex-sub">
							<view class="text-cut">{{item.name.name}}</view>
							<view class="flex justify-between">
								<text v-if="item.barcode">条码：{{item.barcode}}</text>
								<text v-else>PLU号：{{item.plu}}</text>
								<text>规格：{{item.specs}}</text>
							</view>
							<view>
								产地：<text>{{item.placeOfOrigin}}</text>
							</view>
							<view class="flex justify-between">
								零售价：<text class="text-price text-red margin-right-sm">{{item.retailPrice}}</text>
								会员价：<text class="text-price text-red">{{item.memberPrice}}</text>
							</view>
						</view>
					</view>
				</template>
			</hoprxi-slider>
		</scroll-view>
		<view v-if="catalog.length === 0" class="flex justify-center flex-direction align-center"
			:style="{height:'calc(100vh - ' + navigatorHeight + 'px)'}">
			<text class="cuIcon-like text-red text-xsl"></text>
			<text>还没有任何一件商品...</text>
		</view>
		<hoprxi-drag-fab :menus="menus" @appendGood="$util.navTo('/pages/workflow/catalog/good?sign=good')"
			@appendScale="$util.navTo('/pages/workflow/catalog/good?sign=scale')"
			@editCategories="$util.navTo('/pages/workflow/catalog/category')">
		</hoprxi-drag-fab>
		<!-- 遮罩层-->
		<view :class="['mask',{'show':filterWindows}]" @tap="filterWindows = false"></view>
		<!-- 高级过滤对话框 -->
		<view class="drawerWindow" :class="{'show':filterWindows}">
			<view class="flex"><text class="cuIcon-roundclose text-xl" @tap="filterWindows = false"></text><text
					class="flex-twice text-center">筛选</text> </view>
			<scroll-view scroll-y class="margin-top">
				<view class="flex justify-between padding-lr-xs">排序
					<view class="text-sm" @tap="sortExchange==='asc'?sortExchange='desc':sortExchange='asc'"
						:class="sortExchange==='asc'?'text-red':'text-green'">
						{{sortExchange==='asc'?'升序':'降序'}}<text
							:class="sortExchange==='asc'?'icon-asc':'icon-desc'"></text>
					</view>
				</view>
				<view class="flex flex-wrap margin-bottom-sm">
					<block v-for="(sort,index) in sorts" :key="sort">
						<view :class="['lattice',{'selected':sort==='零售价'}]" @tap.top="sort(sort)">
							<text>{{sort}}</text>
						</view>
					</block>
				</view>
				<view class="flex justify-between margin-bottom-sm solid-top padding-top-sm  padding-lr-xs">价格
					<view class="text-xs text-center" @tap="showPrice=!showPrice">
						{{showPrice?'收缩':'展开'}}<text :class="showPrice?'cuIcon-fold':'cuIcon-unfold'"></text>
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
				<view class="margin-top-sm solid-top padding-top-sm">品牌</view>
				<view class="flex flex-wrap">
					<block v-for="(brand,index) in brands" :key="brand">
						<view :class="['lattice',{'selected':index===2||index===0}]" @tap.top="brand(brand)">
							<text>{{brand}}</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<!-- bootom -->
			<view class="bootom">
				<button class="cu-btn radius shadow bg-grey basis-sm" @tap.stop="restFilter">重置</button>
				<button class="cu-btn radius shadow bg-grey basis-sm margin-left-sm"
					@tap.stop="$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">确定</button>
			</view>
		</view>
		<!-- 删除对话框 -->
		<view class="cu-modal" :class="{'show':delGoodDialog}">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="content text-bold text-orange">警 告</view>
				</view>
				<view class="padding-xs bg-white">
					<text class="text-bold">确定要删除商品?</text><br /><br />
					<text class="text-blue">名称:{{}}商品条码：{{}},</text>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green" @tap="hideDelDialog">取消</view>
					<view class="action margin-0 flex-sub solid-left" @tap="delGood(id)">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reactive,
		ref,
		onBeforeMount,
		watch
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	import catalog_test from '@/data/catalog_test_data.js'; //用例
	export default {
		setup(props, content) {
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
			const menus = [{
				iconPath: '/static/workflow_icon/new.png',
				selectedIconPath: '/static/workflow_icon/new.png',
				text: '新增商品',
				event: 'appendGood'
			}, {
				iconPath: '/static/workflow_icon/new_kg.png',
				selectedIconPath: '/static/workflow_icon/new_kg.png',
				text: '新增散秤',
				event: 'appendScale'
			}, {
				iconPath: '/static/workflow_icon/count.png',
				selectedIconPath: '/static/workflow_icon/count.png',
				text: '商品类目',
				event: 'editCategories'
			}, {
				iconPath: '/static/workflow_icon/count.png',
				selectedIconPath: '/static/workflow_icon/count.png',
				text: '回收站',
				event: 'rcyle'
			}];
			const catalog = reactive([]);
			const sorts = ['条码', '品名', '零售价', '毛利率', '规格', '新品', '新品待审', '会员价', 'VIP价', '异常'];
			const brands = reactive([]);
			const categories = reactive([]);
			let filterWindows = ref(false);
			let showPrice = ref(false);
			let sortExchange = ref('asc');
			let navigatorHeight = ref(0);
			let scanResult = ref('');
			let delGoodDialog = ref(false);
			onBeforeMount(() => {
				//categoryies
				ajax({
					url: 'https://hoprxi.tooo.top/catalog/core/v1/categories',
				}).then(res => {
					for (const category of res.data.categories) {
						if (category.id === "-1") {
							categories.splice(0, 0, {
								id: category.id,
								name: category.name.name
							})
						} else if (Array.isArray(category.children)) {
							for (const child of category.children) {
								let temp = {
									id: child.id,
									name: child.name.name
								};
								if (child.children) {
									temp = {
										...temp,
										children: child.children
									}
								}
								categories.push(temp);
							}
						}
					}
					categories.splice(0, 0, {
						id: "-9999",
						name: "全部"
					});
				}).catch(err => {
					console.log(err)
				});
				/*
				this.categories = catalog_test.category.map((x) => x);
				for (const c of catalog_test.category) categories.push(c)
				categories.splice(0, 0, {
					id: "-9999",
					name: "全部",
				});
				*/
				//item
				for (const item of catalog_test.catalog) catalog.push(item);
				//brand
				ajax({
					url: 'https://hoprxi.tooo.top/catalog/core/v1/brands',
				}).then(res => {
					for (const brand of res.data.brands) {
						brands.push(brand.name.name)
					}
				});
			});
			return {
				buttons,
				menus,
				catalog,
				categories,
				showPrice,
				sorts,
				sortExchange,
				brands,
				filterWindows,
				navigatorHeight,
				scanResult,
				delGoodDialog
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
		},
		mounted() {
			this.$nextTick(() => {
				let query = uni.createSelectorQuery().in(this);
				query.select('#navBar').boundingClientRect().exec(rect => {
					this.navigatorHeight = rect[0].height;
				});
				//复用query得到单位是rpx,似乎不太准确
				query = uni.createSelectorQuery().in(this); //再一次单位是px,
				query.select('#dropdown').boundingClientRect().exec(rect => {
					this.navigatorHeight = this.navigatorHeight + rect[0].height;
				});
			})
			uni.hideLoading();
		},
		methods: {
			scan() {
				var that = this;
				uni.scanCode({
					scanType: ['barCode'],
					success: function(res) {
						that.scanResult = res.result;
					},
					fail: function(res) {
						console.log(JSON.stringify(res));
					},
				});
			},
			restFilter() {},
			navigationToDetail(data) {
				if (data.id) this.$util.navTo('/pages/workflow/catalog/good?id=' + data.id);
				if (data.plu) this.$util.navTo('/pages/workflow/catalog/good?plu=' + data.plu);
			},
			onLongPress(e) {
				console.log(e.currentTarget);
				console.log(e.target);
			},
			del(data) {
				console.log(data);
				this.$util.toast('删除：' + (data.id || data.plu));
			},
			history(data) {
				this.$util.toast('历史：' + (data.id || data.plu));
				console.log(data);
			}
		}
	}
</script>

<style lang='scss'>
	.imageWrapper {
		width: 128rpx;
		height: 128rpx;
		display: flex;
		align-items: center;
	}

	.good-img {
		width: 108rpx;
		height: 108rpx;
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

	.drawerWindow {
		display: flex;
		position: fixed;
		flex-direction: column;
		width: 83vw;
		top: 14vh;
		right: 0;
		bottom: 0;
		z-index: 9;
		transform: scale(0.9, 0.9) translateX(100%);
		background-color: #fff;
		border-top-left-radius: 24rpx;
		border-bottom-left-radius: 24rpx;
		opacity: 0;
		transition: all 0.4s;
		padding: 20rpx;

		&.show {
			transform: scale(1, 1) translateX(0%);
			opacity: 1;
			pointer-events: all;
		}

		.lattice {
			display: flex;
			font-size: 28rpx;
			/*重要设置上下左右居中*/
			text-align: center;
			min-height: 64rpx;
			margin-right: calc(19rpx*4 / 3);
			background-color: #f0f0f0;
			border-radius: 12rpx;
			margin-top: 14rpx;
			border: solid #f5f5f5 1rpx;
			padding: 8rpx 24rpx;

			&.selected {
				border-color: #f37b1d;
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
			border: solid #f5f5f5 1rpx;
			border-radius: 24rpx;
			padding: 0 20rpx;
			flex: 1;
			line-height: 1;
			font-size: 26rpx;
			min-height: 64rpx;
		}

		.bootom {
			display: flex;
			position: fixed;
			justify-content: space-around;
			bottom: 1.2vh;
			right: 0;
			width: inherit
		}
	}
</style>
