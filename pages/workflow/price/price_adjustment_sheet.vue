<template>
	<hoprxi-navigation title="调价单" :backgroundColor="[1, ['#AC32E4', '#7918F2', 90]]" :titleFont="['#FFF','left',900]"
		:surplusHeight="46" id="navBar">
		<template slot="extendSlot" class="cu-bar search">
			<view class="search-form radius" style="height:38px">
				<text class="cuIcon-search text-bold text-xl"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入单据号、商品条码"
					confirm-type="search" placeholder-class="text-df">
				<text class="cuIcon-scan text-blue text-bold text-xxl" @tap="scan"></text>
			</view>
			<view class="action text-white cuIcon-filter text-xxl" @click="query"></view>
		</template>
	</hoprxi-navigation>
	<view class="flex text-center bg-white nav">
		<view class="cu-item flex-sub" :class="{'text-orange cur':index === tabCur}" v-for="(item,index) in tabList"
			:key="index" @tap="tabSelect" :data-id="index">
			{{item}}
		</view>
	</view>
	<view class="flex justify-around align-center bg-white solid padding-tb-sm padding-lr-lg" v-if="dateShow">
		<text @click.stop="selectDate(true)">{{formattedStartDate}}</text>
		<text>至</text>
		<text @click.stop="selectDate(false)">{{formattedEndDate}}</text>
	</view>
	<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true" class="bg-grey"
		:style="{height:dateShow?'calc(98.5vh - '+(fixedHeight+dateShowHeight)+'px - 5px)':'calc(98.5vh - '+ fixedHeight +'px - 5px)'}">
		<view class="sheet" v-for="(sheet,index) in priceAdjustmentSheet" :key="index">
			<hoprxi-cell iconFont='cuIcon-delete'
				:title="{name:'单据号: ' + sheet.sheetNumber,weight:500,size:15,color:selectColor(sheet)}"
				:line="{pattern:'dashed',color:'#d4e7ed'}">
				<!-- <template #slotName></template> -->
				<text v-if="sheet.approval==='normal' || sheet.approval==='denied'" class="cuIcon-delete text-blue"
					@click.stop="showDeleteModalDialog(sheet.sheetNumber,$event)"
					data-target="DialogModalDelete"></text>
			</hoprxi-cell>
			<view class="sheetDetailed margin-top-xs padding-lr-xs bg-white align-center"
				@tap.stop="navToSheet(sheet.sheetNumber)">
				<text class="iconfont icon-price-adjustment left" :style="[{color:selectColor(sheet)}]"></text>
				<view class="flex flex-direction midlle text-cut">
					<text>申请日期：{{sheet.applyDate}}</text>
					<text class="text-cut">适配门店：{{sheet.store}}</text>
					<text class="margin-bottom-xs">生效日期：{{sheet.effectDate}}</text>
					<hoprxi-cell :title="{name:'申请人：'+ sheet.proposer,size:14,weight:400}"
						:line="{pattern:'dashed',color:'#d4e7ed',position:'top'}">
					</hoprxi-cell>
				</view>
				<text class="cuIcon-right text-grey margin-left-sm right"></text>
			</view>
		</view>
	</scroll-view>
	<!-- bootom -->
	<view class="bootom">
		<button class="cu-btn lg radius shadow bg-gradual-orange basis-xl"
			@tap.stop="$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
			<text class="cuIcon-add margin-right-xl"></text>新增调价单</button>
	</view>
	<!-- 删除对话框 -->
	<view class="cu-modal" :class="{'show':deleteModalDialog}">
		<view class="cu-dialog">
			<view class="cu-bar bg-white">
				<view class="content text-bold text-red">警 告</view>
			</view>
			<view class="padding-lr-xs bg-white">
				<text class="text-bold">删除调价单据：{{selectedSheetNumber}}</text><br />
				<text class="text-blue margin-top-xl text-sm">若出现误操作，请当天在回收站找回</text>
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
			<view class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
				<text @tap.stop.prevent="hideDateModal">取消</text>
				<text class="text-orange" @tap.stop.prevent="pickerConfirm">确定</text>
			</view>
			<hoprxi-date-picker :startYear="startYear" fields="day" :current="true" :value="initDate"
				@change="handlerChange" @touchstart="touchStart" @touchend="touchEnd">
			</hoprxi-date-picker>
		</view>
	</view>
