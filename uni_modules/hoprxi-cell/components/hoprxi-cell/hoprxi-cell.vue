<template>
	<view class="cell">
		<view v-if="isTop" class="line" :style="[lineStyle]" />
		<view class="show" :style="{padding:isTop?'0rpx 0rpx 0rpx 0rpx':'0 16rpx 16rpx 16rpx'}">
			<view class="decorate">
				<slot name="decorateIconSlot">
					<image v-if="decorateIcon && !isTop &&!decorateIconClass" class="decorateIcon" :src="decorateIcon">
					</image>
					<text v-if="decorateIconClass && !isTop" class="margin-right-xs" :class="decorateIconClass"></text>
					<!-- 线在顶上不显示-->
				</slot>
				<text
					:style="{color:textDecorate.color,'fontSize':textDecorate.size + 'rpx','fontWeight':textDecorate.weight}">{{ title }}</text>
			</view>
			<slot name="executableSlot">
				<text v-if="arrow" class="cuIcon-right text-gray" @click="executable"></text>
			</slot>
		</view>
		<view v-if="!isTop" class="line" :style="[lineStyle]" />
	</view>
</template>

<script>
	import {
		onMounted
	} from "vue";
	export default {
		name: 'hoprxi-cell',
		props: {
			decorateIcon: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: ''
			},
			iconFont: {
				type: String,
				default: ''
			},
			decorateIconClass: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '标题'
			},
			titleFont: {
				type: Array,
				//字体选项：颜色，大小,粗细
				//比如：['#000', 28, 400]
				default: []
			},
			arrow: {
				type: Boolean,
				default: false
			},
			line: {
				type: Array,
				//['solid', '#e4e7ed', "bottom"]
				// 线条的类型，solid-实线，dashed-方形虚线，dotted-圆点虚线
				// 颜色
				// 位置：bottom-底，top-顶
				default: []
			}
		},
		setup(props, content) {
			let isTop = false;
			let textDecorate = {
				color: '#000',
				size: 28,
				weight: 400
			};
			let lineDecorate = {
				style: 'solid',
				color: '#e4e7ed',
				postion: 'bottom'
			};
			const init = () => {
				if (Array.isArray(props.line)) {
					if (props.line.length === 1) {
						lineDecorate.style = props.line[0];
					} else if (props.line.length === 2) {
						lineDecorate.style = props.line[0];
						lineDecorate.color = props.line[1];
					} else if (props.line.length === 3) {
						lineDecorate.style = props.line[0];
						lineDecorate.color = props.line[1];
						if (props.line[2] === 'top') isTop = true;
					}
				}
				if (Array.isArray(props.titleFont)) {
					if (props.titleFont.length === 1) {
						textDecorate.color = props.titleFont[0]
					} else if (props.titleFont.length === 2) {
						textDecorate.color = props.titleFont[0]
						textDecorate.size = props.titleFont[1]
					} else if (props.titleFont.length === 3) {
						textDecorate.color = props.titleFont[0]
						textDecorate.size = props.titleFont[1]
						textDecorate.weight = props.titleFont[2]
					}
				}
			};
			onMounted(init);
			return {
				isTop,
				textDecorate,
				lineDecorate
			}
		},
	
		methods: {
			executable(event) {
				this.$emit('executable');
			},
		},
		created() {
			if (Array.isArray(this.line)) {
				if (this.line.length === 1) {
					this.lineDecorate.style = this.line[0];
				} else if (this.line.length === 2) {
					this.lineDecorate.style = this.line[0];
					this.lineDecorate.color = this.line[1];
				} else if (this.line.length === 3) {
					this.lineDecorate.style = this.line[0];
					this.lineDecorate.color = this.line[1];
					if (this.line[2] === 'top') this.isTop = true;
				}
			}
			if (Array.isArray(this.titleFont)) {
				if (this.titleFont.length === 1) {
					this.textDecorate.color = this.titleFont[0]
				} else if (this.titleFont.length === 2) {
					this.textDecorate.color = this.titleFont[0]
					this.textDecorate.size = this.titleFont[1]
				} else if (this.titleFont.length === 3) {
					this.textDecorate.color = this.titleFont[0]
					this.textDecorate.size = this.titleFont[1]
					this.textDecorate.weight = this.titleFont[2]
				}
			}
			//console.log(this.isTop)
		},
		computed: {
			lineStyle() {
				let style = {};
				//style.margin = this.margin;
				// 如果是水平线条，边框高度为1px，再通过transform缩小一半，就是0.5px了
				// 此处采用兼容分开写，兼容nvue的写法
				style.borderBottomWidth = '1px';
				style.borderBottomStyle = this.lineDecorate.style;
				//style.width = this.$u.addUnit(this.length);
				//if (this.hairLine) style.transform = 'scaleY(0.5)';
				style.borderColor = this.lineDecorate.color;
				return style;
			}
		}
	};
</script>

<style lang="scss">
	.cell {
		display: flex;
		flex-direction: column;
		background-color: #FFF;
	}

	.show {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.decorate {
			display: flex;
			align-items: center;
		}

		.decorateIcon {
			width: 48rpx;
			height: 48rpx;
			margin-right: 18rpx;
		}

		.executable {
			width: 36rpx;
			height: 36rpx;
		}
	}

	.line {
		vertical-align: middle;
		border-bottom: solid 1rpx #f6f6f6;
	}
</style>
