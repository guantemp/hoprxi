<template>
	<view id="draggable" @touchmove.stop.prevent="touchmove" @touchend="touchend" @click.stop.prevent="click"
		class="drag" :class="{'transition': isDock&!isMoved ,'border-radius':radius}"
		:style="[{left:left + 'px', top:top + 'px',width:size + 'rpx',height:size+'rpx'},{styles}]">
		<slot><text>哈师大</text></slot>
	</view>
</template>

<script>
	export default {
		name: 'hoprxi-drag-button',
		props: {
			size: {
				type: Number,
				default: 99
			},
			styles: {
				type: String,
				default: ''
			},
			radius: Boolean,
			isDock: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
				offsetWidth: 0,
				offsetHeight: 0,
				windowWidth: 0,
				windowHeight: 0,
				isMoved: true,
				edge: 15,
			}
		},
		mounted() {
			const sys = uni.getSystemInfoSync();
			this.windowWidth = sys.windowWidth;
			this.windowHeight = sys.windowHeight;
			// #ifdef APP-PLUS
			this.existTabBar && (this.windowHeight -= 50);
			// #endif
			if (sys.windowTop) {
				this.windowHeight += sys.windowTop;
			}
			const query = uni.createSelectorQuery().in(this);
			query.select('#draggable').boundingClientRect(res => {
				this.width = res.width;
				this.height = res.height;
				this.offsetWidth = res.width / 2;
				this.offsetHeight = res.height / 2;
				this.left = this.windowWidth - this.width - this.edge * 3;
				this.top = this.windowHeight - this.height - this.edge * 3;
			}).exec();
			/*
			query.select('#navBar').boundingClientRect().exec(res => {
				this.setFixedHeight(res[0].height);
			});
			*/
		},
		methods: {
			click() {
				this.$emit('click');
			},
			touchmove(event) {
				if (event.touches.length !== 1) { // 单指触摸
					return false;
				}
				this.isMoved = true;
				this.left = event.touches[0].clientX - this.offsetWidth;
				let clientY = event.touches[0].clientY - this.offsetHeight;
				// #ifdef H5
				clientY += this.height;
				// #endif
				let edgeBottom = this.windowHeight - this.height - this.edge;
				// 上下触及边界
				if (clientY < this.edge) {
					this.top = this.edge;
				} else if (clientY > edgeBottom) {
					this.top = edgeBottom;
				} else {
					this.top = clientY
				}
			},
			touchend() {
				if (this.isDock) {
					if (this.left < this.windowWidth / 2 - this.offsetWidth) {
						this.left = this.edge;
					} else {
						this.left = this.windowWidth - this.width - this.edge;;
					}
				}
				this.isMove = false;
			},
		}
	}
</script>

<style lang="scss">
	.drag {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		position: fixed;
		background-color: rgba(0, 0, 0, 0.2);
		z-index: 99;

		&.border-radius {
			border-radius: 100%;
		}

		&.transition {
			transition: left .3s ease, top .3s ease;
		}
	}
</style>

