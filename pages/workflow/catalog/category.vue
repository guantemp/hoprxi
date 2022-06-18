<template>
	<view>
		<hoprxi-navigation title="商品类目" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']"
			:surplusHeight=43>
			<view slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入类目名称、拼音助记码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white">
					<text class="cuIcon-close "></text>
					<text @click="computedScrollViewHeight">取消</text>
				</view>
			</view>
		</hoprxi-navigation>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height: 'calc(100vh - 10px)'}" class="padding-left-sm bg-white">
			<hoprxi-tree :trees="categories" checkType="radio" :disabledIds="disabledIds" :expandedIds="expandedIds"
				:expendAll="false" :checkedIds="checkedIds" checkOnlyLeaf>
			</hoprxi-tree>
		</scroll-view>
	</view>
</template>

<script>
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				categories: [],
				disabledIds: [],
				expandedIds: [],
				checkedIds:[]
			}
		},
		created() {
			this.categories = catalog.category;
		},
		onLoad(options) {
			const id = options.id || '';
			this.expandedIds.push(id);
			this.checkedIds.push(id)	
		},
		methods: {}
	}
</script>

<style>
</style>
