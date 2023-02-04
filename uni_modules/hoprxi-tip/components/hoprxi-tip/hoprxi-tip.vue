<template>
	<view v-if="line_pattern === 'top'" :style="lineStyle"></view>
	<view class="flex justify-between align-center">
		<view class="flex align-center"
			:style="{padding:line_pattern === 'top'?'12rpx 0 0 12rpx':'0 0 12rpx 12rpx',fontSize:iconFont_size}">
			<text v-if="iconFont" :class="iconFont"></text>
			<image v-if="icon&&!iconFont" :src="icon" class="icon"></image>
			<text :style="titleStyle" class="margin-left-xs txt">{{ title.name }}</text>
		</view>
		<slot name="arrowSlot">
			<text v-if="arrow" class="cuIcon-right" @click="onArrowClick"></text>
		</slot>
	</view>
	<view v-if="line_pattern === 'bottom'" :style="lineStyle"></view>
</template>
<script>
	import {
		computed,
		onMounted
	} from "vue";
	export default {
		name: 'hoprxi-tip',
		props: {
			icon: String,
			iconFont: String,
			title: {
				type: Object,
				default: {
					name: '标题',
					size: 32,
					color: '#000',
					weight: 200
				}
			},
			arrow: Boolean,
			line: {
				type: Object,
				default: {
					pattern: 'solid', // solid-实线，dashed-方形虚线，dotted-圆点虚线
					color: '#000', //#8799a3
					position: 'bottom' // 位置：bottom-底，top-顶
				}
			}
		},
		setup(props, content) {
			const lineStyle = computed(() => {
				let style = {};
				// 如果是水平线条，边框高度为1px，再通过transform缩小一半，就是0.5px了
				style.borderBottom = '1rpx';
				style.borderBottomStyle = props.line.pattern || 'solid';
				//style.transform = 'scaleY(0.5)';
				style.borderColor = props.line.color || '#000';
				return style;
			});
			const titleStyle = computed(() => {
				let style = {};
				style.color = props.title.color || '#000';
				style.fontSize = (props.title.size || 32) + 'rpx';
				style.fontWeight = props.title.weight || 200;
				return style;
			});
			const line_pattern = props.line.position || 'bottom';
			const iconFont_size = (props.title.size || 32) + 16 + 'rpx';
			return {
				lineStyle,
				titleStyle,
				iconFont_size,
				line_pattern,
			}
		},
		methods: {
			onArrowClick() {
				this.$emit("arrowClick");
			}
		}
	}
</script>
<style lang="scss">
	.icon {
		width: 51rpx;
		height: 51rpx;
	}

	.txt {
		text-shadow: 2rpx 0rpx 2rpx rgba(0, 0, 0, .3);
	}
</style>
