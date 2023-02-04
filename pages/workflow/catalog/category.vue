<template>
	<hoprxi-navigation title="商品类目" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']"
		:surplusHeight=43 id="navigation">
		<view slot="extendSlot" class="cu-bar search">
			<view class="search-form radius" style="height:76rpx">
				<text class="cuIcon-search text-bold text-xl"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入类目名称/拼音助记码"
					confirm-type="search" placeholder-class="text-df">
			</view>
		</view>
	</hoprxi-navigation>
	<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true" class="padding-left-sm bg-white"
		:style="{height:'calc(100vh - ' + navigationHeight + 'px)'}">
		<hoprxi-tree :trees="categories" checkType="radio" :disabledIds="disabledIds" :expandedIds="expandedIds"
			:expendAll="false" :checkedIds="checkedIds" checkOnlyLeaf @check="check">
		</hoprxi-tree>
	</scroll-view>
</template>

<script>
	import {
		ref,
		onBeforeMount,
		reactive
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		setup(props, content) {
			let navigationHeight = ref(0);
			let tempCategories = reactive([])
			const categories = reactive([]);
			const expandedIds = reactive([]);
			const checkedIds = reactive([]);
			onBeforeMount(() => {
				ajax({
					url: 'https://hoprxi.tooo.top/catalog/core/v1/categories',
				}).then(res => {
					for (const category of res.data.categories) {
						if (category.id === "-1") {
							tempCategories.splice(0, 0, {
								id: category.id,
								name: category.name.name
							})
						} else if (Array.isArray(category.children)) {
							for (const child of category.children) {
								let temp = {
									id: child.id,
									name: child.name.name
								};
								if (child.children) {
									temp = {
										...temp,
										children: child.children
									}
								}
								tempCategories.push(temp);
							}
						}
					}
					console.log(tempCategories);
				}).catch(err => {})
				for (const c of catalog.category) categories.push(c)
				categories.splice(0, 0, {
					id: "-9999",
					name: "全部",
				});
			})
			return {
				navigationHeight,
				categories,
				expandedIds,
				checkedIds
			}
		},
		onReady() {
			this.$nextTick(() => {
				uni.createSelectorQuery().select('#navigation').boundingClientRect(res => {
					this.navigationHeight += res.height;
				}).exec();
			})
		},
		onLoad(options) {
			if (options.id) {
				this.expandedIds.push(options.id);
				this.checkedIds.push(options.id)
			}
		},
		methods: {
			selectedCategory() {
				let pages = getCurrentPages();
				//let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// #ifdef H5
				prevPage.$vm.shop = this.currentShop;
				// #endif
				// #ifdef MP-WEIXIN
				prevPage.setData({
					category: {
						id: 1242355756,
						name: 水电费
					}
				});
				// #endif
			},
			check(data){//此事件递归tree-item中扔出的
				console.log(data);
			}
		}
	}
</script>

<style>
</style>
