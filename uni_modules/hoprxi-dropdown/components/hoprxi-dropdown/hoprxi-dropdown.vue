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
		<view :class="['popup',{'hide':!popupShow}]" v-if="tabs[selected].depth >= 4">
			<scroll-view class="left" :scroll-y="true" :scroll-into-view="'left_'+ leftScrollInto">
				<block v-for="(one,index) in tabs[selected].sub" :key="one.id">
					<view class="left_menu" :id="'left_'+ one.id"
						:class="{'bg-white text-red':select[selected]&&select[selected].level2_id === one.id&&!select[selected].level2_cancel}"
						@tap.stop="second_menu_selected(one.id)">
						<text>{{one.name}}</text>
					</view>
				</block>
			</scroll-view>
			<scroll-view class="right" :scroll-y="true" :scroll-into-view="'label_'+rightScrollInto">
				<block v-for="(two,index) in children()" :key="two.id">
					<view class="label" :class="{'text-orange':select[selected]&&select[selected].level3_id === two.id}"
						:id="'label_'+ two.id" @tap.top="three_menu_selected(two.id)">
						<text>{{two.name}}</text>
						<text class="cuIcon-check text-lg text-bold"
							v-if="select[selected]&&select[selected].level3_id === two.id"></text>
					</view>
					<view class="items" v-if="two.sub">
						<block v-for="(three,three_index) in two.sub" :key="three.id">
							<view class="item" @tap.top="four_menu_selected(three.id)"
								:class="{'selected':select[selected]&&select[selected].level4_id === three.id}"
								:id="'label_'+ three.id">
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
				:style="{'padding-bottom:108rpx':tabs[selected].selector === 'multi'}">
				<block v-for="(one,index) in tabs[selected].sub" :key="one.id">
					<view class="label"
						:class="{'text-red text-bold':select[selected]&&select[selected].level2_id === one.id&&!select[selected].level2_cancel}"
						:id="'label_'+ one.id" @tap="second_menu_selected(one.id)">
						<text>{{one.name}}</text>
						<text class="cuIcon-check text-lg text-bold"
							v-if="select[selected]&&select[selected].level2_id === one.id&&!select[selected].level2_cancel"></text>
					</view>
					<view class="items items-extend" v-if="one.sub">
						<block v-for="(two,three_index) in one.sub" :key="two.id">
							<view class="item item-extend" @tap.top="three_menu_selected(two.id)"
								:class="{'selected':select[selected]&&select[selected].level3_id === two.id}">
								<text>{{two.name}}</text>
							</view>
						</block>
					</view>
					<view class="bott"></view>
				</block>
			</scroll-view>
			<view class="filterBtn" v-if="tabs[selected].selector === 'multi'">
				<button class="cu-btn radius shadow bg-orange basis-sm margin-right-sm text-lg" @tap.stop="rest_multi">
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
				this.selected = this.indexOf(id, this.tabs);
				//css tab中 (margin:10+padding:20)*2=60
				this.scrollLeft = (this.selected - 1) * 60;
				if (this.popupShow && !this.tabs[this.selected].sub) this.popupShow = false
			},
			triangledown(event) {
				this.tabSelect(event);
				this.popupShow = !this.popupShow;
			},
			closePopup() {
				this.popupShow = false;
			},
			children() {
				let first_select = this.select[this.selected]; //第一次点击tab_select
				if (typeof(first_select) === "undefined") {
					if (this.tabs[this.selected].sub[0].sub) {
						return this.tabs[this.selected].sub[0].sub;
					}
					return this.tabs[this.selected].sub[0];
				}
				let sub = this.tabs[this.selected].sub;
				let index = this.indexOf(this.select[this.selected].level2_id, sub);
				return sub[index].sub;
			},
			second_menu_selected(id) {
				let second = this.select[this.selected];
				if (typeof(second) !== "undefined" && !second.level2_cancel && second.level2_id && second.level2_id ===
					id) {
					this.$set(this.select, this.selected, {
						level2_id: id,
						level2_cancel: true
					});
				} else {
					this.$set(this.select, this.selected, {
						level2_id: id,
					});
				}
			},
			three_menu_selected(id) {
				let three = this.select[this.selected];
				if (typeof(three) !== "undefined" && three.level3_id && three.level3_id === id) {
					this.$set(this.select, this.selected, {
						level2_id: three.level2_id
					});
				} else {
					let sub = this.tabs[this.selected].sub;
					this.$set(this.select, this.selected, {
						level2_id: this.findParent(sub, id),
						level3_id: id
					});
				}
			},
			four_menu_selected(id) {
				let four = this.select[this.selected];
				if (typeof(four) !== "undefined" && four.level4_id && four.level4_id === id) {
					this.$set(this.select, this.selected, {
						level2_id: this.select[this.selected].level2_id,
						level3_id: this.select[this.selected].level3_id
					});
				} else {
					let level2_id = (typeof(four) !== "undefined" && four.level2_id !== undefined) ? four.level2_id : this
						.tabs[this.selected].sub[0].id;
					let sub1 = this.tabs[this.selected].sub;
					let index = this.indexOf(level2_id, sub1);
					let sub2 = sub1[index].sub;
					let level3_id = this.findParent(sub2, id);
					level2_id = this.findParent(sub1, level3_id);
					let four_object = {
						level2_id: level2_id,
						level3_id: level3_id,
						level4_id: id
					}
					this.$set(this.select, this.selected, four_object);
				}
			},
			three_three_menu_selected(id) {
				this.$emit('selected', {
					index: 0,
					value: 0
				});
			},
			rest_multi() {
				this.$set(this.select, this.selected, {});
			},
			findParent(sub, id) {
				for (const v of sub) {
					if (v.sub) {
						for (const v1 of v.sub) {
							if (v1.id === id) return v.id
						}
					}
				}
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
			font-size: 120%;
			position: absolute;
			top: 6rpx;
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
		z-index: 8;
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
		opacity: 1;
		transition: opacity height .5s;

		&.hide {
			opacity: 0;
			height: 0;
			transition: opacity height .5s;
		}

		.left {
			display: flex;
			width: 28vw;
			background-color: #f0f0f0;

			.left_menu {
				padding-left: 20rpx;
				white-space: nowrap;
				/*overflow: hidden;*/
				/*text-overflow: ellipsis;*/

				>text {
					/*以下垂直居中，仅对一列有效*/
					display: inline-block;
					vertical-align: middle;
					height: 96rpx;
					line-height: 96rpx;
				}
			}
		}

		.right {
			padding: 0 6rpx 0 20rpx;

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
				border-bottom: dashed 1rpx #e5e5e5;
				margin: 0rpx 6rpx 0 0;
			}
		}

		.filter {
			.label {
				display: flex;
				justify-content: space-between;
				padding: 0 26rpx;

				>text {
					height: 78rpx;
					line-height: 78rpx;
				}
			}

			.items-extend {
				padding: 0 2rpx 0 24rpx;

				.item-extend {
					flex: 0 0 30%;
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
				font-size: 28rpx;
				/*重要设置上下左右居中*/
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
			/*预置固定值*/
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
