<template>
	<view class="userInfo">
		<text class="back-txt iconfont icon-left_arrow" :class="'cuIcon-close'" @click="navBack">用户信息</text>
	</view>
</template>

<script>
	export default {
		methods: {
			navBack() {
				uni.navigateBack();
			},
		}
	}
</script>

<style scoped lang='scss'>
	.userInfo{
		padding-top: 15vh;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	
	.back-txt {
		position: absolute;
		left: 20rpx;
		top: calc(var(--status-bar-height) + 20rpx);
		z-index: 90;
		padding: 20rpx;
		font-size: 32rpx;
		color: #606266;
		text-align: center;
	}
</style>
