<template>
	<view class="navBar">
		<view class="navBarContent"
			:style="{width:barWidth,height:barHeight,'background-color': navBarBackgroudColor,'background-image':navBarBackgroudColor,navShadow:navShadow}">
			<!--全局背景 -->
			<view class="background" v-if="navBarBackgroudImg">
				<image :style="{height:barHeight,width:barWidth}" :src="navBarBackgroudImg" mode="scaleToFill"></image>
			</view>
			<view class="capsuleContent"
				:style="{maxWidth: barCapsuleContentMaxWidth,paddingTop:menuButtonBounding.top + 'px','line-height':menuButtonBounding.height + 'px'}">
				<view class="btn" v-if="!firstPage">
					<slot name="btnSlot">
						<view v-if="btnType === 'back'" @click="navBack" class="text-xl">
							<text class="cuIcon-back" :style="{color:surplusTitle.color}"></text>
						</view>
						<view v-else-if="btnType === 'home'" @click="navHome">
							<text class="cuIcon-home" :style="{color:surplusTitle.color}"></text>
						</view>
						<view v-else-if="btnType==='tower'" class="tower"
							:style="{width:menuButtonBounding.width+'px','line-height':menuButtonBounding.height-2 + 'px'}">
							<text class="cuIcon-back" :style="{color:surplusTitle.color}" @click="navBack"></text>
							<text class="cuIcon-home" :style="{color:surplusTitle.color}" @click="navHome"></text>
						</view>
					</slot>
				</view>
				<view class="surplus">
					<slot name="surplusSlot">
						<view v-if="title"
							:style="{color:surplusTitle.color,'text-align':surplusTitle.align,'font-weight':surplusTitle.weight}"
							class="title">
							<text>{{title}}</text>
						</view>
						<view v-else class="searchBtn" @click="searchClick">
							<text class="iconfont icon-lookup searchIcon"></text>
							<input type="text" class="input" placeholder-style="color:#dbdbdb;" confirm-type="search"
								:placeholder="placeholder" @confirm="searchConfirm"
								:style="{'height':menuButtonBounding.height +'px'}" />
						</view>
					</slot>
				</view>
			</view>
			<view>
				<slot name="extendSlot">
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'hoprxi-navigation',
		props: {
			surplusHeight: {
				type: Number,
				default: 0
			},
			backgroundColor: {
				type: [String,Array],
				//背景色,参数一：透明度,参数二：背景颜色（array则为线性渐变，string为单色背景）渐变轴角度
				// 比如：[1,['#24bdab','#80c54c'，45]]
				default: []
			},
			backgroundImg: {
				type: String,
				// 背景图片
				default: ''
			},
			btnType: {
				type: String,
				default: 'back'
			},
			tabPage: {
				type: String,
				default: ''
			},
			titleFont: {
				type: Array,
				//字体选项，颜色，排列,粗细
				//比如：['#000', 'center', 400]
				default: []
			},
			title: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请输入搜索的关键字'
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				barWidth: 0,
				barHeight: 0,
				barCapsuleContentMaxWidth: 0,

				navBarBackgroudColor: '#FFF',
				navBarBackgroudImg: null,

				menuButtonBounding: {
					top: 0,
					height: 0,
					width: 0,
					right: 0,
				},
				firstPage: false,

				surplusTitle: {
					color: '#000',
					align: 'left',
					weight: 400
				}
			}
		},
		watch: {
			surplusHeight() {
				this.computeBarHeight();
			}
		},
		computed: {
			//导航底部线是否显示
			navShadow() {
				if (this.backgroundColor && typeof(this.backgroundColor) == "string") {
					return this.shadow && this.type !== 'transparent' && whiteList.includes(this.backgroundColor);
				} else {
					return false;
				}
			},
		},
		created() {
			//获取胶囊尺寸
			// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
			this.menuButtonBounding = uni.getMenuButtonBoundingClientRect();
			// #endif
			this.computeBarHeight();
			this.navBarBackgroudImg = this.backgroundImg;
			if (this.navBarBackgroudImg) {
				this.isWhite = true;
			} else {
				this.setNavBarColor(this.backgroundColor);
			}
			//获取所有页面
			let currentPages = getCurrentPages();
			let pageLen = currentPages.length;
			//判断是否是第一个页面，如果是将不显示左边按键
			if (pageLen == 1)
				this.firstPage = true;
			this.setSurplusTitle(this.titleFont);
			//console.log(this.barHeight);
		},
		methods: {
			computeBarHeight() {
				uni.getSystemInfo({
					success: res => {	
						this.statusBarHeight = res.statusBarHeight + 'px';
						this.barWidth = res.screenWidth + 'px';
						this.barHeight = res.statusBarHeight + this.menuButtonBounding.height + (this
							.menuButtonBounding.top - res.statusBarHeight) * 2 + this.surplusHeight + 'px';
						// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
						this.barCapsuleContentMaxWidth = res.screenWidth - this.menuButtonBounding.width - (res
							.screenWidth - this.menuButtonBounding.right) + 'px';
						// #endif
					}
				});
			},
			navBack() {
				uni.navigateBack();
			},
			//返回首页
			navHome() {
				uni.switchTab({
					url: this.tabPage
				});
			},
			setSurplusTitle(value) {
				if (Array.isArray(value)) {
					if (value.length === 1) {
						this.surplusTitle.color = value[0]
					} else if (value.length === 2) {
						this.surplusTitle.color = value[0]
						this.surplusTitle.align = value[1]
					} else if (value.length === 3) {
						this.surplusTitle.color = value[0]
						this.surplusTitle.align = value[1]
						this.surplusTitle.weight = value[2]
					}
				}
			},
			setNavBarColor(backColor) {
				if (Array.isArray(backColor) && backColor.length >= 2) {
					let transparent = backColor[0];
					let background = backColor[1];
					if (Array.isArray(background) && background.length >= 2) {
						let navBgColor = 'linear-gradient(';
						if (background.length == 3) //['#0081ff', '#1cbbb4',0]
							navBgColor += background[2] + 'deg,';
						else //['#0081ff', '#1cbbb4']
							navBgColor += '45deg,';
						let o = this.colorRgb(background[0]);
						navBgColor += `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${transparent})` + ',';
						o = this.colorRgb(background[1]);
						navBgColor += `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${transparent})` + ')';
						this.navBarBackgroudColor = navBgColor;
						this.isWhite = true;
					} else { //[1,#FFFFF]
						let o = this.colorRgb(background);
						this.navBarBackgroudColor = `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${transparent})`
					}
				} else { //#FFF
					this.navBarBackgroudColor = backColor;
				}
			},
			// 转换函数
			colorRgb(sColor) {
				var that = this;
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = sColor.toLowerCase();
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = "#";
						for (var i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					var sColorChange = [];
					for (var i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
					}
					return sColorChange;
				} else {
					return sColor;
				}
			},
			// 搜索框，点击完成时触发
			searchConfirm(event) {
				this.$emit('searchConfirm', event.detail);
			},
			// 搜索框点击事件
			searchClick(event) {
				this.$emit('searchClick', true);
			}
		}
	}
