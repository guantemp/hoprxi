<template>
	<view class="flex flex-direction">
		<!--info-->
		<view class="user_info bg-gradual-purple">
			<view class="flex align-center margin-left-sm margin-top-xs">
				<image @tap="this.$util.navTo(hasLogin?'/pages/user/userInfo':'/pages/user/login')"
					:src="userInfo.avatarUrl || '/static/user_icon/face.png'"></image>
				<view class="user_portrait_hasLogin" v-if="hasLogin" @tap="this.$util.navTo('/pages/user/userInfo')">
					<text>{{ userInfo.nickName || userInfo.username || '无名' }}</text>
					<text class="bonus">积分：{{userInfo.bonus || 99999999}}</text>
				</view>
				<view class="text-white text-xl" @tap="this.$util.navTo('/pages/user/login')" v-else>登录</view>
			</view>
		</view>
		<view class="arc">
			<image class="arc-img" src="/static/user_icon/arc.png"></image>
		</view>
		<!--工资条-->
		<view class="pay">
			<hoprxi-tip icon="/static/user_icon/pay.png" :title="{name:'我的工资',weight:280}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" @arrowClick="$util.navTo(hasLogin?'':'/pages/user/login')" arrow/>
			<view style=" height: 180rpx;width: 60%;margin-top: 20rpx;">
				<qiun-data-charts type="arcbar" :opts="opts" :chartData="chartData" />
		</view>
	</view>
	<!--个人服务-->
	<view class="service">
		<hoprxi-tip icon="/static/user_icon/service.png" :title="{name:'我的服务',weight:280}"
			:line="{pattern:'dashed',color:'#d4e7ed'}"/>
		<view class="cu-list grid col-3 no-border">
			<view class="cu-item " @tap.stop="$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/notice.png" />
					<view class="cu-tag badge">
						<block>2</block>
					</view>
				</view>
				<text>公告</text>
			</view>
			<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/task.png" />
					<view class="cu-tag badge">
						<block>4</block>
					</view>
				</view>
				<text>任务中心</text>
			</view>
			<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/telecast.png" />
				</view>
				<text>直播</text>
			</view>
			<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/shopping.png" />
				</view>
				<text>商城</text>
			</view>
			<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/share.png" />
				</view>
				<text>分享</text>
			</view>
			<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
				<view class="text-red">
					<image class="grid_img" src="/static/user_icon/set.png" />
				</view>
				<text>设置</text>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import {
		reactive,
		onMounted,
	} from 'vue';
	export default {
		data() {
			return {
				chartData: {},
				opts: {
					animation: true,
					background: "#FFFFFF",
					padding: [5, 5, 5, 5],
					dataLabel: true,
					legend: {
						show: true,
						position: "bottom",
						lineHeight: 5
					},
					title: {
						name: '工资收入',
						color: '#000000',
						fontSize: 16,
						offsetY: 0,
					},
					subtitle: {
						name: '¥ 25168',
						color: '#333333',
						fontSize: 16,
						offsetY: 10,
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						data: [{
							min: 0
						}]
					},
					extra: {
						ring: {
							ringWidth: 40,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF",
						}
					}
				}
			}
		},
		onReady() {
			this.getServerData();
		},
		computed: {
			...mapState(['userInfo']),
			...mapGetters(['hasLogin']),
		},
		onShow() {
			this.$store.dispatch('getUserInfo');
			//console.log(this.$store.state.userInfo);
		},
		methods: {
			getServerData() {
				setTimeout(() => {
					let res = {
						"series": [{
							"data": [{
								"name": "一月",
								"value": 50
							}, {
								"name": "二月",
								"value": 19.98
							}, {
								"name": "三月",
								"value": 26.8
							}, {
								"name": "四月",
								"value": 26.8
							}, {
								"name": "五月",
								"value": 12.8
							}, {
								"name": "刘月",
								"value": 50
							}, {
								"name": "七月",
								"value": 19.98
							}, {
								"name": "捌月",
								"value": 26.8
							}, {
								"name": "玖月",
								"value": 26.8
							}, {
								"name": "十月",
								"value": 12.8
							}, {
								"name": "十以月",
								"value": 26.8
							}, {
								"name": "十二月",
								"value": 12.8
							}]
						}]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}, 500);
			}
		}
	}
</script>

<style lang="scss">
	.charts-box {}

	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.user_info {
		position: relative;
		height: 350rpx;
		padding: 120rpx 0rpx 0rpx 0rpx;

		.top-bg {
			position: absolute;
			left: 0;
			top: 0rpx;
			min-width: 100vw;
			min-height: 100vh;
			filter: blur(2px);
			opacity: .7;
		}

		image {
			margin: 0 20rpx;
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
		}

		.user_portrait_hasLogin {
			display: flex;
			flex-direction: column;
			font-size: 36rpx;
			font-weight: bold;

			.bonus {
				padding: 10rpx 24rpx;
				margin-top: 10rpx;
				font-size: 20rpx;
				background-color: rgba(255, 255, 255, .3);
				border-radius: 40rpx;
			}
		}
	}

	.arc {
		height: 8rpx;

		.arc-img {
			top: -34upx;
			width: 100vw;
			height: 36upx;
		}
	}

	.pay {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		margin: 0rpx 10rpx;
		padding: 0rpx 10rpx;
		background-color: #FFFFFF;

		.img {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.service {
		display: flex;
		flex-direction: column;
		height: 460rpx;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;

		.grid_img {
			width: 80rpx;
			height: 80rpx;
		}

		.grid-text {
			font-size: 28rpx;
			margin-top: 4rpx;
		}
	}
</style>
