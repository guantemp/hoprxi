<template>
	<view>
		<scroll-view scroll-x class="navigation bg-white" scroll-with-animation :scroll-left="scrollLeft">
			<view class="tab" :ref="tab" :class="{'text-orange cur text-bold':index === selected}"
				v-for="(tab,index) in tabs" :key="tab.id" :data-id="tab.id" @tap="tabSelect">
				<text>{{tab.name}}</text>
				<text v-if="tab.sub" class="cuIcon-triangledownfill subIcon"
					:class="{'selected':index === selected && popupShow}" @tap.stop="triangledown"
					:data-id="tab.id"></text>
			</view>
		</scroll-view>
		<!-- 遮罩层-->
		<view class="mask" :class="{'show':popupShow}" @tap="closePopup"></view>
		<!--4个层级-->
		<view class="popup" :class="{'hide':!popupShow}" v-if="tabs[selected].depth >= 4">
			<scroll-view class="left" :scroll-y="true" :scroll-into-view="'left_'+ leftScrollInto">
				<block v-for="(one,index) in tabs[selected].sub" :key="one.id">
					<view class="leftMenu" :id="'left_'+ one.id" :class="{'bg-white text-bold':select[selected]&&select[selected].level2_id === one.id}"
						@tap.stop="menuSelect(one.id)">
						<text>{{one.name}}</text>
					</view>
				</block>
			</scroll-view>
			<scroll-view class="right" :scroll-y="true" :scroll-into-view="'label_'+rightScrollInto">
				<block v-for="(two,index) in childrenOf(select[selected])" :key="two.id">
					<view class="label" :class="{'text-red text-bold':select[2] === two.id}" :id="'label_'+ two.id"
						@tap.top="menuSelect(select[1],two.id)">
						<text>{{two.name}}</text>
						<text class="cuIcon-check text-lg text-bold" v-if="!two.sub&&select[2] === two.id"></text>
					</view>
					<view class="items" v-if="two.sub">
						<block v-for="(three,three_index) in two.sub" :key="three.id">
							<view class="item" @tap.top="menuSelect(select[1],select[2],three.id)"
								:class="{'selected':select[3]===three.id}" :id="'label_'+ three.id">
								<text>{{three.name}}</text>
							</view>
						</block>
					</view>
					<view class="bott"></view>
				</block>
			</scroll-view>
		</view>
		<!--3个层级-->
		<view class="popup" :class="{'hide':!popupShow}" v-else-if="tabs[selected].depth <= 3">
			<scroll-view class="filter" scroll-y="true" :scroll-into-view="'s_'+ scrollInto"
				:scroll-with-animation="true" :enable-back-to-top="true"
				:style="{'padding-bottom:108rpx':tabs[selected].selector === 'multiSelect'}">
				<block v-for="(two,index) in tabs[selected].sub" :key="two.id">
					<view class="label" :class="select[1] === index? 'text-red':'text-gray'" :id="'label_'+index"
						@tap="menuSelect(index,null,null)">
						<text>{{two.name}}</text>
					</view>
					<view class="items items-extend" v-if="two.sub">
						<block v-for="(three,three_index) in two.sub" :key="three.id">
							<view class="item item-extend" @tap.top="menuSelect(select[1],three_index,null)"
								:class="{'selected':select[2]===three_index}">
								<text>{{three.name}}</text>
							</view>
						</block>
					</view>
					<view class="bott"></view>
				</block>
			</scroll-view>
			<view class="filterBtn" v-if="tabs[selected].selector === 'multiSelect'">
				<button class="cu-btn radius shadow bg-orange basis-sm margin-right-sm text-lg" @tap.stop="">
					<text>重置</text></button>
				<button class="cu-btn radius shadow bg-orange basis-sm text-lg" @tap.stop="">
					<text>确定</text></button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPropertyFromData,
	} from '@/common/js/util.js';
	import {
		ref
	} from "vue";
	export default {
		name: 'hoprxi-dropdown',
		props: {
			menus: {
				Type: Array,
				default: []
			},
			perset: {
				Type: Array,
				default: []
			},
			props: { // 配置选项
				type: Object,
				default: {
					id: 'id', // 指定id为节点对象的某个属性值
					sub: 'sub', // 指定子树为节点对象的某个属性值
					name: 'name', // 指定标签为节点对象的某个属性值
					selector: 'selector' //选择类型 singleSelect,multiSelect
				}
			},
		},
		data() {
			return {
				tabs: [],
				scrollLeft: 0,
				popupShow: false,
				select: [],
				selected: 0,
				leftScrollInto: 0,
			}
		},
		created() {
			this.decorate();
		},
		watch: {},
		methods: {
			tabSelect(event) {
				const id = event.currentTarget.dataset.id;
				const index = this.indexOf(id, this.tabs);
				this.selected = index;
				//css tab中 (margin:10+padding:20)*2=60
				this.scrollLeft = (index - 1) * 60;
				if (this.popupShow && !this.tabs[index].sub) this.popupShow = false
				this.$nextTick(() => {
					console.log("tab:" + this.tabs[index].id)
				})
			},
			triangledown(event) {
				this.tabSelect(event);
				this.popupShow = !this.popupShow;
			},
			closePopup() {
				this.popupShow = false;
			},
			childrenOf(level2_id) {
				let first_select = this.select[this.selected]; //第一次点击tab_select
				console.log(this.select[this.selected]);
				if (typeof(first_select) === "undefined") {
					if (this.tabs[this.selected].sub[0].sub) {
						return this.tabs[this.selected].sub[0].sub;
					}
					return this.tabs[this.selected].sub[0];
				}
				let sub = this.tabs[this.selected].sub;
				let index = this.indexOf(this.select[this.selected].level2_id, sub);
				//console.log(sub[index].sub);
				return sub[index].sub;
				return sub[this.indexOf(level2_id, sub)].sub;
			},
			menuSelect(level2_id, level3_id, level4_id) {
				console.log("menu：" + (level2_id !== null && typeof(level3_id) == "undefined" && typeof(level4_id) ==
					"undefined"))
				if (level2_id === null || typeof(level2_id) == "undefined") return;
				if (level2_id !== null && typeof(level3_id) == "undefined" && typeof(level4_id) == "undefined") {
					this.$set(this.select, this.selected, {
						level2_id: level2_id
					});
					if (this.select[1] !== level2_id) {
						this.$set(this.select, 1, level2_id);
					}
					console.log("level2_id：" + this.select[this.selected].level2_id)
				} else if (level2_id !== null && level3_id !== null && level4_id == null) {
					if (this.select[3]) this.select[3] = null;
					if (this.select[2] !== level3_id) {
						this.$set(this.select, 2, level3_id);
					}
				} else if (level2_id != null && level4_id != null) {
					if (this.select[3] !== level4_id) {
						this.$set(this.select, 3, level4_id);
					}
				}
				//console.log(this.select[3]);
				this.$emit('selected', {
					index: 0,
					value: 0
				});
			},
			indexOf(id, menus = []) {
				if (!id || !menus || !Array.isArray(menus) || menus.length === 0) return 0;
				let index = 0;
				for (const menu of menus) {
					if (id === menu.id) {
						break;
					}
					index++;
				}
				return index;
			},
			depth(treeData) {
				let floor = 0
				let max = 0
				const _each = (data, floor) => {
					if (data && Array.isArray(data) && data.length > 0) {
						data.forEach(e => {
							max = floor > max ? floor : max;
							let sub = getPropertyFromData(e, this.props, 'sub');
							//if (sub && Array.isArray(sub) && sub.length > 0) {
							_each(sub, floor + 1)
							//}
						})
					}
				}
				_each(treeData, 1)
				return max + 1;
			},
			decorate() {
				const _translate = (parent, children = []) => {
					if (!parent) return;
					if (children && Array.isArray(children) && children.length > 0) {
						let items = [];
						for (const child of children) {
							let temp = {
								id: getPropertyFromData(child, this.props, 'id'),
								name: getPropertyFromData(child, this.props, 'name'),
							};
							let sub = getPropertyFromData(child, this.props, 'sub');
							if (sub && Array.isArray(sub) && sub.length > 0) {
								items.push(_translate(temp, sub))
							} else {
								items.push(temp);
							};
						}
						parent = {
							...parent,
							sub: items
						}
					}
					return parent;
				};
				let i = 0;
				for (const menu of this.menus) {
					const id = getPropertyFromData(menu, this.props, 'id');
					const name = getPropertyFromData(menu, this.props, 'name');
					let parent = {
						id: id,
						name: name,
					}
					const selector = getPropertyFromData(menu, this.props, 'selector');
					if (selector) {
						parent = {
							...parent,
							selector: selector
						}
					}
					const sub = getPropertyFromData(menu, this.props, 'sub');
					this.tabs[i] = {
						..._translate(parent, sub),
						depth: this.depth(sub),
					}
					i += 1;
				}
				//this.select[0] = this.tabs[0].id;
				//console.log(this.tabs);
			},
		}
	}
