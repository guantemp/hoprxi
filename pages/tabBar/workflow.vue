<template>
	<view class="workflow">
		<hoprxi-navigation title="中台" :backgroundColor="[1, ['#1D6FA3', '#1D6FA3',45]]" :surplusHeight="28"
			:titleFont="['#FFF','center',700]">
			<view slot="extendSlot" class="text-xl padding-left-sm cuIcon-location text-red"
				@click="$util.navTo('/pages/workflow/store_selection')">
				<text class="padding-left-xs text-white text-lg">{{shop.name}}</text>
			</view>
		</hoprxi-navigation>
		<view class="item">
			<hoprxi-tip icon="/static/workflow_icon/item.png" :title="{name:'商品',weight:280}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border">
				<block v-for="(good,index) in goods" :key="index">
					<view class="cu-item" @tap.stop="$util.navTo(good.url)">
						<view v-if="good.iconFont" :class="[good.iconFont,good.color]" style="font-size: 87rpx;">
							<view class="cu-tag badge" v-if="good.new && good.new > 0">
								<block>{{good.new}}</block>
							</view>
						</view>
						<text class="text-xl">{{good.title}}</text>
					</view>
				</block>
			</view>
		</view>
		<view class="purchase">
			<hoprxi-tip icon="/static/workflow_icon/order.png" :title="{name:'采购',weight:320}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border">
				<block v-for="(item,index) in purchase" :key="index">
					<view class="cu-item " @tap.stop="$util.navTo(item.url)">
						<view v-if="item.iconFont" :class="[item.iconFont,item.color]" style="font-size: 87rpx;">
							<view class="cu-tag badge" v-if="item.new && item.new > 0">
								<block>{{item.new}}</block>
							</view>
						</view>
						<text class="text-xl">{{item.title}}</text>
					</view>
				</block>
			</view>
		</view>
		<view class="warehouse">
			<hoprxi-tip icon="/static/workflow_icon/order.png" :title="{name:'库管',weight:320}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border">
				<block v-for="(item,index) in warehouses" :key="index">
					<view class="cu-item " @tap.stop="$util.navTo(item.url)">
						<view v-if="item.iconFont" :class="[item.iconFont,item.color]" style="font-size: 87rpx;">
							<view class="cu-tag badge" v-if="item.new && item.new > 0">
								<block>{{item.new}}</block>
							</view>
						</view>
						<text class="text-xl">{{item.title}}</text>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reactive
	} from "vue";
	import ajax from '@/uni_modules/u-ajax'
	export default {
		setup() {
			const shop = reactive({
				name: '盛源超市',
				address: '福集镇明星路76号',
				location: {
					longitude: 105.37603713392744,
					latitude: 29.155733003496554
				},
				id: 4
			});
			const goods = [{
				iconFont: 'icon-goods',
				color: "text-blue",
				url: '/pages/workflow/catalog/catalog',
				title: '商品档案',
				new: 3
			}, {
				iconFont: 'icon-price-adjustment',
				color: "text-olive",
				url: '/pages/workflow/price/price_adjustment_sheet',
				title: '调价单',
			}, {
				iconFont: 'icon-label-print',
				color: "text-brown",
				url: '/pages/workflow/label/label',
				title: '标签打印',
			}, {
				iconFont: 'icon-promotion',
				color: "text-red",
				url: '/pages/workflow/price/promotion',
				title: '促销',
				new: 9
			}];
			const purchase = [{
				iconFont: 'icon-contract',
				color: "text-cyan",
				url: '/pages/workflow/purchase/order',
				title: '合同',
			}, {
				iconFont: 'icon-purchase-order',
				color: "text-grey",
				url: '/pages/workflow/purchase/order',
				new: 12,
				title: '订单',
			}, {
				iconFont: 'icon-purchase-receipt',
				color: "text-blue",
				url: '/pages/public/not_implemented',
				title: '验收入库',
			}, {
				iconFont: 'icon-return-goods',
				color: "text-olive",
				url: '/pages/public/not_implemented',
				title: '退货',
			}];
			const warehouses = [{
				iconFont: 'icon-contract',
				color: "text-cyan",
				url: '/pages/workflow/purchase/order',
				title: '库存查询',
			}, {
				iconFont: 'icon-purchase-order',
				color: "text-grey",
				url: '/pages/workflow/purchase/order',
				new: 1,
				title: '预盘单',
			}, {
				iconFont: 'icon-purchase-receipt',
				color: "text-blue",
				url: '/pages/public/not_implemented',
				title: '出入库',
			}];
			return {
				shop,
				goods,
				purchase,
				warehouses
			}
		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.data.shop !== undefined) { //接收的数据
				this.shop.id = currPage.data.shop.id;
				this.shop.name = currPage.data.shop.name;
				this.shop.location = currPage.data.shop.location;
			}
		}
	}
</script>

<style lang='scss'>
	.workflow {
		background-color: #8799a3;
		height: 100vh;
	}

	.item {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;
	}

	.purchase {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;
	}

	.warehouse {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;
	}
</style>
