<template>
	<view class="badge">
		<slot></slot>
		<view class="badge-dot" v-if="dot&&count!==0"></view>
		<view class="badge-count" v-else-if="count" @click="onClick()">{{count}}</view>
		<view class="badge-count" v-else @click="onClick()">{{finalCount}}</view>
	</view>
</template>

<script>
	export default {
		name: 'hoprxi-badge',

		data() {
			return {
				maxCount: 99,
			}
		},
		props: {
			count: {
				type: String,
				default: ''
			},
			dot: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: ''
			}
		},
		setup(props, content) {

		},
		computed: {
			finalCount() {
				return this.count > this.maxCount ? `${this.maxCount}+` : this.count
			}
		},
		methods: {
			onClick() {
				//this.badgeStyle = `width: ${String(this.text).length * 8 + 12}px`
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss">
	.badge {
		position: relative;
		display: inline-block;
	}

	.badge-count {
		position: absolute;
		transform: translateX(95%);
		top: -8rpx;
		right: 1rpx;
		min-width: 32rpx;
		min-height: 28rpx;
		line-height: 28rpx;
		border-radius: 200rpx;

		text-align: center;
		padding: 0 10rpx;
		font-size: 18rpx;
		color: #ffffff;

		white-space: nowrap;
		z-index: 2;
	}

	.badge-count:not([class*="bg-"]) {
		background-color: #dd514c;
	}

	.badge-dot {
		position: absolute;
		transform: translateX(95%);
		top: -8rpx;
		right: 0rpx;
		min-height: 16rpx;
		min-width: 16rpx;
		border-radius: 100%;

		z-index: 10;
		box-shadow: 0 0 0 1rpx #fff;
	}

	.badge-dot:not([class*="bg-"]) {
		background-color: #dd514c;
	}
</style>
