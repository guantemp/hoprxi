<template>
	<scroll-view scroll-x class="navigation bg-white" scroll-with-animation :scroll-left="tab_scroll"
		enable-flex="true">
		<view class="tab" :class="{'cur':index === primary}" v-for="(tab,index) in tabs" :key="index" :data-id="index"
			@tap.stop="tabSelect" :style="[tab.children?'padding: 0 18px 0 7px':'']">
			<text>{{showTitle(index)}}</text>
			<text v-if="tab.children" class="cuIcon-triangledownfill subIcon" :data-id="index"
				:class="{'selected':index === primary && popupShow}" @tap="triangledown"></text>
		</view>
	</scroll-view>
	<!-- 遮罩层-->
	<view :class="['mask',{'show':popupShow}]" @tap="popupShow = false"></view>
	<!--4个层级-->
	<view :class="['popup',{'hide':!popupShow}]" v-if="tabs[primary].depth >= 4">
		<scroll-view class="left" :scroll-y="true" enable-flex="true"
			scroll-into-view="{{select[primary]&&'label_'+ select[primary].level2_id}}">
			<block v-for="(one,index) in tabs[primary].children" :key="one.id">
				<view class="left_menu" :id="'label_'+one.id"
					:class="{'bg-white text-red':select[primary]&&select[primary].level2_id === one.id&&!select[primary].level2_cancel}"
					@tap.stop="second_menu_selected(one.id)">
					<text class="text">{{one.name}}</text>
				</view>
			</block>
		</scroll-view>
		<scroll-view class="right" :scroll-y="true"
			:scroll-into-view="select[primary]&&'label_'+ (select[primary].level4_id||select[primary].level3_id)">
			<block v-for="(two,index) in children()" :key="two.id">
				<view class="label" :class="{'text-orange':select[primary]&&select[primary].level3_id === two.id}"
					:id="'label_'+two.id" @tap.top="three_menu_selected(two.id)">
					<text class="text">{{two.name}}</text>
					<text class="cuIcon-check text-lg text-bold"
						v-if="select[primary]&&select[primary].level3_id === two.id"></text>
				</view>
				<view class="items" v-if="two.children">
					<block v-for="(three,three_index) in two.children" :key="three.id">
						<view class="item" @tap.top="four_menu_selected(three.id)"
							:class="{'selected':select[primary]&&select[primary].level4_id === three.id}"
							:id="'label_'+three.id">
							<text class="text">{{three.name}}</text>
						</view>
					</block>
				</view>
				<view class="division"></view>
			</block>
		</scroll-view>
	</view>
	<!--2,3个层级-->
	<view :class="['popup',{'hide':!popupShow}]" v-else-if="tabs[primary].depth <= 3">
		<scroll-view class="filter" scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			scroll-into-view="{{select[primary]&&'label_'+(select[primary].level3_id||select[primary].level2_id)}}"
			:style="{'height:calc(52vh - 108rpx);' : tabs[primary].selector === 'multi'}">
			<block v-for="(one,index) in tabs[primary].children" :key="one.id">
				<view class="label"
					:class="{'text-red text-bold':select[primary]&&select[primary].level2_id === one.id&&!select[primary].level2_cancel}"
					:id="'label_'+ one.id" @tap="second_menu_selected(one.id)">
					<text class="text">{{one.name.name}}</text>
					<text class="cuIcon-check text-lg text-bold"
						v-if="select[primary]&&select[primary].level2_id === one.id&&!select[primary].level2_cancel"></text>
				</view>
				<view class="items items-extend" v-if="one.children">
					<block v-for="(two,three_index) in one.children" :key="two.id">
						<view class="item item-extend" @tap.top="three_menu_selected(two.id)" :id="'label_'+ two.id"
							:class="{'selected':select[primary]&&select[primary].level3_id === two.id}">
							<text class="text">{{two.name.name}}</text>
						</view>
					</block>
				</view>
				<view class="division"></view>
			</block>
		</scroll-view>
		<view class="filterBtn" v-if="tabs[primary].selector === 'multi'">
			<button class="cu-btn radius shadow bg-orange basis-sm margin-right-sm text-lg" @tap.stop="rest_multi">
				<text>重置</text></button>
			<button class="cu-btn radius shadow bg-orange basis-sm text-lg" @tap.stop="">
				<text>确定</text></button>
		</view>
	</view>
</template>

