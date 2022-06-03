<template>
	<view class="flex flex-direction">
		<!--info-->
		<view class="user_info bg-gradual-purple">
			<image class="top-bg" src="/static/user_icon/user-bg.png"></image>
			<view class="flex align-center margin-left-sm margin-top-xs" @tap="this.$util.navTo(hasLogin?'/pages/user/userInfo':'/pages/user/login')">
				<image class="user_portrait_img" :src="userInfo.avatarUrl || '/static/user_icon/face.png'"></image>
				<view class="user_portrait_hasLogin" v-if="hasLogin">
					<text
						class="user_portrait_hasLogin_text">{{ userInfo.nickName || userInfo.username || '无名' }}</text>
					<text class="user_portrait_hasLogin_bonus">积分：{{userInfo.bonus}}</text>
				</view>
				<view class="user_portrait_noLogin_text" v-else >
					<text class="text-white" @tap="this.$util.navTo('/pages/user/login')">登录</text>
				</view>
			</view>
		</view>
		<view class="arc">
			<image class="arc-img" src="/static/user_icon/arc.png"></image>
		</view>
		<!--工资条-->
		<view class="pay">
			<hop-list-cell decorateIcon="/static/user_icon/pay.png" title="我的工资"
				@eventClick="this.$util.navTo(hasLogin?'':'/pages/user/login')" />
		</view>
		<!--个人服务-->
		<view class="service">
			<hop-list-cell decorateIcon="/static/user_icon/service.png" title="我的服务" arrow='true'/>
			<view class="cu-list grid col-3 no-border">
				<view class="cu-item " @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
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
	} from 'vuex'
	export default {
		data() {
			return {
				bonus: 9999,
			};
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

		}
	}
</script>

<style lang="scss">
	.user_info {
		position: relative;
		height: 350rpx;
		padding: 120rpx 0rpx 0rpx 20rpx;

		.top-bg {
			position: absolute;
			left: 0;
			top: 0rpx;
			min-width: 100vw;
			min-height: 100vh;
			filter: blur(2px);
			opacity: .7;
		}

		.user_portrait {
			display: flex;
			align-items: center;
			margin-left: 20rpx;
			margin-top: 10rpx;
			color: #FFF;
		}

		.user_portrait_img {
			margin-right: 20rpx;
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
		}

		.user_portrait_hasLogin {
			display: flex;
			flex-direction: column;
			font-size: 36rpx;
			font-weight: bold;
		}

		.user_portrait_hasLogin_text {
			font-size: 32rpx;
			font-weight: bold;
		}

		.user_portrait_hasLogin_bonus {
			padding: 10rpx 14rpx;
			margin-top: 10rpx;
			font-size: 20rpx;
			text-align: center;
			background-color: rgba(255, 255, 255, .3);
			border-radius: 40rpx;
		}

		.user_portrait_noLogin_text {
			font-size: 36rpx;
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
		height: 320rpx;
		border-radius: 20rpx;
		margin: 0rpx 20rpx;
		padding: 20rpx;
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
		;

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
