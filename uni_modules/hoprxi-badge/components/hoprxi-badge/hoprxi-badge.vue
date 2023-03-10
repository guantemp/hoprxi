<template>
	<view class="badge">
		<slot></slot>
		<view v-if="count == 0" class="badge-dot" :style="{backgroundColor:bgColor}" @click="onClick()"></view>
		<view v-else-if="count <= maxCount" class="badge-count" :class="left?'left':'right'"
			:style="{backgroundColor:bgColor}" @click="onClick()">
			{{count}}
		</view>
		<view v-else class="badge-count" :class="left?'left':'right'" :style="{backgroundColor:bgColor}"
			@click="onClick()">{{finalCount}}</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		computed,
		watch
	} from 'vue';
	export default {
		name: 'hoprxi-badge',
		props: {
			count: {
				type: String,
				default: ''
			},
			left: {
				type: Boolean,
				default: false,
			},
			bgColor: {
				type: String,
				default: '#8799a3'
			}
		},
		setup(props, content) {
			const maxCount = 99;
			const finalCount = computed(() => {
				return props.count > maxCount ? `${maxCount}+` : props.count
			});
			const onClick = () => {
				content.emit('click');
			};
			return {
				maxCount,
				finalCount,
				onClick
			}
		},
	}
</script>

<style lang="scss">
	.badge {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	.badge-count {
		position: absolute;
		top: -9px;
		min-width: 16px;
		min-height: 14px;
		line-height: 14px;
		border-radius: 100px;

		text-align: center;
		padding: 0 5px;
		font-size: 9px;
		color: #ffffff;

		white-space: nowrap;
		z-index: 2;

		&.left {
			transform: translateX(-35%);
			left: 0;
		}

		&.right {
			transform: translateX(-15%);
			right: 0;
		}
	}


	.badge-dot {
		position: absolute;
		transform: translateX(-15%);
		top: -8px;
		right: 0;
		min-height: 8px;
		min-width: 8px;
		border-radius: 100%;

		z-index: 2;
		box-shadow: 0 0 0 1rpx #fff;
	}

	/*
	.badge-dot:not([class*="bg-"]) {
		background-color: #dd514c;
	}
*/
</style>
