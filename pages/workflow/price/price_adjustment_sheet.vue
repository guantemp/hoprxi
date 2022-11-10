<template>
	<view class="price_adjustment_sheet">
		<hoprxi-navigation title="调价单" :backgroundColor="[1, ['#AC32E4', '#7918F2', 90]]"
			:titleFont="['#FFF','left',700]" :surplusHeight="43" id="navBar">
			<template slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入单据号、商品条码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white">
					<text class="cuIcon-close "></text>
					<text @click="computedScrollViewHeight">取消</text>
					<text class="cuIcon-filter margin-left-xs" @click="query"></text>
				</view>
			</template>
		</hoprxi-navigation>
		<view class="flex justify-around align-center bg-white solid padding-tb-sm padding-lr-lg" v-if="dateShow">
			<text @click.stop="selectDate(true)">{{formattedStartDate}}</text>
			<text>至</text>
			<text @click.stop="selectDate(false)">{{formattedEndDate}}</text>
		</view>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height:dateShow?'calc(98.5vh - '+(fixedHeight+dateShowHeight)+'px - 10rpx)':'calc(98.5vh - '+ fixedHeight +'px - 10rpx)'}">
			<view class="bg-white margin-top-xs nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="{'text-orange cur':index===tabCur}"
						v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
			</view>
			<block v-for="(sheet,index) in priceAdjustmentSheet" :key="index">
				<view class="sheet">
					<hoprxi-cell :title="'单据号: ' + sheet.sheetNumber" :titleFont="['#8799a3',28,700]"
						:line="['dashed','#e4e7ed']" decorateIconClass="cuIcon-comment">
						<template #executableSlot>
							<text v-if="sheet.approval==='normal' || sheet.approval==='denied'"
								class="cuIcon-delete text-blue"
								@click.stop="showDeleteModalDialog(sheet.sheetNumber,$event)"
								data-target="DialogModalDelete"></text>
						</template>
					</hoprxi-cell>
					<view class="sheetDetailed margin-top-xs padding-lr-xs" @tap.stop="navToSheet(sheet.sheetNumber)">
						<text class="iconfont icon-price-adjustment left" :style="[{color:selectColor(sheet)}]"></text>
						<view class="flex flex-direction midlle text-cut">
							<text>申请日期：{{sheet.applyDate}}</text>
							<text class="text-cut">适配门店：{{sheet.store}}</text>
							<text class="margin-bottom-xs">生效日期：{{sheet.effectDate}}</text>
							<hoprxi-cell :title="'申请人：' + sheet.proposer" :line="['dashed','#e4e7ed','top']">
							</hoprxi-cell>
						</view>
						<text class="cuIcon-right text-grey margin-left-sm right"></text>
					</view>
				</view>
			</block>
		</scroll-view>
		<!-- bootom -->
		<view class="add">
			<button class="cu-btn lg radius shadow bg-gradual-orange basis-xl"
				@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
				<text class="cuIcon-add margin-right-xl"></text>新增调价单</button>
		</view>
		<!-- 删除对话框 -->
		<view class="cu-modal" :class="{'show':deleteModalDialog}">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="content text-bold text-orange">警 告</view>
				</view>
				<view class="padding-xs bg-white">
					<text class="text-bold">将删除调价单据</text><br /><br />
					<text class="text-blue">单据号：{{selectedSheetNumber}}</text>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green" @tap="hideDeleteModalDialog">取消</view>
					<view class="action margin-0 flex-sub solid-left" @tap="deleteSheet(selectedSheetNumber)">确定</view>
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<view class="cu-modal bottom-modal" :class="dateSelectModalDialog?'show':''" @tap="hideDateModal">
			<view class="cu-dialog" @tap.stop="">
				<view
					class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
					<text @tap.stop.prevent="hideDateModal">取消</text>
					<text class="text-orange" @tap.stop.prevent="pickerConfirm">确定</text>
				</view>
				<hoprxi-date-picker :startYear="startYear" fields="day" :current="true" :value="initDate"
					@change="handlerChange" @touchstart="touchStart" @touchend="touchEnd">
				</hoprxi-date-picker>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDate,
	} from '@/common/js/util.js';
	import priceAdjustmentSheetTestData from '@/data/price_adjustment_sheet_test_data.js'; //测试数据
	export default {
		data() {
			return {
				fixedHeight: 0,
				scanResult: '',
				deleteModalDialog: false,
				selectedSheetNumber: null,
				dateShow: false,
				dateShowHeight: 0,
				tabCur: 0,
				tabList: ['今日', '昨日', '本周', '上周', '本月'],
				priceAdjustmentSheet: [],
				dateSelectModalDialog: false,
				startYear: null,
				initDate: null,
				formattedStartDate: null,
				formattedEndDate: null,
				dateSign: true,
				confirmFlag: true,
				result: {},
			}
		},
		onLoad() {
			this.priceAdjustmentSheet = priceAdjustmentSheetTestData;
			let currentDate = new Date();
			this.formattedStartDate = formatDate(currentDate, "yyyy-MM-dd 00:00:00");
			this.formattedEndDate = formatDate(currentDate, "yyyy-MM-dd 23:59:59");
			currentDate.setDate(currentDate.getDate() - 31);
			this.startYear = currentDate.getFullYear();
			//定时器请求数据
			this.$nextTick(() => {
				let query = uni.createSelectorQuery().in(this);
				query.select('#navBar').boundingClientRect().exec(res => {
					this.setFixedHeight(res[0].height);
				});
				query = uni.createSelectorQuery().in(this);
				query.select('.add').boundingClientRect().exec(res => {
					this.setFixedHeight(res[0].height);
				});
			})
		},
		methods: {
			scan() {
				var that = this;
				uni.scanCode({
					scanType: ['barCode'],
					success: function(res) {
						that.scanResult = res.result;
					},
					fail: function(res) {
						console.log(JSON.stringify(res));
					},
				});
			},
			setFixedHeight(height) {
				this.fixedHeight = this.fixedHeight + height;
			},
			query() {
				this.dateShow = !this.dateShow;
				if (this.dateShow && this.dateShowHeight === 0) {
					setTimeout(() => {
						let query = uni.createSelectorQuery().in(this);
						query.select('.flex.justify-around.align-center.bg-white').boundingClientRect().exec(
						res => {
							this.setDateShowHeight(res[0].height);
						});
					}, 1);
				}
			},
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				let er = e.currentTarget.dataset.id;
				let _this = this;
				this.tabList.forEach(function(item, index, arr) {
					if (index === _this.tabCur) {
						console.log(item);
					}
				});
			},
			selectColor(vaule) {
				if (vaule.approval === "pass") return "#39b54a";
				if (vaule.approval === "denied") return "#f37b1d";
				return "#8799a3";
			},
			showDeleteModalDialog(sheetNumber, event) {
				//this.modalName = event.currentTarget.dataset.target;
				this.deleteModalDialog = true;
				this.selectedSheetNumber = sheetNumber;
			},
			hideDeleteModalDialog() {
				this.deleteModalDialog = false;
			},
			navToSheet(sheetNumber) {
				this.$util.navTo('/pages/workflow/price/price_adjustment_details?sheetNumber=' + sheetNumber);
			},
			deleteSheet(sheetNumber) {
				this.deleteModalDialog = false;
				let index = 0;
				for (const item of this.priceAdjustmentSheet) {
					if (item.sheetNumber === sheetNumber) {
						this.priceAdjustmentSheet.splice(index, 1);
						break;
					}
					index += 1;
				}
			},
			//以下日期选择函数
			selectDate(b) {
				this.dateSign = b;
				this.initDate = this.dateSign ? formatDate(new Date(this.formattedStartDate), "yyyy-MM-dd") : formatDate(
					new Date(this.formattedEndDate), "yyyy-MM-dd");
				this.dateSelectModalDialog = true;
			},
			touchStart() {
				if (this.timeout) {
					this.confirmFlag = false;
				}
			},
			touchEnd() {
				if (this.timeout) {
					setTimeout(() => {
						this.confirmFlag = true;
					}, 500)
				}
			},
			handlerChange(res) {
				let _this = this;
				this.result = {
					...res
				};
			},
			hideDateModal() {
				this.dateSelectModalDialog = false;
			},
			pickerConfirm() {
				if (!this.confirmFlag) {
					return;
				};
				this.dateSelectModalDialog = false;
				this.dateSign ? this.formattedStartDate = formatDate(new Date(this.result.value), "yyyy-MM-dd 00:00:00") :
					this.formattedEndDate = formatDate(new Date(this.result.value), "yyyy-MM-dd 23:59:59");
				this.initDate = this.dateSign ? formatDate(new Date(this.result.value), "yyyy-MM-dd") : formatDate(
					new Date(this.result.value), "yyyy-MM-dd");
			},
		}
	}
</script>

<style scoped lang='scss'>
	.price_adjustment_sheet {
		width: 100vw;
		height: 100vh;
		background-color: #F8F8F8;
	}

	.sheet {
		display: flex;
		flex-direction: column;
		border-radius: 16rpx;
		padding: 16rpx;
		background-color: #FFF;
		margin: 16rpx 16rpx 8rpx 16rpx;

		.sheetDetailed {
			display: flex;
			align-items: center;

			.left {
				font-size: 86rpx;
				flex: 0 0 16%;
			}

			.midlle {
				flex: 1;
			}

			.right {
				flex: 0 0 3%;
				font-size: 24rpx;
			}
		}
	}

	.add {
		display: flex;
		justify-content: center;
		width: 100vw;
		position: fixed;
		bottom: 1.2vh;
	}
</style>
