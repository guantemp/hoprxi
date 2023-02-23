<template>
	<hoprxi-navigation title="会员管理" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF','left',400]"
		:surplusHeight=43>
		<view slot="extendSlot" class="cu-bar search">
			<view class="search-form radius">
				<text class="cuIcon-search"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入会员编号、手机号、拼音助记码"
					confirm-type="search">
				<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
			</view>
		</view>
	</hoprxi-navigation>

	<hoprxi-dropdown :menus="categories" :props="defaultProps"></hoprxi-dropdown>

	<view style="padding:12rpx">
		<hoprxi-tip :title="{name:'我的测试',
					weight: 600}" iconFont="cuIcon-goods"></hoprxi-tip>
		<text>爱十分萨法水电费</text>
		<hoprxi-tip :title="{name:'我的测试'}" icon="/static/workflow_icon/order.png"
			:line="{pattern: 'dashed',position:'top'}" arrow></hoprxi-tip>
	</view>
	<hoprxi-drag-fab :menus="menus" direction="vertical"
		@appendGood="$util.navTo('/pages/workflow/catalog/good?sign=good')"
		@appendScale="$util.navTo('/pages/workflow/catalog/good?sign=scale')"
		@editCategories="$util.navTo('/pages/workflow/catalog/category')"
		@recovery="$util.navTo('/pages/public/recovery')">
	</hoprxi-drag-fab>
	<hoprxi-drag-button dock radius class="bg-red"></hoprxi-drag-button>
	<view>{{formatMoney("¥23.2/pcs")}}{{formatMoney("23.23")}}</view>
	<!-- 产地选择对话框 -->
	<view class="cu-modal bottom-modal border-radius">
		<view class="cu-dialog">
			<view class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
				<text @tap.stop.prevent="hideOriginDialog">取消</text>
				<text class="text-orange" @tap.stop.prevent="originDialogConfirm">确定</text>
			</view>
			<hoprxi-area-picker @change="change" :initialArea="['四川省','乐山市','井研县']" ></hoprxi-area-picker>
		</view>
	</view>
	<!--
	<hoprxi-tree :trees="categories" checkType="checkbox" :disabledIds="disabledIds" :expandedIds="expandedIds"
		:expendAll="false" :checkedIds="checkedIds" class="margin-left-sm" @check="check">
	</hoprxi-tree>
	-->
</template>

<script>
	import {
		reactive,
		ref,
		onBeforeMount,
		watch
	} from 'vue';
	import {
		formatMoney,
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import catalog_test from '@/data/catalog_test_data.js'; //用例
	export default {
		setup(props, content) {
			const menus = [{
				iconFont: 'cuIcon-goods',
				text: '新增商品',
				event: 'appendGood'
			}, {
				iconPath: '/static/workflow_icon/new_kg.png',
				selectedIconPath: '/static/workflow_icon/new_kg.png',
				text: '新增散秤',
				event: 'appendScale'
			}, {
				iconFont: 'cuIcon-cascades',
				text: '商品类目',
				event: 'editCategories'
			}, {
				iconPath: '/static/workflow_icon/new_kg.png',
				iconFont: 'cuIcon-comment',
				badge: 10,
				text: '商品品牌',
				event: 'recovery'
			}, {
				iconFont: 'cuIcon-delete',
				badge: 100,
				text: '回收站',
				event: 'recovery'
			}];
			const categories = reactive([]);
			onBeforeMount(() => {
				for (const c of catalog_test.category) categories.push(c)
				categories.splice(0, 0, {
					id: "-9999",
					name: "全部",
				});
			});
			return {
				categories,
				menus
			}
		},
		data() {
			return {
				disabledIds: ["-99"],
				expandedIds: ["1", "3446", "a25423", "gj"],
				checkedIds: ["-99", "43645", "754", "1234", "98874", "1532", "b25423", "24325", "24326", "24323465345"],
				defaultProps: {
					id: 'id', // 指定id为节点对象的某个属性值
					sub: 'sub', // 指定子树为节点对象的某个属性值
					name: 'name', // 指定标签为节点对象的某个属性值
					selector: 'selector' //选择类型 single_select,multi_select
				},
			}
		},
		methods: {
			check(object) {
				console.log("member");
				console.log(object);
			},
			formatMoney(value){
				console.log(formatMoney(value))
			}
		}
	}
</script>

<style lang='scss'>
</style>
