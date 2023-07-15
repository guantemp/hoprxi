<template>
	<scroll-view scroll-x class="navigation bg-white" scroll-with-animation :scroll-left="tab_scroll"
		enable-flex="true">
		<view :class="['tab',{'cur':index === primary}]" v-for="(tab,index) in tabs" :key="tab.id" :data-id="index"
			@tap.stop="tabSelect" :style="[tab.children?'padding: 0 18px 0 7px':'']">
			<text>{{showTitle(index)}}</text>
			<text v-if="tab.children" class="cuIcon-triangledownfill subIcon"
				:class="{'selected':index === primary && popupShow}" @tap="triangledown(index)"></text>
		</view>
	</scroll-view>
	<!-- 遮罩层-->
	<view :class="['mask',{'show':popupShow}]" @tap="popupShow = false"></view>
	<!--最多4个层级-->
	<view :class="['popup',{'hide':!popupShow}]" v-if="tabs[primary].depth >= 4">
		<scroll-view scroscroll-into-view="{{selected[primary]&&'secondary_'+ selected[primary].secondary_id}}">
			<block v-for="(secondary,index) in tabs[primary].children" :key="secondary.id">
				<view class="left_menu" :id="'secondary_'+secondary.id"
					:class="{'bg-white text-red':selected[primary]&&selected[primary]['secondary']&&selected[primary].secondary.id === secondary.id}"
					@tap.stop="secondary_menu_select(index,secondary.id,secondary.name)">
					<text class="text">{{secondary.name}}</text>
				</view>
			</block>
		</scroll-view>
		<scroll-view class="right" :scroll-y="true"
			:scroll-into-view="'three_level_'+ (selected[primary]&&selected[primary].three_level&&selected[primary].three_level.id)">
			<block v-for="(three_level,index) in three_level_menus" :key="three_level.id">
				<view class="label"
					:class="{'text-red':selected[primary]&&selected[primary].three_level&&selected[primary].three_level.id === three_level.id}"
					:id="'three_level_'+three_level.id"
					@tap.top="three_level_menu_select(three_level.id,three_level.name)">
					<text class="text">{{three_level.name}}</text>
					<text class="cuIcon-check text-lg text-bold"
						v-if="selected[primary]&&selected[primary].three_level&&selected[primary].three_level.id === three_level.id"></text>
				</view>
				<view class="items" v-if="three_level.children">
					<block v-for="(four_level,index) in three_level.children" :key="four_level.id">
						<view class="item" @tap.top="four_level_menu_select(four_level.id,four_level.name)"
							:class="{'selected':selected[primary]&&selected[primary].four_level&&selected[primary].four_level.id === four_level.id}">
							<text class="text">{{four_level.name}}</text>
						</view>
					</block>
				</view>
				<view class="division"></view>
			</block>
		</scroll-view>
	</view>
	<!--2、3个层级-->
	<view :class="['popup',{'hide':!popupShow}]" v-else-if="tabs[primary].depth <= 3">
		<scroll-view class="filter" scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			scroll-into-view="{{selected[primary]&&'secondary_'+(selected[primary].secondary&&selected[primary].secondary.id)}}"
			:style="{'height:calc(52vh - 108rpx);' : tabs[primary].selector === 'multi'}">
			<block v-for="(secondary,index) in tabs[primary].children" :key="secondary.id">
				<view class="label"
					:class="{'text-red text-bold':selected[primary]&&selected[primary].secondary&&selected[primary].secondary.id === secondary.id}"
					:id="'secondary_'+ secondary.id" @tap="secondary_menu_select(index,secondary.id,secondary.name)">
					<text class="text">{{secondary.name}}</text>
					<text class="cuIcon-check text-lg text-bold"
						v-if="selected[primary]&&selected[primary].secondary&&selected[primary].secondary.id === secondary.id"></text>
				</view>
				<view class="items items-extend" v-if="secondary.children">
					<block v-for="(three_level,three_index) in secondary.children" :key="three_level.id">
						<view class="item item-extend"
							@tap.top="three_level_menu_select(three_level.id,three_level.name)"
							:class="{'selected':selected[primary]&&selected[primary].three_level&&selected[primary].three_level.id === three_level.id}">
							<text class="text">{{three_level.name}}</text>
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

