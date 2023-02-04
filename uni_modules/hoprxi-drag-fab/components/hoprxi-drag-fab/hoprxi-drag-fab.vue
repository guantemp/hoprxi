<template>
	<view @touchmove.stop.prevent="touchmove" @touchend="touchend">
		<view :class="[{'menus-pop':isPopMenu},'menus']"
			:style="[{width: menuWidth, height: menuHeight,borderRadius:size/2 + 'rpx'},menusStyle]">
			<block v-for="(menu, index) in menus" :key="index">
				<view @click="_onMenuClick(menu.event, menu)" :class="['menu',{'menu-pop':isPopMenu}]"
					:style="menuStyle">
					<view v-if="menu.iconFont" :class="menu.iconFont" :style="{fontSize:size/2 + 'rpx'}">
						<view v-if="menu.badge" class="badge">
							<block>{{menu.badge>99?'99+':menu.badge}}</block>
						</view>
					</view>
					<image v-if="menu.iconPath&&!(menu.iconFont)" :src="menu.iconPath" mode="aspectFit"
						:style="{width:size/2 + 'rpx',height:size/2 +'rpx'}" style="margin-bottom: 7rpx;">
						<view v-if="menu.badge" class="badge">
							<block>{{menu.badge>99?'99+':menu.badge}}</block>
						</view>
					</image>
					<text class="text">{{ menu.text }}</text>
				</view>
			</block>
		</view>
		<view class="ball bg-blue" @click.stop.prevent="_onBallClick" :class="{'transition': !isMoved}"
			:style="{left:left + 'px', top:top + 'px',width:size + 'rpx',height:size + 'rpx'}">
			<view :class="[{'ball-click': isPopMenu},'ball-circle-v']"></view>
			<view class="ball-circle-h" :class="{'ball-click': isPopMenu}"></view>
		</view>
	</view>
</template>
/**
* Fab 可拖拽自动靠边悬浮按钮
* @description 点击可展开一个图形按钮菜单
* @property {Number} size 球、菜单的高度
* @property {String} direction= [horizontal | vertical] 展开菜单显示方式
* @value horizontal 水平显示
* @value vertical 垂直显示
* @property {String} position= [rightBottom | leftBottom | leftTop | rightTop] 悬浮球初始位置
* @property {Array} menus 展开菜单内容配置项
* @event {Function} menus.event 展开菜单点击事件，返回点击信息
* @event {Function} ballClick 悬浮球点击事件
*/
<script>
	import {
		ref
	} from "vue";
	export default {
		name: 'hoprxi-drag-fab',
		props: {
			menus: {
				Type: Array,
				default: [{
					iconPath: '/static/workflow_icon/new.png',
					iconFont: 'cuIcon-new',
					badge: 2,
					text: '新增',
					event: 'append'
				}]
			},
			size: {
				type: Number,
				default: 118
			},
			direction: {
				type: String,
				default: 'horizontal',
				validator(value) {
					return value === 'horizontal' || value === 'vertical';
				}
			},
			position: {
				type: String,
				default: 'rightBottom',
				validator(value) {
					return value === 'leftBottom' || value === 'rightBottom' || value === 'rightTop' || value ===
						'leftTop';
				}
			}
		},
		setup(props, content) {
			let windowWidth = ref(0);
			let windowHeight = ref(0);
			let left = ref(0);
			let top = ref(0);
			let ballWidth = ref(0);
			let ballHeight = ref(0);
			let isPopMenu = ref(false);
			let isMoved = ref(true);
			const edge = 9
			return {
				windowWidth,
				windowHeight,
				left,
				top,
				ballWidth,
				ballHeight,
				isPopMenu,
				isMoved,
				edge
			}
		},
		created() {
			if (Array.isArray(this.menus) && (this.menus.length === 0 || this.menus.length > 5)) throw new Error(
				'menus must be of Array type and lenght rang is 1-5.');
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
				query.select('.ball').boundingClientRect(res => {
					this.ballWidth = res.width;
					this.ballHeight = res.height;
					switch (this.position) {
						case 'rightBottom':
							this.left = this.windowWidth - this.ballWidth - this.edge;
							this.top = this.windowHeight - this.ballHeight - this.edge * 4;
							break;
						case 'leftBottom':
							this.left = this.edge;
							this.top = this.windowHeight - this.ballHeight - this.edge * 4;
							break;
						case 'leftTop':
							this.left = this.edge;
							this.top = this.ballHeight + this.edge * 4;
							break;
						case 'rightTop':
							this.left = this.windowWidth - this.ballWidth - this.edge;
							this.top = this.ballHeight + this.edge * 4;
							break;
					}
				}).exec();					
		},
		computed: {
			menuWidth() {
				if (this.isPopMenu && this.direction === 'horizontal') return (this.menus.length + 1) * this.size +
					'rpx';
				return this.size + "rpx";
			},
			menuHeight() {
				if (this.isPopMenu && this.direction === 'vertical') return (this.menus.length + 1) * this.size +
					'rpx';
				return this.size + "rpx";
			},
			menusStyle() {
				let style = {};
				let posi = "rightBottom";
				let halfWindowWidth = this.windowWidth / 2;
				let halfWindowHeight = this.windowHeight / 2;
				if (this.left <= halfWindowWidth && this.top <= halfWindowHeight) posi = "leftTop";
				else if (this.left <= halfWindowWidth && this.top > halfWindowHeight) posi = "leftBottom";
				else if (this.left > halfWindowWidth && this.top <= halfWindowHeight) posi = "rightTop";
				switch (posi) {
					case 'leftTop':
						style.left = this.left + 'px';
						style.top = this.top + 'px'
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 1.07 + 'rpx';
						} else { // 'vertical' 
							style.flexDirection = "column"
							style.paddingTop = this.size + 'rpx';
						}
						break;
					case 'rightTop':
						style.right = this.windowWidth - this.left - this.ballWidth + 'px';
						style.top = this.top + 'px'
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 3.5 + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column"
							style.paddingTop = this.size + 'rpx';
						}
						break;
					case 'leftBottom':
						style.left = this.left + 'px';
						style.bottom = this.windowHeight - this.top - this.ballHeight + 'px';
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 1.07 + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column-reverse"
							style.paddingBottom = this.size + 'rpx';
						}
						break;
					case 'rightBottom':
						style.right = this.windowWidth - this.left - this.ballWidth + 'px';
						style.bottom = this.windowHeight - this.top - this.ballHeight + 'px';
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 3.5 + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column-reverse"
							style.paddingBottom = this.size + 'rpx';
						}
						break;
				}
				return style;
			},
			menuStyle() {
				let style = {};
				if (this.direction === 'horizontal') {
					style.width = this.size - 5 + 'rpx';
					style.height = this.size + 'rpx';
				} else {
					style.width = this.size + 'rpx';
					style.height = this.size - 6 + 'rpx';
				}
				return style;
			}
		},
		methods: {
			//球点击事件
			_onBallClick() {
				this.isPopMenu = !this.isPopMenu;
				this.$emit('ballClick')
			},
			// 菜单点击事件
			_onMenuClick(name, menu) {
				this.$emit(name, menu);
			},
			touchmove(event) {
				if (this.isPopMenu) this.isPopMenu = false;
				if (event.touches.length !== 1) { // 单指触摸
					return false;
				}
				this.isMoved = true;
				this.left = event.touches[0].clientX - this.ballWidth / 2;
				//this.top =event.touches[0].clientY - this.offsetHeight;
				let clientY = event.touches[0].clientY - this.ballHeight / 2;
				// #ifdef H5
				clientY += this.ballHeight;
				// #endif
				let edgeBottom = this.windowHeight - this.ballHeight - this.edge;
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
				if (this.left < this.windowWidth / 2 - this.ballWidth / 2) {
					this.left = this.edge;
				} else {
					this.left = this.windowWidth - this.ballWidth - this.edge;
				}
				this.isMoved = false;
			},
		}
	}
