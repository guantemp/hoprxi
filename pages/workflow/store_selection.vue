<template>
	<view class="store">
		<!-- :backgroundColor="[1, ['#24bdab', '#80c54c', 45]]"  or :backgroundColor="['#80c54c']  btnType="tower" tabPage="/pages/index/index"-->
		<hoprxi-navigation :backgroundColor="[1, ['#9000ff', '#5e00ff', 45]]" :titleFont="['#FFF','center']"
			placeholder="请输入门店名称/全拼/首字母">
		</hoprxi-navigation>
		<view class="indexes" >
			<view class="current text-df">
				<hop-list-cell title="当前门店" titleColor="#ff9700" :arrow="false" borderStyle="dashed" />
				<view class="currentShop text-lg">
					<text>{{currentShop}}</text>
					<view @click="authorizedPositioningPromise">
						<text class='cuIcon-locationfill text-orange margin-right-xs'></text>
						<text class="text-olive">重新定位</text>
					</view>
				</view>
			</view>
			<view class="footprint">
				<hoprxi-cell decorateIconClass="cuIcon-footprint" title="历史足迹" borderStyle="dashed">
				</hoprxi-cell>
				<view class="footprintShops">
					<block v-for="(item, index) in shops" :key="index">
						<view class="item" @click="selectShop(item.value)" :data-id="item.value">
							<text>{{item.name}}</text>
						</view>
					</block>
				</view>
			</view>
			<view class="bg-white nav margin-top-xs">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index===TabCur?'text-orange cur':''"
						v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
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
		<scroll-view scroll-y>
			<view>
				<block v-for="(item,index) in list" :key="index">
					<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.index">
						<view class="padding-xs">{{item.name}}</view>
						<view class="cu-list menu-avatar no-padding">
							<view class="cu-item" v-for="(shop,sub) in item.shops" :key="sub">
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
			</view>
		</scroll-view>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + navBar + 'px - 50px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="item.index"
					@touchstart="getCur" @touchend="setCur">
					{{item.index}}
				</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentShop: '旺客隆关口店',
				shops: [{
					name: '旺客隆国美绿洲店我能不知道',
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
				}, {
					name: '安心良品',
					address: '向阳花香小区负一楼',
					id: 6
				}, {
					name: '汇通龙南路店',
					id: 7,
					address: '龙马潭区陇南路44号',
				}, {
					name: '喜佳佳超市',
					address: '福集镇龙老路36号',
					id: 8
				}, {
					name: '家乐购超市',
					address: '福集镇花园干道336号',
					id: 9
				}],
				tabList: ['区域检索', '拼音检索'],
				pinyin: [{
					index: 'W',
					name: 'W',
					include: [1, 3, 5]
				}, {
					index: 'H',
					name: 'H',
					include: [10034, 1546]
				}],
				area: [{
					index: '江',
					name: '江阳区',
					include: [1, 3, 5]
				}, {
					index: '龙',
					name: '龙马潭区',
					include: [10034, 1546]
				}, {
					index: '泸',
					name: '泸县',
					include: [10034, 1546]
				}, {
					index: '纳',
					name: '纳溪区',
					include: [10034, 1546]
				}, {
					index: '合',
					name: '合江县',
					include: [10034, 1546]
				}, {
					index: '叙',
					name: '叙永县',
					include: [10034, 1546]
				}, {
					index: '古',
					name: '古蔺县',
					include: [10034, 1546]
				}],
				TabCur: 0,
				navBar: 60,
				hidden: true,
				listCurID: '',
				list: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'S', 'W', 'X', 'Y', 'Z'],
				listCur: '',
			};
		},
		onLoad() {
			let list = [{
				index: '江',
				name: '江阳区',
				shops: [{
					name: '旺客隆环城中心店',
					value: 10034
				}, {
					name: '步步高江阳公园店',
					value: 1733
				}, {
					name: '安心良品',
					value: 1546
				}]
			}, {
				index: '龙',
				name: '龙马潭区',
				shops: [{
					name: '旺客隆国美绿洲店',
					value: 10034,
					address: '龙马潭区龙马大道一段25号'
				}, {
					name: '步步高国美绿洲店',
					value: 1733,
					address: '龙马潭区龙马大道一段25号'
				}, {
					name: '旺客隆关口店',
					value: 1733
				}, {
					name: '嘉诚超市',
					value: 1546
				}, {
					name: '汇通龙南路店',
					value: 15246
				}]
			}, {
				index: '纳',
				name: '纳溪区',
				shops: [{
					name: '旺客隆纳溪店',
					value: 10034
				}, {
					name: '汇通纳溪店',
					value: 15246
				}]
			}, {
				index: '泸',
				name: '泸县',
				shops: [{
					name: '盛源超市',
					value: 210034
				}, ]
			}, {
				index: '合',
				name: '合江县'
			}, {
				index: '叙',
				name: '叙永县'
			}, {
				index: '古',
				name: '古蔺县'
			}];
			this.list = list;
			this.listCur = this.list[0];
		},
		onReady() {
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		methods: {
			authorizedPositioningPromise() {
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
												_that.$util.toast("获取位置失败，请手动选择。");
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
								// 无网络
								reject("noNetWork");
							} else {
								// 请求超时'
								reject("requestTimeOut");
							}
						}
					})
				});
				promise.then((latitude, longitude) => {
					this.$util.toast('当前位置的经度：' + longitude + '\n当前位置的纬度：' + latitude);
				})
			},
			//获取位置
			location() {
				uni.getLocation({
					type: 'gcj02', //gcj02//wgs84
					success: res => {
						this.$util.toast('当前位置的经度：' + res.longitude + '\n当前位置的纬度：' + res.latitude);
					},
					fail: res => {
						this.$util.toast("获取位置失败，请手动选择。");
					},
				});
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			selectShop(id) {
				console.log(id);
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
	.store {
		width: 100vw;
		background-color: #F8F8F8;
	}

	.current {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 16rpx;
		background-color: #FFF;
		margin: 0rpx 16rpx 8rpx 16rpx;

		.currentShop {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 20rpx 4rpx 20rpx;
		}
	}

	.footprint {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 12rpx 16rpx;
		background-color: #FFF;
		margin: 8rpx 16rpx 0rpx 16rpx;

		.footprintShops {
			display: flex;
			padding: 16rpx 2rpx 10rpx 2rpx;

			.item {
				/*以下3项设置上下左右居中*/
				display: flex;
				justify-content: center;
				text-align: center;
				flex: 0 0 33%;
				margin-right: calc(5rpx*3 /2);
				border: 2rpx solid #9b9b9b;
				border-radius: 6rpx;
				background-color: #8799a3;

				/*设置上下左右居中*/
				>text {
					margin: auto;
				}
			}
		}
	}

	.indexes {
		position: relative;
		margin-top: 20rpx;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
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