<script setup>
	/**
	 * @description 一个下拉的菜单
	 * @property {Array} menus 层级数组，id项目的列不能有重复的值
	 * @value [{id:'xxx,name:'xxx',children:[{id:'xxx,name:'xxx'}]},{id:'xxx,name:'xxx',children:[{id:'xxx,name:'xxx'}]]
	 * @property {Bboolean} single 全局单选
	 * @property {Function() <array> {}} confirm 返回所有选中的对象
	 **/
	import {
		reactive,
		ref,
		onBeforeMount,
		watch,
		computed
	} from 'vue';
	import {
		getPropertyFromData,
	} from '@/js_sdk/util.js';
	name: 'hoprxi-dropdown';
	const props = defineProps({
		single: Boolean,
		menus: {
			Type: Array,
			default: []
		},
		props: { // 配置menus数据结构
			type: Object,
			default: {
				id: 'id', // 指定id为节点对象的某个属性值
				children: 'children', // 指定子树为节点对象的某个属性值
				name: 'name', // 指定标签为节点对象的某个属性值
				selector: 'selector' //选择类型：缺省单选single不标注,多选标注：multi
			}
		}
	});
	const emits = defineEmits(["changed"]);
	const tabs = reactive([{
		depth: 1
	}]);
	const tab_scroll = ref(0);
	const primary = ref(0);
	const popupShow = ref(false);
	const selected = reactive([]);
	const tabSelect = (event) => { //没有考虑每个选项占用空间，会有bug,还没找到办法
		primary.value = event.currentTarget.dataset.id;
		//css tab中 (margin:8+padding:16)*2=48
		// 尽量左右滑动显示平滑的处理
		if (primary.value <= 2) tab_scroll.value = (primary.value - 1) * 48;
		else if (primary.value > 2 && primary.value <= 5) tab_scroll.value = (primary.value - 0.5) * 48;
		else if (primary.value > 5 && primary.value <= 8) tab_scroll.value = primary.value * 48;
		else tab_scroll.value = (primary.value + 0.5) * 48;
		if (popupShow.value && !tabs[primary.value].children) popupShow.value = false
	};
	const showTitle = computed(() => {
		return (index) => {
			if (selected[index]) {
				let temp = selected[index];
				return (temp.four_level && temp.four_level.name) || (temp.three_level && temp
					.three_level.name) || (temp.secondary && temp.secondary.name)
			}
			return tabs[index].name
		}
	});
	const triangledown = (index) => {
		if (index != primary.value && popupShow.value) popupShow.value = true;
		else popupShow.value = !popupShow.value;
	};
	const secondary_menu_select = (index, id, name) => {
		let second = selected[primary.value];
		if (second && second.secondary && second.secondary.id === id) { //second!=null
			selected[primary.value] = null;
		} else {
			selected[primary.value] = {
				secondary: {
					index: index,
					id: id,
					name: name,
				}
			};
		}
		emits('changed');
		//console.log(selected[primary.value]);
	};
	const three_level_menus = computed(() => {
		let first_select = selected[primary.value];
		if (first_select == null) { //点击一级菜单(即tabs)展开,此时secondary未赋值,缺省认为secondary是第一个
			return tabs[primary.value].children[0].children;
		}
		let secondary = tabs[primary.value].children;
		return secondary[selected[primary.value].secondary.index].children
	});
	const three_level_menu_select = (id, name) => {
		let three = selected[primary.value];
		if (three && three.three_level && three.three_level.id === id) {
			delete selected[primary.value].three_level
		} else {
			if (tabs[primary.value].depth <= 3) {
				let secondary = findParent(tabs[primary.value].children, id);
				selected[primary.value] = {
					secondary: {
						id: secondary.id,
						name: secondary.name
					}
				};
			}
			//深度>=4时，直接点三级菜单需要预设二级菜单
			if (!selected[primary.value] || !selected[primary.value].secondary)
				selected[primary.value] = {
					secondary: {
						index: 0,
						id: tabs[primary.value].children[0].id,
						name: tabs[primary.value].children[0].name
					}
				};
			selected[primary.value].three_level = {
				id: id,
				name: name
			}
		}
		delete selected[primary.value].four_level //再次点击移除
	};
	const four_level_menu_select = (id, name) => {
		let four = selected[primary.value];
		if (!four) { //直接点击四级菜单，二级菜单缺省为第一位
			selected[primary.value] = {
				secondary: {
					index: 0,
					id: tabs[primary.value].children[0].id,
					name: tabs[primary.value].children[0].name
				}
			};
		}
		if (four && four.four_level && four.four_level.id === id) {
			delete selected[primary.value].four_level //true
		} else {
			let three = findParent(tabs[primary.value].children[selected[primary.value].secondary.index]
				.children, id); //直接选4级要回溯此时父级(三级)是哪个
			selected[primary.value].three_level = {
				id: three.id,
				name: three.name
			};
			selected[primary.value].four_level = {
				id: id,
				name: name
			}
		}
	};
	const findParent = (data, id) => {
		for (const d of data) {
			if (d.children) {
				for (const v of d.children) {
					if (v.id === id) {
						return {
							id: d.id,
							name: d.name
						}
					}
				}
			}
		}
	};
	const init = () => {
		const _translate = (parent) => {
			let result = {
				id: getPropertyFromData(parent, props.props, 'id'),
				name: getPropertyFromData(parent, props.props, 'name'),
			};
			const selector = getPropertyFromData(parent, props.props, 'selector');
			if (selector) {
				result.selector = selector;
			};
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
						_each(children, floor + 1)
					})
				}
			}
			_each(treeData, 1)
			return max + 1;
		};
		let i = 0;
		for (const menu of props.menus) {
			if (menu.expand && Array.isArray(getPropertyFromData(menu, props.props, 'children'))) {
				for (const child of getPropertyFromData(menu, props.props, 'children')) {
					tabs[i] = {
						..._translate(child),
						depth: depth(getPropertyFromData(child, props.props, 'children')),
					}
					i += 1;
				}
				continue;
			}
			tabs[i] = {
				..._translate(menu),
				depth: depth(getPropertyFromData(menu, props.props, 'children')),
			}
			i += 1;
		}
		//console.log(tabs);
	};
	const rest_multi = () => {
		selected[primary.value] = {};
		//this.$set(this.select, this.primary, {});
	};
	watch(() => props.menus, () => {
		init()
	}, {
		deep: true //非常重要，没有它menus数组不会被watch到,针对http请求开始为空，然后再有数据到来
	});
	onBeforeMount(init);