</script>

<style lang="scss">
	.ball {
		position: fixed;
		z-index: 7;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 5rpx 2rpx rgba(0, 0, 0, 0.2);
		border-radius: 50%;

		&.transition {
			transition: left .3s ease, top .3s ease;
		}

		.ball-circle-v {
			position: absolute;
			width: 8rpx;
			height: calc(75% - 4rpx);
			left: calc(50% - 4rpx);
			top: 15%;
			background-color: white;
			transform: rotate(0deg);
			transition: transform .3s;
		}

		.ball-circle-h {
			position: absolute;
			width: calc(75% - 4rpx);
			height: 8rpx;
			left: 15%;
			top: calc(50% - 4rpx);
			background-color: white;
			transform: rotate(0deg);
			transition: transform .3s;
		}

		.ball-click {
			transform: rotate(135deg);
		}
	}

	.menus {
		position: fixed;
		display: flex;
		z-index: 7;
		flex-direction: row;
		overflow: hidden;
		transition-property: width, height, background-color;
		transition-duration: .3s;
		transition-delay: 0, 0, .3s;
		background-color: rgba(0, 0, 0, 0);

		&.menus-pop {
			background-color: #FFF;
			border: 1rpx solid #DDDDDD;
			box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
		}

		.menu {
			position: relative; //非常重要是badge显示必要
			display: inline-flex; //非常重要是badge显示必要
			flex-direction: column;
			justify-content: center;
			align-items: center;
			opacity: 0;
			transition: opacity 0.2s;
			white-space: nowrap;

			.badge {
				position: absolute;
				top: 4rpx;
				right: 4rpx;
				height: 28rpx;
				line-height: 28rpx;
				border-radius: 200rpx;
				background: #dd524d;
				color: #fff;
				text-align: center;
				padding: 0 10rpx;
				font-size: 20rpx;
				box-shadow: 0 0 0 2rpx #fff;
				box-sizing: border-box;
			}

			/*
			badge-dot {
			  position: absolute;
			  transform: translateX(-50%);
			  top: -8rpx;
			  right: -16rpx;
			  height: 16rpx;
			  width: 16rpx;
			  border-radius: 100%;
			  background: #dd524d;
			  box-shadow: 0 0 0 1rpx #fff;
			}
*/
			&.menu-pop {
				opacity: 1;
			}

			.text {
				font-size: 24rpx;
				text-shadow: 2rpx 0rpx 2rpx rgba(0, 0, 0, .3);
			}

			//>text {...}
		}
	}
</style>
