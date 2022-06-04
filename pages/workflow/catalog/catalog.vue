<template>
	<view>
		<hoprxi-navigation title="商品目录" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']"
			id="navBar" :surplusHeight="43">
			<template slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品条码、名称、拼音助记码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white">
					<text class="cuIcon-close text-xs" @click="computedScrollViewHeight">取消</text>
				</view>
			</template>
		</hoprxi-navigation>
		<hoprxi-dropdown :menus="categories"></hoprxi-dropdown>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height: 'calc(100vh - 150px)'}">
			<hop-slider :btnArr="btnArr" :items="catalog" @del="del" @click="navigationToDetail">
				<template v-slot="{item}">
					<view class="flex padding-lr-sm padding-tb-xs align-center solid-top" @longpress="onLongPress"
						:data-id="item.id||item.plu" :data-sign="item.id?'id':'plu'">
						<view class="imageWrapper">
							<image class="good-img"
								:src="item.goodImg||(item.barcode?'/static/workflow_icon/archives.png':'/static/workflow_icon/plu.png')"
								mode="aspectFill" />
						</view>
						<view class="flex flex-direction flex-sub">
							<view class="text-cut">{{item.name}}</view>
							<view class="flex justify-between">
								<text v-if="item.barcode">条码：{{item.barcode}}</text>
								<text v-else>PLU号：{{item.plu}}</text>
								<text>规格：{{item.specs}}</text>
							</view>
							<view>
								产地：<text>{{item.placeOfOrigin}}</text>
							</view>
							<view>
								零售价：<text class="text-price text-red margin-right-sm">{{item.retailPrice}}</text>
								会员价：<text class="text-price text-red">{{item.memberPrice}}</text>
							</view>
						</view>
					</view>
				</template>
			</hop-slider>
		</scroll-view>
		<hoprxi-drag-fab :menus="menus" @addGood="addGood" @addScale="addScale" @category="category"></hoprxi-drag-fab>
	</view>
</template>

<script>
	import catalog_test from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				scanResult: '',
				catalog: [],
				categories: [],
				tabCur: 0,
				scrollLeft: 0,
				btnArr: [{
					name: '删除',
					width: 200,
					background: '#ff5500',
					color: '#fff',
					event: 'del'
				}],
				fabPattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
				},
				menus: [{
					iconPath: '/static/workflow_icon/new.png',
					selectedIconPath: '/static/workflow_icon/new.png',
					text: '新增商品',
					event: 'addGood'
				}, {
					iconPath: '/static/workflow_icon/new_kg.png',
					selectedIconPath: '/static/workflow_icon/new_kg.png',
					text: '新增散秤',
					event: 'addScale'
				}, {
					iconPath: '/static/workflow_icon/count.png',
					selectedIconPath: '/static/workflow_icon/count.png',
					text: '商品类目',
					event: 'category'
				}]
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
		},
		created() {
			this.categories = catalog_test.category.map((x) => x);
			this.categories.splice(0, 0, {
				id: "-9999",
				name: "全部",
			});
			this.catalog = catalog_test.catalog;
		},
		onReady() {
			uni.hideLoading()
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
			addGood(data) {
				this.$util.navTo('/pages/workflow/catalog/good');
			},
			addScale(data) {
				this.$util.navTo('/pages/workflow/catalog/good');
			},
			category(data) {
				this.$util.navTo('/pages/workflow/catalog/category');
			},
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
			}
		}
	}
</script>

<style lang='scss'>
	.catalog {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.category {
		font-size: 150%;
		vertical-align: bottom;
	}

	.imageWrapper {
		width: 128rpx;
		height: 108rpx;
		display: flex;
		align-items: center;
	}

	.good-img {
		width: 98rpx;
		height: 98rpx;
	}
</style>
