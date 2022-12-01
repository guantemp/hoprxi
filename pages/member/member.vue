<template>
	<hoprxi-navigation title="会员管理" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]"
		:titleFont="['#FFF','left',400]" :surplusHeight=43>
		<view slot="extendSlot" class="cu-bar search">
			<view class="search-form radius">
				<text class="cuIcon-search"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入会员编号、手机号、拼音助记码"
					confirm-type="search">
				<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
			</view>
		</view>
	</hoprxi-navigation>
<!--
	<hoprxi-tree :trees="categories" checkType="checkbox" :disabledIds="disabledIds" :expandedIds="expandedIds"
		:expendAll="false" :checkedIds="checkedIds" class="margin-left-sm" @check="check">
	</hoprxi-tree>
	-->
</template>

<script>
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				categories: [],
				disabledIds: ["-99"],
				expandedIds: ["1", "3446", "a25423", "gj"],
				checkedIds: ["-99","43645", "754", "1234", "98874", "1532", "b25423", "24325", "24326", "24323465345" ],
				defaultProps: {
					children: 'sub',
					label: 'name'
				},
			}
		},
		created() {
			this.categories = catalog.category;
		},
		methods: {
			check(object) {
				console.log("member");
				console.log(object);
			}
		}
	}
</script>

<style lang='scss'>
</style>
