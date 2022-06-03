<template>
	<view @touchmove.stop.prevent="touchmove" @touchend="touchend">
		<view :class="[{'menus-pop':isPopMenu},'menus']"
			:style="[{width: menuWidth, height: menuHeight,borderRadius:size + 'rpx'},menusStyle]">
			<block v-for="(menu, index) in menus" :key="index">
				<view @click="_onMenuClick(menu.event, menu)" :class="['menu',{'menu-pop':isPopMenu}]"
					:style="{width: size + 'rpx',height: size + 'rpx'}">
					<slot :menu="menu">
						<image :src="menu.iconPath" mode="scaleToFill" class="menu-image"
							:style="{width:size/2 + 'rpx',height:size/2 + 'rpx'}" />
						<text class="text">{{ menu.text }}</text>
					</slot>
				</view>
			</block>
		</view>
		<view class="ball bg-gradual-blue" @click.stop.prevent="_ballClick" :class="{'transition': !isMoved}"
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
* @event {Function} menu.event 展开菜单点击事件，返回点击信息
* @event {Function} ballClick 悬浮球点击事件
*/
<script>
	export default {
		name: 'hoprxi-drag-fab',
		props: {
			menus: {
				Type: Array,
				default: []
			},
			size: {
				type: Number,
				default: 116
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
		data() {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
				offsetWidth: 0,
				offsetHeight: 0,
				windowWidth: 0,
				halfWindowWidth: 0,
				windowHeight: 0,
				halfWindowHeight: 0,
				isMoved: true,
				edge: 15,
				isPopMenu: false,
			}
		},
		created() {
			if (Array.isArray(this.menus) && (this.menus.length === 0 || this.menus.length > 4)) throw new Error(
				'menus must be of Array type and lenght rang is 1-4.');
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
				this.halfWindowWidth = this.windowWidth / 2;
				this.halfWindowHeight = this.windowHeight / 2;
			})
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('.ball').boundingClientRect(res => {
				this.width = res.width;
				this.height = res.height;
				this.offsetWidth = res.width / 2;
				this.offsetHeight = res.height / 2;
				switch (this.position) {
					case 'rightBottom':
						this.left = this.windowWidth - this.width - this.edge;
						this.top = this.windowHeight - this.height - this.edge * 3;
						break;
					case 'leftBottom':
						this.left = this.edge;
						this.top = this.windowHeight - this.height - this.edge * 3;
						break;
					case 'leftTop':
						this.left = this.edge;
						this.top = this.height + this.edge * 3;
						break;
					case 'rightTop':
						this.left = this.windowWidth - this.width - this.edge;
						this.top = this.height + this.edge * 3;
						break;
				}
			}).exec();
			/*
			query.select('#navBar').boundingClientRect().exec(res => {
				this.setFixedHeight(res[0].height);
			});
			*/
		},
		computed: {
			menuWidth() {
				if (this.isPopMenu && this.direction === 'horizontal') return (this.menus.length + 1) * this.size + 22 +
					'rpx';
				return this.size + "rpx";
			},
			menuHeight() {
				if (this.isPopMenu && this.direction === 'vertical') return (this.menus.length + 1) * this.size + 22 +
					'rpx';
				return this.size + "rpx";
			},
			menusStyle() {
				let style = {};
				let posi = "rightBottom";
				if (this.left <= this.halfWindowWidth && this.top <= this.halfWindowHeight) posi = "leftTop";
				else if (this.left <= this.halfWindowWidth && this.top > this.halfWindowHeight) posi = "leftBottom";
				else if (this.left > this.halfWindowWidth && this.top <= this.halfWindowHeight) posi = "rightTop";
				switch (posi) {
					case 'leftTop':
						style.left = this.left + 'px';
						style.top = this.top + 'px'
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size + 'rpx';
						} else { // 'vertical' 
							style.flexDirection = "column"
							style.paddingTop = this.size + 'rpx';
						}
						break;
					case 'rightTop':
						style.right = this.windowWidth - this.left - this.width + 'px';
						style.top = this.top + 'px'
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 4 + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column"
							style.paddingTop = this.size + 'rpx';
						}
						break;
					case 'leftBottom':
						style.left = this.left + 'px';
						style.bottom = this.windowHeight - this.top - this.height + 'px';
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column-reverse"
							style.paddingBottom = this.size + 'rpx';
						}
						break;
					case 'rightBottom':
						style.right = this.windowWidth - this.left - this.width + 'px';
						style.bottom = this.windowHeight - this.top - this.height + 'px';
						if (this.direction === 'horizontal') {
							style.flexDirection = "row"
							style.paddingLeft = this.size / 4 + 'rpx'
						} else if (this.direction === 'vertical') {
							style.flexDirection = "column-reverse"
							style.paddingBottom = this.size + 'rpx';
						}
						break;
				}
				return style;
			}
		},
		methods: {
			//球点击事件
			_ballClick() {
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
				this.left = event.touches[0].clientX - this.offsetWidth;
				//this.top =event.touches[0].clientY - this.offsetHeight;
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
				if (this.left < this.windowWidth / 2 - this.offsetWidth) {
					this.left = this.edge;
				} else {
					this.left = this.windowWidth - this.width - this.edge;
				}
				this.isMoved = false;
			},
		}
	}
</script>

<style lang="scss">
	.ball {
		position: fixed;
		z-index: 9;
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
			height: 64rpx;
			left: 53rpx;
			top: 26rpx;
			background-color: white;
			transform: rotate(0deg);
			transition: transform .3s;
		}

		.ball-circle-h {
			position: absolute;
			width: 64rpx;
			height: 8rpx;
			left: 24rpx;
			top: 54rpx;
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
		z-index: 9;
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
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			opacity: 0;
			transition: opacity 0.2s;

			&.menu-pop {
				opacity: 1;
			}

			.menu-image {
				margin-bottom: 5rpx;
			}

			.text {
				font-size: 12px;
				text-shadow: 2rpx 0rpx 2rpx rgba(0, 0, 0, .3);
			}
			//>text {...}
		}
	}
</style>