</script>

<style lang="scss">
	.navBar {
		display: flex;
		overflow: hidden;
		//box-shadow: 0 0 6rpx 0 #ddd;
	}

	.navBarContent {
		display: flex;
		flex-direction: column;

		.background {
			position: absolute;
			left: 8rpx;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			opacity: 1
		}

		.capsuleContent {
			display: flex;
			z-index: 2;
			padding: 0 10rpx 0 18rpx;

			.btn {
				.tower {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 28rpx;
					border-radius: 33px;
					border-style: solid;
					border-width: 2rpx;
					border-color: rgba(0, 0, 0, 0.1);
					background-color: rgba(255, 255, 255, 0.65);
					/* #ifndef APP-PLUS-NVUE */
					box-sizing: border-box;
					/* #endif */
					//transition: color,background 0.2s !important;
				}

				.line {
					border-left: 2rpx solid;
				}
			}

			.surplus {
				width: 100%;
				padding-left: 16rpx;
				font-size: 32rpx;

				.title {
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.searchBtn {
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.searchIcon {
						position: absolute;
						left: 18rpx;
						font-size: 30rpx;
						color: #dbdbdb;
					}

					.input {
						width: 88%;
						border-radius: 24rpx;
						background-color: rgba(32, 32, 32, .35);
						padding: 0 26rpx 0 60rpx;
						color: #dbdbdb;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
</style>
