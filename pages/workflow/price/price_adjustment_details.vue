<template>
	<view class="price_adjustment_datails bg-grey">
		<hoprxi-navigation title="调价明细" :backgroundColor="[1, ['#AC32E4', '#7918F2', -225]]"
			tabPage="/pages/index/index" :titleFont="['#FFF']" :surplusHeight="fold?80:15">
			<view slot="extendSlot">
				<view v-show="fold">
					<view class="flex flex-direction text-white margin-tb-xs margin-lr">
						<view class="grid-item-container">
							<text class="shop1">适用门店：</text>
							<text class="shop2 text-cut">{{price_adjustment.store}}</text>
						</view>
						<view class="grid-item-container align-center">
							<text class="shop1">生效日期：</text>
							<text class="shop2">{{price_adjustment.effectDate}}</text>
						</view>
						<view class="grid-item-container">
							<text class="shop1">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</text>
							<text class="shop2">{{price_adjustment.remark}}</text>
						</view>
					</view>
				</view>
				<text class="flex justify-center text-white text-bold" :class="fold?'cuIcon-fold':'cuIcon-unfold'"
					@click="foldClick"></text>
			</view>
		</hoprxi-navigation>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height: fold?'calc(100vh - 140px)':'calc(100vh - 125px)'}">
			<block v-for="(item,index) in price_adjustment.items" :key="index">
				<view class="flex flex-direction radius margin-xs bg-white">
					<view class='flex justify-between padding-lr-sm padding-top-sm align-center'>
						<text class="text-bold text-cut">品名：{{item.name}}</text>
						<text v-if="price_adjustment.approval!=='pass'" class="cuIcon-delete text-blue"
							@click="deleteItem(item.id||item.plu)"></text>
					</view>
					<view class="flex justify-between margin-lr-sm padding-tb-xs dashed-bottom"
						@click='editItem(item.id||item.plu)'>
						<text v-if="item.barcode">商品条码：{{item.barcode}}</text>
						<text v-else>plu号：{{item.plu}}</text>
						<text>规格：{{item.specs}}</text>
					</view>
					<template
						v-if="(item.newRetailPrice&&item.newMemberPrice)||(item.newRetailPrice&&item.newVipPrice)||(item.newMemberPrice&&item.newVipPrice)">
						<view class='grid col-3' @click='editItem(item.id||item.plu)'>
							<view class='cu-item padding-left flex flex-direction'>
								<text>原零售价</text>
								<text class="text-lg text-cyan text-price  padding-tb-xs"
									:style="item.retailPrice&&item.newRetailPrice?'text-decoration:line-through':''">{{item.retailPrice}}</text>
							</view>
							<view class='cu-item padding-left flex flex-direction'>
								<text>原会员价</text>
								<text class="text-lg text-cyan text-price padding-tb-xs"
									:style="item.memberPrice&&item.newMemberPrice?'text-decoration:line-through':''">{{item.memberPrice}}</text>
							</view>
							<view class='cu-item padding-left flex flex-direction'>
								<text>原PLUS会员价</text>
								<text class="text-lg text-cyan text-price padding-tb-xs"
									:style="item.vipPrice&&item.newVipPrice?'text-decoration:line-through':''">{{item.vipPrice}}</text>
							</view>
							<view class='cu-item padding-left flex flex-direction'>
								<text>现零售价</text>
								<text
									class="text-lg text-red text-price padding-tb-xs">{{item.newRetailPrice||'--'}}</text>
							</view>
							<view class='cu-item padding-left  flex flex-direction'>
								<text>现会员价</text>
								<badge dot class="padding-tb-xs">
									<text
										class="text-lg text-red text-price padding-tb-xs">{{item.newMemberPrice||'--'}}</text>
								</badge>
							</view>
							<view class='cu-item padding-left flex flex-direction'>
								<text>现PLUS会员价</text>
								<badge count="9" class="padding-tb-xs">
									<text class="text-lg text-red text-price">{{item.newVipPrice||'--'}}</text>
								</badge>
							</view>
						</view>
					</template>
					<template v-else>
						<view v-if="item.newRetailPrice" class="grid col-2" @click='editItem(item.id||item.plu)'>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>原零售价</text>
								<badge count="15.54%" class="padding-tb-xs">
									<text class="text-lg text-cyan text-price"
										:style="item.retailPrice&&item.newRetailPrice?'text-decoration:line-through':''">{{item.retailPrice}}</text>
								</badge>
							</view>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>现零售价</text>
								<badge count="12.54%" class="padding-tb-xs">
									<text class="text-lg text-orange text-price">{{item.newRetailPrice}}</text>
								</badge>
							</view>
						</view>
						<view v-else-if="item.newMemberPrice" class="grid col-2" @click='editItem(item.id||item.plu)'>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>原会员价</text>
								<text class="text-lg text-cyan text-price padding-tb-xs"
									:style="item.memberPrice&&item.newMemberPrice?'text-decoration:line-through':''">{{item.memberPrice}}</text>
							</view>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>现会员价</text>
								<text
									class="text-lg text-orange text-price padding-tb-xs">{{item.newMemberPrice}}</text>
							</view>
						</view>
						<view v-else class="grid col-2" @click='editItem(item.id||item.plu)'>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>原PLUS会员价</text>
								<text class="text-lg text-cyan text-price padding-tb-xs"
									:style="item.vipPrice&&item.newVipPrice?'text-decoration:line-through':''">{{item.vipPrice}}</text>
							</view>
							<view class='cu-item padding-left-lg flex flex-direction'>
								<text>现PLUS会员价</text>
								<text class="text-lg text-orange text-price padding-tb-xs">{{item.newVipPrice}}</text>
							</view>
						</view>
					</template>
				</view>
			</block>
		</scroll-view>
		<!--bootom-->
		<view class="bottom cu-bar bg-white tabbar border" v-if="price_adjustment.approval!=='pass'">
			<view class="action" @tap.stop="this.$util.navTo('/pages/workflow/label/label')">
				<view class="icon-label-print margin-bottom-xs" style="font-size: 38rpx"></view>打印标签
			</view>
			<view class="action" @tap.stop="showClearModalDialog">
				<view class="cuIcon-delete">
					<view v-if="price_adjustment.items.length > 0" class="cu-tag badge">
						{{price_adjustment.items.length}}
					</view>
				</view>
				清空
			</view>
			<view class="bg-orange submit" @click.stop="showAddItemModalDialog" data-target="DialogModalAdd">添加商品</view>
			<view class="bg-red submit">保存</view>
		</view>
		<hoprxi-drag-button @click="this.$util.toast('测试')" class="text-xxl" radius>
			<text class="text-grey icon-print"></text>
		</hoprxi-drag-button>
		<!-- 清空商品对话框 -->
		<view class="cu-modal" :class="clearModalDialog?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="content">删除提示</view>
				</view>
				<view class="padding-xl bg-white text-bold">
					<text>此操作将清除已添加的所有商品！</text>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green" @tap="hideClearModalDialog">取消</view>
					<view class="action margin-0 flex-sub solid-left" @tap="clearItems">确定</view>
				</view>
			</view>
		</view>
		<!-- 商品明细模态对话框 -->
		<view class="cu-modal bottom-modal" :class="itemModalDialog?'show':''">
			<view class="cu-dialog">
				<view @tap="hideItemModalDialog" class="bg-white text-right padding-tb-sm padding-lr-lg">
					<text class="cuIcon-close text-red text-bold text-xl"></text>
				</view>
				<view class="bg-purple light text-left">
					<view v-if="addSign" class="cu-bar search">
						<view class="search-form radius">
							<text class="cuIcon-search"></text>
							<input v-model="scanResult" :adjust-position="false" placeholder="请输入商品条码、名称、拼音"
								confirm-type="search" @confirm="searchConfirm">
							<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
						</view>
						<view class="action text-white">
							<text class="cuIcon-close "></text>
							<text @click="searchCancel">取消</text>
							<text class="cuIcon-goods margin-left-xs" @tap.stop="query"></text>
						</view>
					</view>
					<view class="flex justify-between padding-lr-sm" :class="addSign?'':'padding-top-sm'">
						<text class="text-bold">品名：{{item.name}}</text>
						<text class="icon-unit text-blue" @tap.stop="showUnitDrawerModal"></text>
					</view>
					<view class="flex justify-between padding-lr-sm padding-tb-xs">
						<text v-if="item.plu">plu号：{{item.plu}}</text>
						<text v-else>商品条码：{{item.barcode}}</text>
						<text>规格：{{item.specs}}</text>
					</view>
					<view class="grid col-3 padding-tb-sm margin-lr-sm radius margin-bottom-xs"
						style="background-color: #7918F2;color:#fff">
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text class="cuIcon-vip"
								@click.stop="this.$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域参考售价</text>
							<text
								class="text-lg text-bold text-cyan text-price padding-tb-xs">{{item.vip.referenceSalePrice}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text class="cuIcon-vip"
								@click.stop="this.$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域参考进价</text>
							<text
								class="text-lg text-bold text-cyan text-price padding-tb-xs">{{item.vip.referencePurchasePrice}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text>最近入库价</text>
							<text
								class="text-lg text-bold text-price padding-tb-xs text-yellow">{{item.storage.lastPurchasePrice}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text class="padding-tb-xs">库存数量</text>
							<text class="text-lg text-bold text-pink">{{item.storage.number}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text class="padding-tb-xs">库存金额</text>
							<text class="text-lg text-bold text-pink text-price">{{item.storage.amount}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text class="padding-tb-xs cuIcon-question">存货周转率</text>
							<text class="text-lg text-bold text-green">{{item.storage.stockTurn}}</text>
						</view>
					</view>
					<view class="flex flex-direction margin-lr-sm">
						<view>
							<text class="cuIcon-sponsor margin-right-xs text-orange"></text>
							<text class="text-black">零售价</text>
						</view>
						<view class="grid col-2 align-center">
							<view>
								<text>原：</text>
								<badge v-if="item.retailPrice" :count="'毛利率：'+ oldRetailGrossProfitRate">
									<text class="text-price text-blue"
										:style="newRetailPrice||item.newRetailPrice?'text-decoration:line-through':''">{{item.retailPrice}}</text>
								</badge>
								<text v-else class="text-price text-blue">--</text>
							</view>
							<view class="flex align-center">
								<text>现：</text>
								<text class="text-price"></text>
								<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate"
									class="solid-bottom text-red basis-sm">
									<input :placeholder="item.newRetailPrice" type="digit" v-model="newRetailPrice"
										@blur="blur('sale')">
								</badge>
								<input v-else :placeholder="item.newRetailPrice" type="digit" v-model="newRetailPrice"
									@blur="blur('sale')" class="solid-bottom text-red basis-xl">
							</view>
						</view>
					</view>
					<view class="flex flex-direction margin-lr-sm">
						<view>
							<text class="cuIcon-my text-orange margin-right-xs"></text>
							<text class="text-black">会员价</text>
						</view>
						<view class="grid col-2 align-center">
							<view>
								<text>原：</text>
								<badge v-if="item.memberPrice" :count="'毛利率：'+ oldMemberGrossProfitRate">
									<text class="text-price text-blue"
										:style="newMemberPrice||item.newMemberPrice?'text-decoration:line-through':''">{{item.memberPrice}}</text>
								</badge>
								<text v-else class="text-price text-blue">--</text>
							</view>
							<view class="flex align-center">
								<text>现：</text>
								<text class="text-price"></text>
								<badge v-if="memberGrossProfitRate" :count="'毛利率：'+ memberGrossProfitRate"
									class="solid-bottom text-red basis-sm">
									<input :placeholder="item.newMemberPrice" v-model="newMemberPrice" type="digit"
										@blur="blur('member')">
								</badge>
								<input v-else :placeholder="item.newMemberPrice" type="digit" v-model="newMemberPrice"
									@blur="blur('member')" class="solid-bottom text-red basis-xl">
							</view>
						</view>
					</view>
					<view class="flex flex-direction margin-lr-sm">
						<view>
							<text class="cuIcon-vip text-orange margin-right-xs"></text>
							<text class="text-black">PLUS会员价</text>
						</view>
						<view class="grid col-2 align-center">
							<view>
								<text>原：</text>
								<badge v-if="item.vipPrice" :count="'毛利率：'+ oldVipGrossProfitRate">
									<text class="text-price text-blue"
										:style="newVipPrice||item.newVipPrice?'text-decoration:line-through':''">{{item.vipPrice}}</text>
								</badge>
								<text v-else class="text-price text-blue">--</text>
							</view>
							<view class="flex align-center">
								<text>现：</text>
								<text class="text-price"></text>
								<badge v-if="vipGrossProfitRate" :count="'毛利率：'+ vipGrossProfitRate"
									class="solid-bottom text-red basis-sm">
									<input :placeholder="item.newVipPrice" v-model="newVipPrice" type="digit"
										@blur="blur('vip')">
								</badge>
								<input v-else :placeholder="item.newVipPrice" type="digit" v-model="newVipPrice"
									@blur="blur('vip')" class="solid-bottom text-red basis-xl">
							</view>
						</view>
					</view>
					<view class="flex justify-end margin-right-sm padding-tb-sm">
						<button v-if="addSign" class="cu-btn block radius shadow confirmBtn bg-gradual-purple basis-sm"
							@tap.stop="addItem">
							<text class="cuIcon-add margin-right-sm"></text>增加</button>
						<button class="cu-btn block radius shadow confirmBtn bg-gradual-purple margin-left-xs"
							:class="addSign?'basis-sm':'basis-lg'" @tap.stop="saveItem">
							保存</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 单位选择抽屉框 -->
		<view class="cu-modal drawer-modal justify-end" :class="unitDrawerModal?'show':''" @tap="hideUnitDrawerModal">
			<view class="cu-dialog basis-lg bg-white" @tap.stop=""
				:style="[{top:140+'px',height:'calc(100vh - ' + 140 + 'px)'}]">
				<view class="padding-sm solid-bottom text-left">
					<text class="cuIcon-titles text-orange"></text>
					<text>重置价格单位</text>
				</view>
				<view class="units text-df">
					<block v-for="(unitItem, index) in units" :key="index">
						<text class="padding-tb-xs padding-lr text-center margin-top-sm"
							:class="unitItem===unit?'unitSelected text-red light bg-orange':'unit bg-grey'"
							@tap.stop="selectUnit(unitItem)">{{unitItem}}</text>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDate,
	} from '@/js_sdk/util.js';
	import price_adjustment from '@/data/price_adjustment_details_test_data.js'; //测试数据
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				fold: true,
				addSign: true,
				price_adjustment: {},
				item: {
					id: "--",
					name: '--',
					barcode: '--',
					specs: '--',
					retailPrice: '--',
					memberPrice: '--',
					vipPrice: '--',
					newRetailPrice: '--',
					newMemberPrice: '--',
					vip: {
						referenceSalePrice: '--',
						referencePurchasePrice: '--'
					},
					storage: {
						lastPurchasePrice: '--',
						amount: 226,
						number: 12,
						stockTurn: 1.33
					}
				},
				itemModalDialog: false,
				newRetailPrice: null,
				newMemberPrice: null,
				newVipPrice: null,
				oldRetailGrossProfitRate: '',
				oldMemberGrossProfitRate: '',
				oldVipGrossProfitRate: '',
				retailGrossProfitRate: '',
				memberGrossProfitRate: '',
				vipGrossProfitRate: '',
				unitDrawerModal: false,
				unit: null,
				units: [],
				clearModalDialog: false,
			}
		},
		onLoad(options) {
			setTimeout(() => {
				let sheetNumber = options.sheetNumber || '';
				for (const i of price_adjustment.price_adjustment) {
					if (sheetNumber === i.sheetNumber) {
						this.price_adjustment = i;
						console.log(this.price_adjustment.items.length);
						break;
					}
				}
				this.units = catalog.units;
			}, 300);
		},
		watch: {
			unit() {
				let pattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
				if (this.newRetailPrice) this.newRetailPrice = this.newRetailPrice.replace(pattern, '') + "/" + this.unit;
				if (this.item.newRetailPrice) this.item.newRetailPrice = this.item.newRetailPrice.replace(pattern, '') +
					"/" + this.unit;
				if (this.newMemberPrice) this.newMemberPrice = this.newMemberPrice.replace(pattern, '') + "/" + this.unit;
				if (this.item.newMemberPrice) this.item.newMemberPrice = this.item.newMemberPrice.replace(pattern, '') +
					"/" + this.unit;
				if (this.newVipPrice) this.newVipPrice = this.newVipPrice.replace(pattern, '') + "/" + this.unit;
				if (this.item.newVipPrice) this.item.newVipPrice = this.item.newVipPrice.replace(pattern, '') + "/" + this
					.unit;
			}
		},
		methods: {
			foldClick() {
				this.fold = !this.fold;
			},
			editItem(key) {
				let that = this;
				that.itemModalDialog = true;
				let pattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
				for (const i of that.price_adjustment.items) {
					if (i.id === key || i.plu === key) {
						that.item = i;
						that.unit = pattern.exec(i.retailPrice)[1];
						let cost = that.item.storage.lastPurchasePrice.replace(pattern, '');
						that.oldRetailGrossProfitRate = that.computedGrossProfitRate(cost, that.item.retailPrice.replace(
							pattern, '')) + '%';
						if (that.item.newRetailPrice) {
							that.retailGrossProfitRate = that.computedGrossProfitRate(cost, that.item.newRetailPrice
								.replace(pattern, '')) + '%';
						}
						that.oldMemberGrossProfitRate = that.computedGrossProfitRate(cost, that.item.memberPrice.replace(
							pattern, '')) + '%';
						if (that.item.newMemberPrice) {
							that.memberGrossProfitRate = that.computedGrossProfitRate(cost, that.item.newMemberPrice
								.replace(pattern, '')) + '%';
						}
						that.oldVipGrossProfitRate = that.computedGrossProfitRate(cost, that.item.vipPrice.replace(pattern,
							'')) + '%';
						if (that.item.newVipPrice) {
							that.vipGrossProfitRate = that.computedGrossProfitRate(cost, that.item.newVipPrice.replace(
								pattern, '')) + '%';
						}
						break;
					}
				}
			},
			computedGrossProfitRate(cost, price) {
				if (cost === 0 || cost === '0') return '100';
				if (price === 0 || price === '0' || price === '0.00' || price === '0.0') return '0';
				let difference = price - cost;
				return (difference / price * 100).toFixed(2);
			},
			hideItemModalDialog() {
				this.itemModalDialog = false;
			},
			hideUnitDrawerModal() {
				this.unitDrawerModal = false;
			},
			showUnitDrawerModal() {
				this.unitDrawerModal = true;
			},
			selectUnit(v) {
				this.unitDrawerModal = false;
				if (this.item) this.unit = v;
			},
			deleteItem(key) {
				var that = this;
				let index = 0;
				for (const item of that.price_adjustment.items) {
					if (item.id === key || item.plu === key) {
						that.price_adjustment.items.splice(index, 1);
						break;
					}
					index += 1;
				}
			},
			showClearModalDialog(sheetNumber, event) {
				//this.modalName = event.currentTarget.dataset.target;
				this.clearModalDialog = true;
			},
			hideClearModalDialog() {
				this.clearModalDialog = false;
			},
			clearItems() {
				this.price_adjustment.items = {};
				this.clearModalDialog = false;
			}
		}
	}
</script>

<style lang='scss'>
	.grid-item-container {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;

		.shop1 {
			width: 22%;
		}

		.shop2 {
			flex: 1;
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100vw;
	}

	.units {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0rpx 12rpx;

		.unit {
			border-radius: 3px;
			border: 1rpx solid #9b9b9b;
			margin-right: 14rpx;
		}

		.unitSelected {
			border-radius: 3px;
			border: 1rpx solid #fbbd08;
			margin-right: 14rpx;
		}
	}
</style>