</script>

<style lang='scss'>
	$select-padding:108rpx;

	.navigation {
		position: relative;
		z-index: 9;
		white-space: nowrap;
		text-align: center;
		border-bottom: solid 1rpx #eee;
	}

	.tab {
		display: inline-block;
		height: 84rpx;
		line-height: 84rpx;
		margin: 0 10rpx;
		padding: 0 20rpx;

		&.cur {
			border-bottom: 4upx solid;
		}

		.subIcon {
			font-size: 150%;
			position: absolute;
			top: 4rpx;
			vertical-align: bottom;
			transition: transform .5s ease-in-out, -webkit-transform .5s ease-in-out;

			&.selected {
				transform: rotate(180deg)
			}
		}
	}

	.mask {
		display: flex;
		position: fixed;
		z-index: 2;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;

		&.show {
			opacity: 1;
			transition-duration: 0.3s;
			pointer-events: auto;
		}
	}

	.popup {
		display: flex;
		position: absolute;
		width: 100%;
		height: 55vh;
		background-color: #fff;
		z-index: 9;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
		transition: display 0.5s linear 0s;

		&.hide {
			display: none;
			transition: display 0.5s linear 0s;
		}

		.left {
			display: flex;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 218rpx;
			background-color: #f0f0f0;

			.leftMenu {
				font-size: 28rpx;
				padding-left: 24rpx;

				>text {
					/*以下垂直居中，仅对一列有效*/
					display: inline-block;
					height: 96rpx;
					line-height: 96rpx;
					vertical-align: middle;
				}
			}
		}

		.right {
			padding: 0 0rpx 0 24rpx;

			.label {
				display: flex;
				justify-content: space-between;
				padding-right: 24rpx;
				padding-left: 8rpx;

				>text {
					height: 82rpx;
					line-height: 82rpx;
				}
			}

			.bott {
				border-bottom: solid 1rpx #e5e5e5;
				margin: 0rpx 6rpx 0 0;
			}
		}

		.filter {

			.label {
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;

				>text {
					height: 78rpx;
					line-height: 78rpx;
				}
			}

			.items-extend {
				padding: 0 24rpx;

				.item-extend {
					flex: 0 0 29%;
					min-height: 74rpx;
					margin-right: calc(16rpx*3 / 2);
				}
			}
		}

		.items {
			display: flex;
			flex-wrap: wrap;

			.item {
				display: flex;
				justify-content: center;
				text-align: center;
				flex: 0 0 32%;
				min-height: 68rpx;
				margin-right: calc(5rpx*3 / 2);
				background-color: #f0f0f0;
				border-radius: 6rpx;
				margin-bottom: 16rpx;
				border: solid #f5f5f5 1rpx;
				padding: 4rpx 8rpx;


				&.selected {
					border-color: #ec652b;
					background-color: #ec652b;
					color: #fff;
				}

				/*重要设置上下左右居中*/
				>text {
					margin: auto;
				}
			}
		}

		.bott {
			border-bottom: dashed 1rpx #e5e5e5;
			margin: 0 12rpx;
		}

		.filterBtn {
			position: absolute;
			bottom: 0;
			display: flex;
			min-height: $select-padding;
			width: 100%;
			justify-content: center;
			align-items: center;
			background-color: #f5f5f5;

			>button {
				height: 78rpx;
			}
		}
	}
</style>
