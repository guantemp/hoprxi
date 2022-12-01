<template>
	<view class="workflow">
		<hoprxi-navigation title="业务" :backgroundColor="[1, ['#65FDF0', '#1D6FA3',45]]" :surplusHeight="28"
			:titleFont="['#FFF','center',700]">
			<view slot="extendSlot" class="store" @click="this.$util.navTo('/pages/workflow/store_selection')">
				<text class="cuIcon-location txt"></text>
				<text class="txt">{{store.name}}</text>
			</view>
		</hoprxi-navigation>
		<view class="item">
			<hoprxi-cell decorateIcon="/static/workflow_icon/item.png" title="商品" />
			<view class="cu-list grid col-4 no-border item_grid_list">
				<view class="cu-item " @tap.stop="this.$util.navTo('/pages/workflow/catalog/catalog')">
					<view class="text-red">
						<image class="item_img" src="/static/workflow_icon/archives.png" />
					</view>
					<text>商品档案</text>
				</view>
				<view class="cu-item" @tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_sheet')">
					<view>
						<image class="item_img" src="/static/workflow_icon/readjust.png" />
						<view class="cu-tag badge">
							<block>2</block>
						</view>
					</view>
					<text>调价</text>
				</view>
				<view class="cu-item" @tap.stop="this.$util.navTo('/pages/workflow/label/label')">
					<view class="text-red">
						<image class="item_img" src="/static/workflow_icon/label_printer.png" />
					</view>
					<text>价签打印</text>
				</view>
				<view class="cu-item" @tap.stop="this.$util.navTo('/pages/workflow/price/promotion')">
					<view class="text-red">
						<image class="item_img" src="/static/workflow_icon/promotion.png" />
					</view>
					<text>促销</text>
				</view>
			</view>
		</view>
		<view class="order">
			<hoprxi-cell decorateIcon="/static/workflow_icon/order.png" title="采购"
				:line="['dashed','#e4e7ed','bootom']" />
			<view class="cu-list grid col-4 no-border item_grid_list">
				<view class="cu-item " @tap.stop="this.$util.navTo('/pages/workflow/purchase/order')">
					<view class="text-red">
						<image class="order_img" src="/static/workflow_icon/purchase.png" />
					</view>
					<text>下单</text>
				</view>
				<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
					<view class="text-red">
						<image class="order_img" src="/static/workflow_icon/put_in.png" />
						<view class="cu-tag badge">
							<block>10</block>
						</view>
					</view>
					<text>验收</text>
				</view>
				<view class="cu-item" @tap.stop="this.$util.navTo('/pages/public/not_implemented')">
					<view class="text-red">
						<image class="order_img" src="/static/workflow_icon/chargeback.png" />
					</view>
					<text>退单</text>
				</view>
			</view>
		</view>
		<view class="warehouse">
			<hoprxi-cell decorateIcon="/static/workflow_icon/order.png" title="库管" />
		</view>
	</view>
</template>

<script>
	import {
		reactive
	} from "vue";
	export default {
		setup() {
			const store = reactive({
				name: "旺客隆超市国美绿洲店",
				location: {
					longitude: 79.1256,
					latitude: 115.234
				}
			});
			return {
				store,
			}
		},
		data() {
			return {}
		},
		onLoad: function() {},
		methods: {
			navBack() {
				uni.navigateBack();
			},
		},
	}
</script>

<style lang='scss'>
	.workflow {
		width: 100vw;
		height: 100vh;
		background-color: #F8F8F8;
	}

	.store {
		font-size: 16rpx;
		color: #FFF;
		padding: 10rpx 20rpx;
		align-items: center;

		.txt {
			margin: 0rpx 10rpx;
			font-size: 30rpx;
		}
	}


	.item {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;

		.item_img {
			width: 76rpx;
			height: 76rpx;
		}

		.item_grid_list {
			padding: 20rpx 0rpx 0rpx 0rpx;
		}
	}

	.order {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;

		.order_img {
			width: 76rpx;
			height: 76rpx;
		}

		.order_grid_list {
			padding: 20rpx 0rpx 0rpx 0rpx;
		}
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