</script>

<style lang='scss'>
	$select-padding: 54px;

	.navigation {
		position: relative;
		z-index: 3;
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
		z-index: 2;
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
		max-height: 38vh;
		max-height: 55vh;
		background-color: #fff;
		z-index: 3;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
		opacity: 1;
		transition: 0.5s;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;

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
			padding: 0 3px 0 10px;

			.label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-right: 12px;
				padding-left: 4px;

				.text {
					height: 41px;
					line-height: 41px;
				}
			}
		}

		.filter {
			.label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 13px;

				.text {
					height: 39px;
					line-height: 39px;
				}
			}

			.items-extend {
				padding: 0 1px 0 12px;

				.item-extend {
					flex: 0 0 30%;
					min-height: 37px;
					margin-right: calc(8px*3 / 2);
				}
			}
		}

		.items {
			display: flex;
			flex-wrap: wrap;

			.item {
				display: flex;
				justify-content: center;
				font-size: 14px;
				/*重要设置上下左右居中*/
				text-align: center;
				flex: 0 0 32%;
				min-height: 34px;
				margin-right: calc(2px*3 / 2);
				background-color: #f0f0f0;
				border-radius: 3px;
				margin-bottom: 8px;
				border: solid #f5f5f5 1px;
				padding: 2px 4px;

				&.selected {
					border-color: #e54d42;
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
			border-bottom: dashed 1px #e5e5e5;
			margin: 0 6px;
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