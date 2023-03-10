<template>
	<view v-if="line_pattern === 'top'" :style="lineStyle"></view>
	<view class="flex justify-between align-center">
		<view class="flex align-center" :style="{padding:line_pattern === 'top'?'6px 0 0 0':'0 0 6px 6px'}">
			<text v-if="iconFont" :class="iconFont" :style="{fontSize:iconFont_size}"></text>
			<image v-if="icon&&!iconFont" :src="icon" class="icon"></image>
			<text :style="titleStyle" :class="{'margin-left-xs':icon||iconFont}">{{ title.name }}</text>
		</view>
		<slot>
			<text v-if="arrow" class="cuIcon-right" @click="onArrowClick"></text>
		</slot>
	</view>
	<view v-if="line_pattern === 'bottom'" :style="lineStyle"></view>
</template>
<script>
	import {
		computed,
	} from "vue";
	export default {
		name: 'hoprxi-cell',
		props: {
			icon: String,
			iconFont: String,
			title: {
				type: Object,
				default: {
					name: '标题',
					size: 16,
					color: '#000',
					weight: 350
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
				style.borderBottom = '1px';
				style.borderBottomStyle = props.line.pattern || 'solid';
				//style.transform = 'scaleY(0.5)';
				style.borderColor = props.line.color || '#000';
				return style;
			});
			const titleStyle = computed(() => {
				let style = {};
				style.color = props.title.color || '#000';
				style.fontSize = (props.title.size || 16) + 'px';
				if (props.title.weight) style.fontWeight = props.title.weight;
				return style;
			});
			const line_pattern = props.line.position || 'bottom';
			const iconFont_size = (props.title.size || 16) + 4 + 'px';
			const onArrowClick = () => {
				content.emit("arrowClick");
			};
			return {
				lineStyle,
				titleStyle,
				iconFont_size,
				line_pattern,
				onArrowClick
			}
		}
	}
</script>
<style lang="scss">
	.icon {
		width: 51rpx;
		height: 51rpx;
	}
</style>
