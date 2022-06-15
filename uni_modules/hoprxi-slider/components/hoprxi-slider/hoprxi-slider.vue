<template>
	<view>
		<view class="slider"  v-for="(item,index) in items" :key="index">
			<view class="item" :style="{transform:item.isTouchMove?'translateX(0)':`translateX(${offset}rpx)`,
			                              marginLeft:`-${offset}rpx`}" @touchstart="touchstart" @touchmove="touchmove"
				:data-index="index">
				<view class="flex-sub" @tap.stop="itemClick(item)">
					<slot :item="item"></slot>
				</view>
				<view class="btn" v-for="(btn,num) in btnArr" :key="num" @tap.stop="btnClick(btn.event,item)"
					:style="[btnStyle(num)]">
					<text class="text-df" :style="{color:btn.color}">{{btn.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	 * items：{Array}，使用者需要在mounted中赋值，created中则使用Vue.$nextTick(() => {}赋值
	 * @property {String} hierarchyClass,用于slot中item之间的css3风格，比如item之间的间隔
	 * @property {Array} btnArr 按钮格式为：[{name: 'xxx', background:'xxx',width:'xxx',color:'xxx',event:'xxx'}]
	 */
	export default {
		name: 'hoprxi-slider',
		props: {
			hierarchyClass: {
				type: String,
				default: ''
			},
			items: {
				type: Array,
				default: []
			},
			radius: {
				type: Number,
				default: 0
			},
			//按钮数组
			btnArr: {
				type: Array,
				default: [{
					name: '编辑',
					width: 150,
					background: '#00aaff',
					color: '#fff',
					event: 'edit'
				}, {
					name: '删除',
					width: 200,
					background: '#ff5500',
					color: '#fff',
					event: 'del'
				}, ]
			},
		},
		data() {
			return {
				startX: 0, //开始坐标
				startY: 0, //开始Y坐标
				offset: 0, //按钮数组偏移量
			}
		},
		created() {
			if (Array.isArray(this.btnArr)) {
				for (const btn of this.btnArr) {
					this.offset += btn.width;
				}
			}
			//console.log(this.items);
			for (const v of this.items) {
				this.$set(v, 'isTouchMove', false);
			}
		},
		methods: {
			btnStyle(index) {
				let style = {};
				style.backgroundColor = this.btnArr[index].background;
				//style.boxShadow = "5px 5px 5px " + this.btnArr[index].background;
				style.width = this.btnArr[index].width + 'rpx';
				if (index === this.btnArr.length - 1) {
					style.borderTopRightRadius = this.radius + 'rpx';
					style.borderBottomRightRadius = this.radius + 'rpx';
				}
				return style;
			},
			//单击行
			itemClick(item) {
				this.$emit('click', item);
			},
			//单击按钮
			btnClick(name, item) {
				this.$emit(name, item)
			},
			touchstart(event) {
				for (const v of this.items) {
					if (v.isTouchMove) {
						v.isTouchMove = false;
						break;
					}
				}
				/*  #ifdef APP-PLUS||H5||MP  */
				this.startX = event.changedTouches[0].clientX;
				this.startY = event.changedTouches[0].clientY;
				/*  #endif  */
				/*  #ifdef APP-NVUE */
				this.startX = event.changedTouches[0].screenX;
				this.startY = event.changedTouches[0].screenY;
				/*  #endif  */
			},
			touchmove(event) {
				const _angle = (start, end) => {
					var X = end.X - start.X,
						Y = end.Y - start.Y
					//返回角度 /Math.atan()返回数字的反正切值
					return 360 * Math.atan(Y / X) / (2 * Math.PI);
				}
				let that = this;
				let startX = that.startX;
				let startY = that.startY;
				let index = event.currentTarget.dataset.index;
				/*  #ifdef APP-PLUS||H5||MP  */
				var touchMoveX = event.changedTouches[0].clientX; //滑动变化坐标
				var touchMoveY = event.changedTouches[0].clientY; //滑动变化坐标
				/*  #endif  */
				/*  #ifdef APP-NVUE */
				var touchMoveX = event.changedTouches[0].screenX; //滑动变化坐标
				var touchMoveY = event.changedTouches[0].screenY; //滑动变化坐标
				/*  #endif  */
				//获取滑动角度
				let angle = _angle({
					X: startX,
					Y: startY
				}, {
					X: touchMoveX,
					Y: touchMoveY
				});
				let i = 0;
				for (const v of that.items) {
					if (Math.abs(angle) > 45) return; //角度小于45度
					if (i === index) {
						//声明或者已经赋值过的对象或者数组（数组里边的值是对象）时，向对象中添加新的属性，
						//如果更新此属性的值，是不会更新视图的,要使用vue.$set
						if (touchMoveX > startX) //右滑
							that.$set(v, 'isTouchMove', false);
						else //左滑
							that.$set(v, 'isTouchMove', true);
					}
					i += 1;
				}
			},
		}
	}
</script>

<style lang="scss">
	.slider {
		overflow: hidden;
	}

	.item {
		/*  #ifdef APP-PLUS||H5||MP  */
		display: flex;
		/*  #endif  */
		justify-content: space-between;
		transition: transform .5s ease-out;
	}

	.btn {
		/*  #ifdef APP-PLUS||H5||MP  */
		display: flex;
		/*  #endif  */
		font-weight: bold;
		align-items: center;
		justify-content: center;
	}
</style>