</template>

<script>
	import {
		reactive,
		ref,
		computed,
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		formatDate,
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import priceAdjustmentSheetTestData from '@/data/price_adjustment_sheet_test_data.js'; //测试数据
	export default {
		setup(props, content) {
			const fixedHeight = ref(0);
			const scanResult = ref('');
			const scan = () => {
				uni.scanCode({
					scanType: ['barCode'],
					success: function(res) {
						scanResult.value = res.result;
					},
					fail: function(res) {
						console.log(JSON.stringify(res));
					},
				});
			};
			const dateShow = ref(false);
			const dateShowHeight = ref(0);
			const query = () => {
				dateShow.value = !dateShow.value;
				if (dateShow.value && dateShowHeight.value === 0) {
					setTimeout(() => {
						uni.createSelectorQuery().select(
								'.flex.justify-around.align-center.bg-white.solid.padding-tb-sm.padding-lr-lg')
							.boundingClientRect(res => {
								console.log(dateShow.value);
								console.log(res)
								dateShowHeight.value = res.height;
							}).exec();
					}, 1);
				}
/*
				uni.createSelectorQuery().select(
						'.flex.justify-around.align-center.bg-white.solid.padding-tb-sm.padding-lr-lg')
					.boundingClientRect(res => {
						console.log(dateShow.value);
						console.log(res)
						dateShowHeight.value = res.height;
					}).exec();
*/
			};
			const tabList = ['今日', '昨日', '本周', '上周', '本月', '自定义'];
			const tabCur = ref('0');
			const tabSelect = (e) => {
				tabCur.value = e.currentTarget.dataset.id;
				tabList.forEach(function(item, index, arr) {
					if (index === tabCur) {
						console.log(item);
					}
				});
			};
			const selectColor = computed(() => {
				return (sheet) => {
					if (sheet.approval === "pass") return "#39b54a";
					if (sheet.approval === "denied") return "#e54d42";
					return "#8799a3";
				}
			});
			onMounted(() => {
				uni.createSelectorQuery().select('#navBar').boundingClientRect(res => {
					fixedHeight.value = res.height;
				}).exec();
				uni.createSelectorQuery().select('.flex.text-center.bg-white.nav').boundingClientRect(res => {
					fixedHeight.value += res.height;
				}).exec();
			});
			return {
				fixedHeight,
				scanResult,
				scan,
				query,
				dateShow,
				dateShowHeight,
				tabList,
				tabCur,
				tabSelect,
				selectColor
			}
		},
		data() {
			return {
				deleteModalDialog: false,
				selectedSheetNumber: null,

				priceAdjustmentSheet: [],
				dateSelectModalDialog: false,
				startYear: 2022,
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
		},
		methods: {
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
				this.$util.toast('删除成功');
			},
			//以下日期选择函数
			selectDate(b) {
				this.dateSign = true;
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

<style lang='scss'>
	.sheet {
		display: flex;
		flex-direction: column;
		border-radius: 16rpx;
		padding: 16rpx;
		background-color: #FFF;
		margin: 8rpx 12rpx;

		.sheetDetailed {
			display: flex;
			align-items: center;
			justify-content: center;

			.left {
				font-size: 43px;
				flex: 0 0 16%;
			}

			.midlle {
				flex: 1;
			}

			.right {
				flex: 0 0 3%;
				font-size: 12px;
			}
		}
	}

	.bootom {
		display: flex;
		justify-content: center;
		width: 100vw;
		position: fixed;
		bottom: 1.2vh;
	}
</style>