<script>
	/*
	 * @description 一个下拉的菜单
	 * @property {Array} menus 层级数组，id项目的列不能有重复的值
	 * @value [{id:'xxx,name:'xxx',children:[{id:'xxx,name:'xxx'}]},{id:'xxx,name:'xxx',children:[{id:'xxx,name:'xxx'}]]
	 */
	import {
		reactive,
		ref,
		onBeforeMount,
		watch
	} from 'vue';
	import {
		getPropertyFromData,
	} from '@/js_sdk/util.js';
	export default {
		name: 'hoprxi-dropdown',
		props: {
			single: Boolean,
			menus: {
				Type: Array,
				default: []
			},
			props: { // 配置选项
				type: Object,
				default: {
					id: 'id', // 指定id为节点对象的某个属性值
					children: 'children', // 指定子树为节点对象的某个属性值
					name: 'name', // 指定标签为节点对象的某个属性值
					selector: 'selector' //选择类型：缺省单选single不标注,多选标注：multi
				}
			},
		},
		setup(props, content) {
			const tabs = reactive([{
				depth: 1
			}]);
			let tab_scroll = ref(0);
			let primary = ref(0);
			let popupShow = ref(false);
			const tabSelect = (event) => {
				primary.value = event.currentTarget.dataset.id;
				//css tab中 (margin:8+padding:16)*2=48
				if (primary.value <= 2) tab_scroll.value = (primary.value - 1) * 48;
				else if (primary.value > 2 && primary.value <= 5) tab_scroll.value = (primary.value - 0.6) *
				48; //左移时预先显示2个项目
				else tab_scroll.value = (primary.value + 0.6) * 48;
				if (popupShow.value && !tabs[primary.value].children) popupShow.value = false
			};
			const showTitle = (index) => {
				return tabs[index].name
			};
			const triangledown = (event) => {
				let index = event.currentTarget.dataset.id;
				if (index != primary.value && popupShow.value) popupShow.value = true;
				else popupShow.value = !popupShow.value;
			};
			const indexOf = (id, menus = []) => {
				if (!id || !menus || !Array.isArray(menus) || menus.length === 0) return 0;
				let index = 0;
				for (const menu of menus) {
					if (id === menu.id) {
						break;
					}
					index++;
				}
				return index;
			};
			watch(primary, (n, o) => {
				console.log("primary: " + n);
			});
			watch(() => props.menus, () => {
				init()
			}, {
				deep: true //非常重要，没有它menus数组不会被watch到,针对是http请求
			});
			const _translate = (parent) => {
				let result = {
					id: getPropertyFromData(parent, props.props, 'id'),
					name: getPropertyFromData(parent, props.props, 'name'),
				}
				const selector = getPropertyFromData(parent, props.props, 'selector');
				if (selector) {
					result.selector = selector;
				}
				const children = getPropertyFromData(parent, props.props, 'children');
				if (children && Array.isArray(children) && children.length > 0) {
					let items = [];
					for (const child of children) {
						items.push(_translate(child))
					}
					result.children = items;
				}
				return result;
			};
			const depth = (treeData) => {
				let floor = 0
				let max = 0
				const _each = (data, floor) => {
					if (data && Array.isArray(data) && data.length > 0) {
						data.forEach(e => {
							max = floor > max ? floor : max;
							let children = getPropertyFromData(e, props.props, 'children');
							//if (children && Array.isArray(children) && children.length > 0) {
							_each(children, floor + 1)
							//}
						})
					}
				}
				_each(treeData, 1)
				return max + 1;
			};
			const init = () => {
				let i = 0;
				for (const menu of props.menus) {
					if (menu.expand) {
						for (const child of getPropertyFromData(menu, props.props, 'children')) {
							tabs[i] = {
								..._translate(child),
								depth: depth(getPropertyFromData(child, props.props, 'children')),
							}
							i += 1;
						}
						continue;
					}
					//console.log(menu)
					tabs[i] = {
						..._translate(menu),
						depth: depth(getPropertyFromData(menu, props.props, 'children')),
					}
					i += 1;
				}
				console.log(tabs);
			};
			onBeforeMount(init);
			return {
				tabs,
				tab_scroll,
				primary,
				popupShow,
				tabSelect,
				showTitle,
				triangledown,
				indexOf
			}
		},
		data() {
			return {
				select: [],
			}
		},
		methods: {
			children() {
				let first_select = this.select[this.primary]; //第一次点击tab_select
				if (typeof(first_select) === "undefined") {
					if (this.tabs[this.primary].children[0].children) {
						return this.tabs[this.primary].children[0].children;
					}
					return this.tabs[this.primary].children[0];
				}
				let children = this.tabs[this.primary].children;
				let index = this.indexOf(this.select[this.primary].level2_id, children);
				return children[index].children;
			},
			second_menu_selected(id) {
				let second = this.select[this.primary];
				if (typeof(second) !== "undefined" && !second.level2_cancel && second.level2_id && second.level2_id ===
					id) {
					this.$set(this.select, this.primary, {
						level2_id: id,
						level2_cancel: true
					});
				} else {
					this.$set(this.select, this.primary, {
						level2_id: id,
					});
				}
			},
			three_menu_selected(id) {
				let three = this.select[this.primary];
				if (typeof(three) !== "undefined" && three.level3_id && three.level3_id === id) {
					this.$set(this.select, this.primary, {
						level2_id: three.level2_id
					});
				} else {
					let children = this.tabs[this.primary].children;
					this.$set(this.select, this.primary, {
						level2_id: this.findParent(children, id),
						level3_id: id
					});
				}
			},
			four_menu_selected(id) {
				let four = this.select[this.primary];
				if (typeof(four) !== "undefined" && four.level4_id && four.level4_id === id) {
					this.$set(this.select, this.primary, {
						level2_id: this.select[this.primary].level2_id,
						level3_id: this.select[this.primary].level3_id
					});
				} else {
					let level2_id = (typeof(four) !== "undefined" && four.level2_id !== undefined) ? four.level2_id : this
						.tabs[this.primary].children[0].id;
					let sub1 = this.tabs[this.primary].children;
					let index = this.indexOf(level2_id, sub1);
					let sub2 = sub1[index].children;
					let level3_id = this.findParent(sub2, id);
					level2_id = this.findParent(sub1, level3_id);
					let four_object = {
						level2_id: level2_id,
						level3_id: level3_id,
						level4_id: id
					}
					this.$set(this.select, this.primary, four_object);
				}
			},
			three_three_menu_selected(id) {
				this.$emit('selected', {
					index: 0,
					value: 0
				});
			},
			rest_multi() {
				this.$set(this.select, this.primary, {});
			},
			findParent(children, id) {
				for (const v of children) {
					if (v.children) {
						for (const v1 of v.children) {
							if (v1.id === id) return v.id
						}
					}
				}
			},
		}
	}
