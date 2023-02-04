<template>
	<view @touchmove.stop.prevent="touchmove" @touchend="touchend" @click.stop.prevent="click"
		:class="['drag',{'transition': !isMoved ,'border-radius':radius}]"
		:style="[{left:buttonLeft + 'px', top:buttonTop + 'px',width:size + 'rpx',height:size +'rpx'}]">
		<slot><text class="text-bold cuIcon-add text-xsl"></text></slot>
	</view>
</template>

<script>
	import {
		ref
	} from "vue";
	export default {
		name: 'hoprxi-drag-button',
		props: {
			size: {
				type: Number,
				default: 125
			},
			radius: {
				type: Boolean,
				default: false
			},
			dock: {
				type: Boolean,
				default: false
			}
		},
		setup(props, content) {
			let windowWidth = ref(0);
			let windowHeight = ref(0);
			let buttonWidth = ref(0);
			let buttonHeight = ref(0);
			let buttonLeft = ref(0);
			let buttonTop = ref(0);
			let isMoved = ref(false);
			const edge = 9;
			return {
				windowWidth,
				windowHeight,
				buttonWidth,
				buttonHeight,
				buttonLeft,
				buttonTop,
				isMoved,
				edge
			}
		},
		created() {
			this.$nextTick(() => {
				const sys = uni.getSystemInfoSync();
				this.windowWidth = sys.windowWidth;
				this.windowHeight = sys.windowHeight;
				// #ifdef APP-PLUS
				this.existTabBar && (this.windowHeight -= 50);
				// #endif
				if (sys.windowTop) {
					this.windowHeight += sys.windowTop;
				}
				this.buttonLeft = this.windowWidth - this.size / 2 - this.edge * 3;
				this.buttonTop = this.windowHeight - this.size / 2 - this.edge * 3;
			});
			/*
			const query = uni.createSelectorQuery().in(this);
			query.select('#draggable').boundingClientRect(res => {
				this.buttonWidth = res.width;
				this.buttonHeight = res.height;
				console.log(this.buttonWidth)
				let offsetButtonWidth = res.width / 2;
				let offsetButtonHeight = res.height / 2;
				this.buttonLeft = this.windowWidth - this.buttonWidth - this.edge * 3;
				this.buttonTop = this.windowHeight - this.buttonHeight - this.edge * 3;
			}).exec();
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
				this.buttonLeft = event.touches[0].clientX - this.size / 4;
				let clientY = event.touches[0].clientY - this.size / 4;
				// #ifdef H5
				clientY += this.size / 4;
				// #endif
				let edgeBottom = this.windowHeight - this.size / 4 - this.edge;
				// 上下触及边界
				if (clientY < this.edge) {
					this.buttonTop = this.edge;
				} else if (clientY > edgeBottom) {
					this.buttonTop = edgeBottom;
				} else {
					this.buttonTop = clientY
				}
			},
			touchend() {
				if (this.dock) {
					if (this.buttonLeft < this.windowWidth / 2 - this.size / 4) {
						this.buttonLeft = this.edge;
					} else {
						this.buttonLeft = this.windowWidth - this.size / 2 - this.edge;;
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
		z-index: 7;

		&.border-radius {
			border-radius: 100%;
		}

		&.transition {
			transition: left .3s ease, top .3s ease;
		}
	}
</style>
