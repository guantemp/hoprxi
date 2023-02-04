<template>
	<view class="text-df">
		<hoprxi-navigation title="商品目录" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]"
			:titleFont="['#FFF','left',1200]" id="navBar" :surplusHeight="46">
			<template slot="extendSlot" class="cu-bar search">
				<view class="search-form radius" style="height:76rpx">
					<text class="cuIcon-search text-bold text-xl"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品条码/名称/拼音首字母"
						confirm-type="search" placeholder-class="text-df">
					<text class="cuIcon-scan text-blue text-bold text-xxl" @tap="scan"></text>
				</view>
				<view class="action text-white cuIcon-filter text-xxl" @tap="filterWindows = !filterWindows">
				</view>
			</template>
		</hoprxi-navigation>
		<hoprxi-dropdown :menus="categories" id="dropdown"></hoprxi-dropdown>
		<view v-if="catalog.length === 0" class="flex justify-center flex-direction align-center"
			:style="{height:'calc(100vh - ' + (navigatorHeight + dropdownHeight) + 'px)'}">
			<text class="cuIcon-like text-red text-xsl"></text>
			<text>吔、吔、切克闹...</text>
		</view>
		<scroll-view v-else scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height:'calc(100vh - ' + (navigatorHeight + dropdownHeight) + 'px)'}">
			<hoprxi-slider :buttons="buttons" :items="catalog" @del="del" @history="history" @favor="favor"
				@share="share" @click="navigationToDetail">
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
								产地：<text>{{item.madeIn}}</text>
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
		<hoprxi-drag-fab :menus="menus" @appendGood="$util.navTo('/pages/workflow/catalog/good?sign=good&action=new')"
			@appendScale="$util.navTo('/pages/workflow/catalog/good?sign=scale&action=new')"
			@editCategories="$util.navTo('/pages/workflow/catalog/category')"
			@recovery="$util.navTo('/pages/public/recovery')" @editBrands="$util.navTo('/pages/workflow/catalog/brand')">
		</hoprxi-drag-fab>
		<!-- 遮罩层-->
		<view :class="['mask',{'show':filterWindows}]" @tap="filterWindows = false"></view>
		<!-- 高级过滤对话框 -->
		<view class="drawerWindow" :class="{'show':filterWindows}" :style="{top:'calc(' + navigatorHeight + 'px)'}">
			<view class="flex"><text class="cuIcon-roundclose text-xl" @tap="filterWindows = false"></text><text
					class="flex-twice text-center">筛选</text> </view>
			<scroll-view scroll-y class="margin-top">
				<view class="flex justify-between padding-lr-xs">排序
					<view class="text-sm" @tap="sortExchange === 'asc'?sortExchange = 'desc':sortExchange ='asc'"
						:class="sortExchange === 'asc'?'text-red':'text-green'">
						<text
							:class="sortExchange === 'asc'?'icon-asc':'icon-desc'"></text>{{sortExchange === 'asc'?'升序':'降序'}}
					</view>
				</view>
				<view class="flex flex-wrap margin-bottom-sm">
					<block v-for="(sort,index) in sorts" :key="sort">
						<view :class="['lattice',{'selected':sort === selectedFilter[0]}]" @tap.top="sortChecked(sort)">
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
						<view :class="['lattice',{'selected':isCheckedBrand(brand)}]" @tap.top="brandChecked(brand)">
							<text>{{brand}}</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view class="bootom">
				<button class="cu-btn radius shadow bg-grey basis-sm" @tap.stop="restFilter">重置</button>
				<button class="cu-btn radius shadow bg-grey basis-sm margin-left-sm" @tap.stop="">确定</button>
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
					<text class="text-blue margin-top-xl text-sm">若出现误操作，请在回收站找回</text>
				</view>
				<view class="cu-bar">
					<view class="action margin-0 flex-sub text-green" @tap="delGoodModalDialog = false">取消</view>
					<view class="action margin-0 flex-sub solid-left" @tap="remove(selectedGood.id||selectedGood.plu)">
						确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reactive,
		ref,
		toRef,
		onBeforeMount,
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
				iconFont: 'cuIcon-goods',
				text: '新增商品',
				event: 'appendGood'
			}, {
				iconPath: '/static/workflow_icon/new_kg.png',

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
			let navigatorHeight = ref(0);
			let dropdownHeight = ref(0);

			let delGoodModalDialog = ref(false);
			let selectedGood = reactive({});
			const del = (data) => {
				delGoodModalDialog.value = true;
				selectedGood = {};
				if (data.id)
					selectedGood.id = data.id;
				else
					selectedGood.plu = data.plu;
				selectedGood.name = data.name.name
			};
			const remove = (key) => {
				//util.toast('模拟删除：' + key);//还没找到方法
				delGoodModalDialog.value = false;
			};

			const categories = reactive([]);
			const catalog = reactive([]);
			const brands = reactive([]);
			onBeforeMount(() => {
				ajax({ //categoryies
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
					//$util.toast(err);
				});
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
			const filterWindows = ref(false);
			const sorts = ['待审', '新品', '条码', '品名', '零售价', '毛利率', '规格', '会员价', 'VIP价', '异常'];
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
			return {
				navigatorHeight,
				dropdownHeight,
				scan,
				scanResult,
				buttons,
				menus,
				categories,
				catalog,
				showPrice,
				filterWindows,
				sorts,
				sortExchange,
				brands,
				selectedFilter,
				selectedGood,
				del,
				remove,
				delGoodModalDialog,
				restFilter
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
				//query复用得到单位是rpx,似乎不太准确,需要uni.createSelectorQuery().in(this)重新赋值
				query.select('#navBar').boundingClientRect().exec(rect => {
					this.navigatorHeight = rect[0].height;
				});
				uni.createSelectorQuery().select('#dropdown').boundingClientRect(res => {
					this.dropdownHeight += res.height;
				}).exec();
			})
			uni.hideLoading();
		},
		methods: {
			navigationToDetail(data) {
				if (data.id) this.$util.navTo('/pages/workflow/catalog/good?id=' + data.id + '&sign=good&action=edit');
				if (data.plu) this.$util.navTo('/pages/workflow/catalog/good?plu=' + data.plu + '&sign=scale&action=edit');
			},
			onLongPress(e) {
				console.log(e.currentTarget);
				console.log(e.target);
			},
			share(data) {
				this.$util.toast('分享：' + (data.id || data.plu));
			},

			history(data) {
				this.$util.toast('历史：' + (data.id || data.plu));
				console.log(data);
			},
			favor(data) {
				this.$util.toast('收藏：' + (data.id || data.plu));
			},
			sortChecked(sort) {
				this.selectedFilter[0] = sort
			},
			brandChecked(brand) {
				let brands = this.selectedFilter[2];
				let has = false;
				for (let i = 0, j = brands.length; i < j; i++) {
					if (brands[i] === brand) {
						this.selectedFilter[2].splice(i, 1);
						has = true;
						break;
					}
				}
				if (!has) this.selectedFilter[2].push(brand)
			},
			isCheckedBrand(brand) {
				for (const b of this.selectedFilter[2])
					if (b === brand) return true;
				return false;
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