</script>

<style lang='scss'>
	$select-padding:54px;

	.navigation {
		position: relative;
		z-index: 7;
		white-space: nowrap; //使用横向滚动时，需要给<scroll-view>添加white-space: nowrap;样式
		text-align: center;
		border-bottom: solid 1px #eee;

		.tab {
			display: inline-block;
			height: 42px;
			line-height: 42px;
			margin: 0 4px;
			padding: 0 8px;

			&.cur {
				border-bottom: 3px solid;
				color: #e54d42;
				font-weight: bold;
			}

			.subIcon {
				font-size: 140%;
				position: absolute;
				top: 3px;
				vertical-align: bottom;
				transition: transform .5s ease-in-out, -webkit-transform .5s ease-in-out;

				&.selected {
					transform: rotate(180deg)
				}
			}
		}
	}

	.mask {
		display: flex;
		position: fixed;
		z-index: 6;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;

		&.show {
			opacity: 1;
			transition-duration: 0.3s;
		}
	}

	.popup {
		display: flex;
		position: absolute;
		width: 100%;
		max-height: 40vh;
		max-height: 55vh;
		background-color: #fff;
		z-index: 7;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
		opacity: 1;
		transition: 0.5s;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius:  4px;

		&.hide {
			opacity: 0;
			display: none;
			transition: 0.5s;
		}

		.left {
			display: flex;
			flex-direction: column;
			width: 28vw;
			background-color: #f0f0f0;
			border-bottom-left-radius: 4px;

			.left_menu {
				padding-left: 10px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				.text {
					/*以下垂直居中，仅对一列有效*/
					display: inline-block;
					vertical-align: middle;
					height: 48px;
					line-height: 48px;
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

				.text {
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

				.text {
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
				.text {
					margin: auto;
				}
			}
		}

		.division {
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
		}
	}
</style>
