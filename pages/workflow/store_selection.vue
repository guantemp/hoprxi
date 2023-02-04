<template>
	<!-- :backgroundColor="[1, ['#24bdab', '#80c54c', 45]]"  or :backgroundColor="['#80c54c']  btnType="tower" tabPage="/pages/index/index"-->
	<hoprxi-navigation id="navigation" :backgroundColor="[1, ['#9000ff', '#5e00ff', 45]]" :titleFont="['#FFF','center']"
		placeholder="请输入门店拼音首字/名称" @searchConfirm="serach">
	</hoprxi-navigation>
	<view id="currentShop" class="flex flex-direction padding-tb">
		<hoprxi-tip :title="{name:'当前门店',weight:300}" :line="{pattern:'dashed',color:'#d4e7ed'}" />
		<view class="flex justify-between margin-top-sm padding-lr-sm">
			<text>{{currentShop.name}}</text>
			<view @click="authorizedPositioningPromise">
				<text class='cuIcon-locationfill text-orange margin-right-xs'></text>
				<text class="text-olive">重新定位</text>
			</view>
		</view>
	</view>
	<view class="footprint">
		<hoprxi-tip iconFont="cuIcon-footprint" :title="{name:'足迹',weight:280}"
			:line="{pattern:'dashed',color:'#d4e7ed'}" />
		<view class="shops">
			<block v-for="(shop, index) in historyShops" :key="index">
				<view class="item" @click="selectShop(shop.id)" :data-id="shop.id">
					<text>{{shop.name}}</text>
				</view>
			</block>
		</view>
	</view>
	<view class="nav flex text-center">
		<view class="cu-item flex-sub" :class="{'text-orange cur':index === tabCur}" v-for="(tab,index) in tabList"
			:key="tab" @tap="tabSelect" :data-id="index">
			{{tab}}
		</view>
	</view>
	<!--
			<swiper :current="TabCur3" class="swiper" duration="300" :circular="true"
				indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)"
				@change="swiperChange3">
				<swiper-item v-for="(item,index) in tabList3" :key="index">
					<div class="bg-white padding margin text-center text-black">{{item.name}}</div>
				</swiper-item>
			</swiper>
			-->
	<scroll-view scroll-y :style="{height:'calc(100vh - ' + excludeListHeight + 'px)'}">
		<block v-for="(item,index) in list" :key="index">
			<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.index">
				<view class="padding-xs">{{item.name}}</view>
				<view class="cu-list menu-avatar no-padding">
					<view class="cu-item" v-for="(shop,sub) in item.shops" :key="sub" @click="selectShop(shop.id)">
						<view class="cu-avatar round lg">{{item.index}}</view>
						<view class="content">
							<view class="text-grey">{{shop.name}}
							</view>
							<view class="text-gray text-sm">
								{{shop.address}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</scroll-view>
	<view class="indexBar" :style="[{top:'calc(100vh - ' + excludeListHeight + 'px + 24px)'}]">
		<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
			<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="item.index" @touchstart="getCur"
				@touchend="setCur">
				{{item.index}}
			</view>
		</view>
	</view>
	<!--选择显示-->
	<view v-show="!hidden" class="indexToast">
		{{listCur}}
	</view>
	<!--最近店铺对话框-->
	<view class="cu-modal" :class="{'show':shopModalDialog}" @tap="shopModalDialog = false;">
		<view class="cu-dialog" @tap.stop="">
			<view class="solid-bottom line-blue padding text-left text-lg align-center">
				<text class="cuIcon-message margin-right-sm "></text>附近门店
			</view>
			<block v-for="(shop,index) in closestDistanceShops" :key="shop.id">
				<view class="flex justify-between padding-lr-sm padding-tb-xs text-left dashed-bottom bg-white"
					:class="{'text-green text-bold': checkedShop === shop.id}" @tap="check(shop.id)">
					<view>{{shop.name}}<br />
					<text class="text-gray text-sm"
						v-if="shop.distance < 0.001">距离{{Math.round(shop.distance*1000)/1000}}米</text>
						<text class="text-gray text-sm"
							v-else-if="shop.distance > 1">距离{{Math.round(shop.distance*100)/100}}千米</text>
						<text v-else class="text-gray text-sm">距离{{Math.round(shop.distance*1000)}}米</text>
					</view>
					<text class="cuIcon-check text-xl" v-if="checkedShop === shop.id"></text>
				</view>
			</block>
			<view class="cu-bar line-orange solid-top">
				<view class="action margin-0 flex-sub text-green align-center" @tap="hidePrintRadioModalDialog">
					<text class="icon-print-setting margin-right-sm"></text>添加新店
				</view>
				<view class="action margin-0 flex-sub  solid-left" @tap="hidePrintRadioModalDialog">确认选择</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		onBeforeMount,
		watchEffect
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	export default {
		setup(props, content) {
			const shops = [{
				name: '旺客隆国美绿洲店',
				address: '龙马潭区龙马大道一段25号',
				location: {
					longitude: 105.44049805527185,
					latitude: 28.91422689723395
				},
				id: 1
			}, {
				name: '嘉诚超市',
				address: '龙马潭区龙马大道三段9号',
				location: {
					longitude: 105.44781307580288,
					latitude: 28.919657840300605
				},
				id: 2
			}, {
				name: '旺客隆纳溪店',
				address: '纳溪区云溪西路23号',
				id: 3
			}, {
				name: '盛源超市',
				address: '福集镇明星路76号',
				location: {
					longitude: 105.37603713392744,
					latitude: 29.155733003496554
				},
				id: 4
			}, {
				name: '旺客隆环城中心店',
				address: '江阳区一品天下大街65号',
				id: 5
			}, {
				name: '安心良品',
				address: '向阳花香小区负一楼',
				id: 6
			}, {
				name: '汇通龙南路店',
				id: 7,
				address: '龙马潭区陇南路44号',
				location: {
					longitude: 103.73140693135235,
					latitude: 29.564598170984794
				},
			}, {
				name: '喜佳佳超市',
				address: '福集镇龙老路36号',
				location: {
					longitude: 105.45450921695932,
					latitude: 28.90826231833892
				},
				id: 8
			}, {
				name: '家乐购超市',
				address: '福集镇花园干道336号',
				location: {
					longitude: 105.37603713392744,
					latitude: 29.156783003496554
				},
				id: 9
			}];
			const historyShops = reactive([{
				name: '旺客隆国美绿洲店',
				address: '龙马潭区龙马大道一段25号',
				id: 1
			}, {
				name: '嘉诚超市',
				address: '龙马潭区龙马大道三段9号',
				id: 2
			}, {
				name: '旺客隆纳溪店',
				address: '纳溪区云溪西路23号',
				id: 3
			}, {
				name: '盛源超市',
				address: '福集镇明星路76号',
				id: 4
			}, {
				name: '旺客隆环城中心店',
				address: '江阳区一品天下大街65号',
				id: 5
			}]);
			/*
			onBeforeMount(() => {
				ajax({
					url: 'https://hoprxi.tooo.top/hr/v1/shops',
				}).then(res => {
					console.log(res.data)
				}).catch(error => {
					console.log(error);
					$util.toast(err);
				})
			});
			*/
			const currentShop = reactive({});
			const closestDistanceShops = reactive([]);
			let shopModalDialog = ref(false);
			let excludeListHeight = ref(0);
			const tabList = ['按区域检索', '按拼音检索'];
			let tabCur = ref(0);
			const pinyins = [{
				index: 'J',
				name: 'J',
				include: [9, 2]
			}, {
				index: 'W',
				name: 'W',
				include: [1, 3, 5]
			}];
			const regions = [{
				index: '江',
				name: '江阳区',
				include: [5, 6]
			}, {
				index: '龙',
				name: '龙马潭区',
				include: [1, 2, 7]
			}, {
				index: '泸',
				name: '泸县',
				include: [8, 9, 4]
			}, {
				index: '纳',
				name: '纳溪区',
				include: [3]
			}];
			const list = reactive([]);
			let listCur = ref(0);
			watchEffect(() => {
				let datas = [];
				if (tabCur.value === 0)
					datas = regions;
				else if (tabCur.value === 1)
					datas = pinyins;
				list.length = 0;
				for (const data of datas) {
					let temp = {
						index: data.index,
						name: data.name
					}
					let sub = [];
					for (const id of data.include) {
						for (const shop of shops) {
							if (id === shop.id) {
								sub.push(shop);
								break;
							}
						}
					};
					list.push({
						...temp,
						shops: sub
					})
				}
			});
			return {
				shops,
				currentShop,
				closestDistanceShops,
				historyShops,
				tabList,
				tabCur,
				excludeListHeight,
				list,
				listCur,
				shopModalDialog
			}
		},
		data() {
			return {
				hidden: true,
				listCurID: '',
			};
		},
		onReady() {
			let query = uni.createSelectorQuery().in(this);
			query.select('#navigation').boundingClientRect().exec(res => {
				this.excludeListHeight = res[0].height;
			});
			uni.createSelectorQuery().select('#currentShop').boundingClientRect(res => {
				this.excludeListHeight += res.height;
			}).exec();
			uni.createSelectorQuery().select('.footprint').boundingClientRect(res => {
				this.excludeListHeight += res.height;
			}).exec();
			uni.createSelectorQuery().select('.nav').boundingClientRect(res => {
				this.excludeListHeight += res.height;
			}).exec();
		},
		methods: {
			serach(event) {
				console.log(event)
			},
			authorizedPositioningPromise() {
				/*
				const promise = new Promise((resolve, reject) => {
					let _that = this;
					uni.getSystemInfo({
						success({
							locationEnabled, // locationEnabled 判断手机定位GPS服务是否开启
							locationAuthorized // locationAuthorized 判断GPS定位服务是否允许微信授权
						}) {
							if (!locationEnabled && !locationAuthorized) {
								reject("GPSnotOpen");
							} else if (locationEnabled && !locationAuthorized) {
								reject("GPSauthorization");
							} else if (locationEnabled && locationAuthorized) {
								uni.authorize({
									scope: "scope.userLocation",
									success() { // 微信小程序位置信息已开启
										uni.getLocation({
											type: 'gcj02', //gcj02//wgs84
											success: res => {
												resolve(res);
											},
											fail: res => {
												_that.$util.toast(
													"获取位置失败，请在已登记门店中手动选择。");
											},
										});
									},
									fail() {
										reject("weixinPositionNotOpen");
									}
								})
							}
						},
						fail(err) {
							let reg = /request:fail/;
							if (reg.test(err.errMsg)) {
								reject("noNetWork"); // 无网络
							} else {
								reject("requestTimeOut"); // 请求超时'
							}
						}
					})
				});
				promise.then((latitude, longitude) => {
					this.$util.toast('当前位置的经度：' + longitude + '\n当前位置的纬度：' + latitude);
				})
				*/
				let longitude = 103.72420901376067;
				let latitude = 29.562548948220435;
				this.closestDistanceShops.length = 0;
				for (const shop of this.shops) {
					if (shop.location) {
						let distance = this.distance(longitude, latitude, shop.location.longitude, shop.location
							.latitude);
						this.closestDistanceShops.push({
							id: shop.id,
							name: shop.name,
							distance: distance
						})
						this.closestDistanceShops.sort((a, b) => {
							return a.distance - b.distance
						})
					}
				}
				let length = this.closestDistanceShops.length;
				if (length >= 5)
					this.closestDistanceShops.splice(5, this.closestDistanceShops.length)
				if (length > 0 && this.closestDistanceShops[0].distance > 0.05) {
					this.closestDistanceShops.splice(4, 1)
				}
				if (this.closestDistanceShops.length <= 4)
					this.closestDistanceShops.splice(0, 0, {
						id: -1,
						name: '当前位置',
						distance: 0.001
					})
				this.shopModalDialog = true;
			},
			distance(la1, lo1, la2, lo2) { //longitude,latitude
				var La1 = la1 * Math.PI / 180.0;
				var La2 = la2 * Math.PI / 180.0;
				var La3 = La1 - La2;
				var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2), Math.cos(La1) * Math.cos(La2) * Math.pow(
					Math.sin(Lb3 / 2), 2)));
				s = s * 6378.137; //地球半径  
				s = Math.round(s * 10000) / 10000;
				return s;
			},
			selectShop(id) {
				for (const shop of this.shops) {
					if (id === shop.id) {
						this.currentShop.id = id;
						this.currentShop.name = shop.name;
						this.currentShop.location = shop.location
						break;
					}
				}
				let pages = getCurrentPages();
				//let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// #ifdef H5
				prevPage.$vm.shop = this.currentShop;
				// #endif
				// #ifdef MP-WEIXIN
				prevPage.setData({
					shop: this.currentShop
				});
				// #endif
				//uni.navigateBack(); //返回上一个页面
			},
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},

			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].index
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name
				};
			},
			//触发全部开始选择
			tStart() {
				this.hidden = false
			},
			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			}
		}
	}
</script>

<style lang='scss'>
	.footprint {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 12rpx;
		background-color: #1cbbb4;
		margin: 0 9rpx;

		.shops {
			display: flex;
			flex-wrap: wrap;
			margin-top: 18rpx;

			.item {
				/*以下3项设置上下左右居中*/
				display: flex;
				justify-content: center;
				text-align: center;
				flex: 0 0 32.2%;
				padding: 2rpx;
				margin-right: calc(5.2rpx*3 /2);
				margin-bottom: 8rpx;
				border: 2rpx solid #9b9b9b;
				border-radius: 12rpx;
				background-color: #f37b1d;

				/*重要：设置上下左右居中，必须的*/
				>text {
					margin: auto;
				}
			}
		}
	}

	.indexBar {
		position: fixed;
		right: 2px;
		padding: 20rpx 20rpx 20rpx 60rpx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #f8f8f8;
		display: flex;
		flex-direction: column;
		padding: 10rpx 0rpx;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
