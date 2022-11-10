<template>
	<view>
		<hoprxi-navigation title="标签打印" :backgroundColor="[1, ['#3C8CE7', '#00EAFF', -45]]" tabPage="/pages/index/index"
			:titleFont="['#FFF']" id="navBar">
		</hoprxi-navigation>
		<!--labels show-->
		<view v-if="labels.length === 0" class="flex justify-center flex-direction align-center padding-bottom-lg"
			:style="{height:'calc(100vh - 190px)'}">
			<text class="icon-happy text-red margin-bottom-lg tips"></text>
			<text>没有任务、好开心...</text>
		</view>
		<scroll-view scroll-y :scroll-with-animation="true" :enable-back-to-top="true"
			:style="{height: 'calc(100vh - 150px)'}">
			<hop-slider :btnArr="btnArr" :items="labels" @del="del" @itemClick="itemClick"
				hierarchyClass="flex flex-direction margin-lr-xs margin-top-xs" radius='5'>
				<template v-slot="{item}">
					<view class="grid-item-container">
						<view class="content">
							<text class="text-cut text-bold">{{item.name}}</text>
							<view class="flex justify-between">
								<text>{{item.barcode||item.plu}}</text><text>{{item.specs}}</text>
							</view>
							<view class="flex justify-between">
								<text>{{item.placeOfOrigin}}</text><text>{{item.grade}}</text>
							</view>
							<view class="flex justify-between text-cut">
								<text>零售价：{{item.retailPrice}}</text>
								<text>会员价：{{item.memberPrice}}</text>
							</view>
						</view>
						<view class="labelShow"
							:class="item.label.type === 'special'?'bg-red':item.label.type === 'normal'?'bg-blue':'bg-yellow'">
							<text>适用标签格式</text>
							<text>{{item.label.name}}</text>
							<text>打印数量</text>
							<view class="flex align-center text-center">
								<view class="numberBtn minus" @click.stop="minus(item.id||item.plu)">-</view>
								<input type="number" :placeholder="item.label.printQuantity"
									v-model="item.label.printQuantity">
								<view class="numberBtn plus" :class="[inputValue >= 99?'numbox_disabled':'']"
									@click.stop="plus(item.id||item.plu)">+
								</view>
							</view>
						</view>
					</view>
				</template>
			</hop-slider>
		</scroll-view>
		<!--bootom-->
		<view class="bottom cu-bar bg-white tabbar border shop">
			<view class="action" @tap.stop="showClearModalDialog">
				<view class="cuIcon-delete">
					<view v-if="labels.length > 0" class="cu-tag badge">{{labels.length}}</view>
				</view>
				清空
			</view>
			<view class="action" @tap.stop="showImportDocumentModalDialog">
				<view class="cuIcon-form"></view>引入单据
			</view>
			<view class="bg-cyan submit" @tap.stop="showAddItemModalDialog" data-target="DialogModalAdd">增加商品</view>
			<view class="bg-blue submit" @click="showPrintRadioModalDialog">打印</view>
		</view>
		<!-- 添加商品模态对话框 -->
		<view class="cu-modal" :class="addItemModalDialog?'show':''">
			<view class="cu-dialog">
				<view @tap="hideAddItemModalDialog" class="bg-white text-right padding-tb-sm padding-lr-lg">
					<text class="cuIcon-close text-red text-bold text-xl"></text>
				</view>
				<view class="bg-cyan light text-left">
					<view class="cu-bar search">
						<view class="search-form radius">
							<text class="cuIcon-search"></text>
							<input v-model="scanResult" :adjust-position="false" placeholder="请输入商品条码、名称、拼音"
								confirm-type="search" @confirm="searchConfirm">
							<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
						</view>
						<view class="action text-white">
							<text class="cuIcon-close "></text>
							<text @click="searchCancel">取消</text>
							<text class="cuIcon-filter margin-left-xs" @tap.stop="query"></text>
						</view>
					</view>
					<view class="padding-lr-sm">
						<text class="text-bold">品名：{{item.name||'--'}}</text>
					</view>
					<view class="flex justify-between padding-lr-sm padding-tb-xs">
						<text v-if="item.plu">plu号：{{item.plu}}</text>
						<text v-else>商品条码：{{item.barcode||'--'}}</text>
						<text>规格：{{item.specs||'--'}}</text>
					</view>
					<view class="flex justify-between padding-lr-sm padding-bottom-xs">
						<text>产地：{{item.placeOfOrigin||'中国'}}</text>
						<text>等级：{{item.grade||'合格品'}}</text>
					</view>
					<view class="grid col-3 bg-cyan padding-tb-sm margin-lr-sm radius margin-bottom-xs">
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text>零售价</text>
							<text class="text-lg text-price padding-top-xs">{{item.retailPrice||'--'}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text>会员价</text>
							<text class="text-lg text-price padding-top-xs">{{item.memberPrice||'--'}}</text>
						</view>
						<view class='cu-item padding-left-sm flex flex-direction'>
							<text>PLUS会员价</text>
							<text class="text-lg text-price padding-top-xs">{{item.vipPrice||'--'}}</text>
						</view>
					</view>
					<view class="margin-lr-xs flex align-center">
						<switch class='orange radius' style="transform:scale(0.78)" @change="SwitchD"
							:class="switchD?'':'checked'" :checked="switchD?false:true"
							:disabled="item.promotion?false:true"></switch>
						<text class="margin-left-xs">价格促销信息</text>
					</view>
					<view v-show="!switchD" class="text-left">
						<view class="flex padding-lr-sm padding-bottom-xs">
							<text style="flex-basis: 25%;">促销日期：</text>
							<text>{{item.promotion.startDate}} 至 {{item.promotion.endDate}}</text>
						</view>
						<view class="flex padding-lr-sm padding-bottom-xs">
							<text style="flex-basis: 25%;">促销价格：</text>
							<text>{{item.promotion.price}}</text>
						</view>
						<view class="flex padding-lr-sm padding-bottom-xs">
							<text style="flex-basis: 25%;">促销说明：</text>
							<text>{{item.promotion.explain}}</text>
						</view>
					</view>
					<view class="flex padding-lr-sm align-center">
						<text class="cuIcon-titles text-yellow"></text>
						<text>请选择适用标签</text>
					</view>
					<swiper class="labelSwiper margin-tb-xs square-dot padding-lr-sm" :current="swiperIndex"
						previous-margin="70rpx" next-margin="70rpx" indicator-dots="true" indicator-color="#8799a3"
						indicator-active-color="#0081ff" circular="true" @change="labelSwiperChange">
						<swiper-item v-for="(item,index) in labelList" :key="index"
							:class="swiperIndex === index?'cur':''" @tap.stop="showLabelTipsModalDialog">
							<view class="swiperItem">
								<image :src="item.url" mode="scaleToFill"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="flex align-center padding-lr-sm padding-bottom-xs">
						<text>打印数量：</text>
						<button class="cu-btn cuIcon bg-cyan light" @tap.stop="subPrintQuantity">
							<text class="icon-minus margin-right-sm"></text></button>
						<input :placeholder="printQuantity" type="number" v-model="printQuantity"
							class="basis-xs text-center solid-bottom">
						<button class="cu-btn cuIcon bg-cyan light" @tap.stop="addPrintQuantity">
							<text class="cuIcon-roundadd"></text></button>
					</view>
					<view class="flex justify-end margin-right-sm padding-tb-sm">
						<button class="cu-btn block radius shadow confirmBtn bg-gradual-blue basis-sm"
							@tap.stop="addItem">
							<text class="cuIcon-add margin-right-sm"></text>增加</button>
						<button class="cu-btn block radius shadow confirmBtn bg-gradual-blue margin-left-xs basis-sm"
							@tap.stop="this.$util.navTo('/pages/workflow/price_adjustment_add')">
							确定</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 标签提示展示框 -->
		<view class="cu-modal" :class="labelTipsModalDialog?'show':''" @tap="hideLabelTipsModalDialog">
			<view class="cu-dialog" @tap.stop="" style="width:550rpx">
				<view class="flex flex-direction padding text-left">
					<text>标签名称：{{seclectedLabel.name}}</text>
					<text>标签规格：{{seclectedLabel.specs}}</text>
				</view>
			</view>
		</view>
		<!--打印选项对话框-->
		<view class="cu-modal" :class="printRadioModalDialog?'show':''" @tap="hidePrintRadioModalDialog">
			<view class="cu-dialog" @tap.stop="">
				<view class="solid-bottom line-blue padding text-left text-lg align-center">
					<text class="icon-print margin-right-sm "></text>选择打印机
				</view>
				<radio-group class="block" @change="printRadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(print,index) in prints" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{print.name}}</view>
								<radio class="round" :class="printRadio === print.id?'checked':''"
									:checked="printRadio === print.id?true:false" :value="print.id"></radio>
							</label>
						</view>
					</view>
				</radio-group>
				<view class="cu-bar bg-white solid-top">
					<view class="action margin-0 flex-sub text-green align-center" @tap="hidePrintRadioModalDialog">
						<text class="icon-print-setting margin-right-sm"></text>打印设置
					</view>
					<view class="action margin-0 flex-sub  solid-left" @tap="hidePrintRadioModalDialog">开始打印</view>
				</view>
			</view>
		</view>
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
					<view class="action margin-0 flex-sub solid-left" @tap="clearlabels">确定</view>
				</view>
			</view>
		</view>
		<!--单据引入对话框-->
		<view class="cu-modal" :class="importDocumentModalDialog?'show':''" @tap="hideImportDocumentModalDialog">
			<view class="cu-dialog" @tap.stop="">
				<view class="solid-bottom line-blue padding text-left text-lg align-center">
					<text class="cuIcon-form margin-right-sm "></text>引入单据
				</view>
				<radio-group class="block" @change="importDocumentRadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">引入调价单</view>
								<radio class="round" :class="importDocumentRadio=='priceAdjustment'?'checked':''"
									checked="true" :checked="importDocumentRadio=='priceAdjustment'?true:false"
									value="priceAdjustment"></radio>
							</label>
						</view>
						<view class="cu-item">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">引入价格促销单</view>
								<radio class="round" :class="importDocumentRadio=='pricePromotion'?'checked':''"
									:checked="importDocumentRadio=='pricePromotion'?true:false" value="pricePromotion">
								</radio>
							</label>
						</view>
						<view class="cu-item">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">引入采购入库单</view>
								<radio class="round" :class="importDocumentRadio=='purchaseReceipt'?'checked':''"
									:checked="importDocumentRadio=='purchaseReceipt'?true:false"
									value="purchaseReceipt"></radio>
							</label>
						</view>
						<view class="cu-item">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">引入excel文件</view>
								<radio class="round" :class="importDocumentRadio=='excel'?'checked':''"
									:checked="importDocumentRadio=='excel'?true:false" value="excel"></radio>
							</label>
						</view>
					</view>
				</radio-group>
				<view class="cu-bar bg-white solid-top">
					<view class="action margin-0 flex-sub text-green solid-left" @tap="importDocumentModalDialog">下一步
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import label from '@/data/label_test_data.js'; //用例数据库
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				addItemModalDialog: false,
				scanResult: '',
				labels: [],
				item: null,
				switchD: true,
				labelList: [],
				swiperIndex: 3,
				printQuantity: 1,
				labelTipsModalDialog: false,
				seclectedLabel: {},
				btnArr: [{
					name: '删除',
					width: 200,
					background: '#5c6a7c',
					color: '#fff',
					event: 'del'
				}],
				prints: [],
				printRadioModalDialog: false,
				printRadio: 'system',
				clearModalDialog: false,
				importDocumentModalDialog: false,
				importDocumentRadio: 'priceAdjustment',
			}
		},
		watch: {
			swiperIndex() {
				this.seclectLabel();
			}
		},
		onLoad(options) {
			let sign = options.sign || '';
			switch (sign) {
				case 'price_adjustment':
					let sheetNumber = options.sheetNumber || '';
			}
		},
		mounted: function() {
			this.labelList = label.labelList;
			this.prints = label.prints;
			this.seclectLabel();
			this.labels = label.labels;
		},
		methods: {
			del(data) {
				var that = this;
				let index = 0;
				for (const item of that.labels) {
					if ((data.id && item.id === data.id) || (data.plu && item.plu === data.plu)) {
						that.labels.splice(index, 1);
						break;
					}
					index += 1;
				}
			},
			plus(key) {
				for (const label of this.labels) {
					if (label.id === key || label.plu === key) {
						label.label.printQuantity += 1;
						//this.$set(label, 'printQuantity', label.printQuantity + 1);
						break;
					}
				}
			},
			minus(key) {
				for (const label of this.labels) {
					if (label.id === key || label.plu === key) {
						if (label.label.printQuantity > 1) label.label.printQuantity -= 1;
						//this.$set(label, 'printQuantity', label.printQuantity + 1);
						break;
					}
				}
			},
			//add item opertion
			showAddItemModalDialog() {
				this.addItemModalDialog = true;
			},
			hideAddItemModalDialog() {
				this.addItemModalDialog = false;
			},
			searchConfirm() {
				var that = this;
				//that.clearItem();
				for (const i of catalog.catalog) {
					if (i.barcode == that.scanResult || i.plu == that.scanResult) {
						that.item = {
							name: i.name,
							specs: i.specs,
							placeOfOrigin: i.placeOfOrigin,
							grade: i.grade,
							retailPrice: i.retailPrice,
							memberPrice: i.memberPrice,
							vipPrice: i.vipPrice,
						};
						if (i.id) {
							that.$set(that.item, 'id', i.id);
							that.$set(that.item, 'barcode', i.barcode);
						}
						if (i.plu) that.$set(that.item, 'plu', i.plu);
						if (i.promotion) that.$set(that.item, 'promotion', i.promotion);
						/*
						that.item = {
							promotion: i.promotion,
							...that.item
						};
						*/
						break;
					}
				}
			},
			scan() {
				var that = this;
				uni.scanCode({
					scanType: ['barCode'],
					success: function(res) {
						that.scanResult = res.result;
						that.searchConfirm();
					},
					fail: function(res) {
						console.log(JSON.stringify(res));
					},
				});
			},
			SwitchD() {
				this.switchD = !this.switchD;
			},
			labelSwiperChange(event) {
				this.swiperIndex = event.detail.current;
			},
			seclectLabel() {
				let that = this;
				let index = 0;
				for (const label of that.labelList) {
					if (that.swiperIndex === index) {
						that.seclectedLabel = label;
						break;
					}
					index += 1;
				}
			},
			showLabelTipsModalDialog() {
				this.labelTipsModalDialog = true;
			},
			hideLabelTipsModalDialog() {
				this.labelTipsModalDialog = false;
			},
			subPrintQuantity() {
				if (this.printQuantity > 1 && this.item) this.printQuantity = this.printQuantity - 1;
			},
			addPrintQuantity() {
				if (this.item) this.printQuantity += 1;
			},
			addItem() {
				var that = this;
				if (!that.item) {
					that.$util.toast("没有商品被加入！");
					return;
				}
				for (const i of that.labels) {
					if ((i.id && i.id === that.item.id) || (i.plu && i.plu === that.item.plu)) {
						that.$util.toast("编码" + (i.id || i.plu) + "的商品已存在，是否重复录入！");
						return;
					}
				}
				that.$set(that.seclectedLabel, 'printQuantity', that.printQuantity);
				that.$set(that.item, 'label', that.seclectedLabel);
				that.labels.push(that.item);
				that.item = null;
				that.scanResult = '';
				that.printQuantity = 1;
				//that.$delete(that.seclectedLabel, 'printQuantity');
				const {
					printQuantity,
					...temp
				} = that.seclectedLabel;
				that.seclectedLabel = temp;
			},
			showPrintRadioModalDialog() {
				if (this.labels.length > 0) this.printRadioModalDialog = true;
			},
			hidePrintRadioModalDialog() {
				this.printRadioModalDialog = false;
			},
			printRadioChange(event) {
				this.printRadio = event.detail.value;
			},
			showImportDocumentModalDialog() {
				this.importDocumentModalDialog = true;
			},
			hideImportDocumentModalDialog() {
				this.importDocumentModalDialog = false;
			},
			importDocumentRadioChange(event) {
				this.importDocumentRadio = event.detail.value;
			},
			showClearModalDialog() {
				if (this.labels.length > 0) this.clearModalDialog = true;
			},
			hideClearModalDialog() {
				this.clearModalDialog = false;
			},
			computedHeight() {
				let query = uni.createSelectorQuery().in(this);
				query.select('#navBar').boundingClientRect().exec(rect => {
					console.log(rect);
					this.occupiedHeight = rect[0].height;
				});
				query = uni.createSelectorQuery().in(this);
				query.select('.bottom').boundingClientRect().exec(rect => {
					this.occupiedHeight = this.occupiedHeight + rect[0].height;
					this.$util.toast("height:" + this.occupiedHeight);
				});
			},
		}
	}
</script>

<style lang='scss'>
	.grid-item-container {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		align-items: center;
		border-radius: 5rpx;
	}

	.content {
		width: 68%;
		display: flex;
		flex-direction: column;
		padding: 0rpx 8rpx;
	}

	.labelShow {
		width: 32%;
		display: flex;
		flex-direction: column;
		padding: 8rpx;

		.numberBtn {
			width: 46rpx;
			height: 46rpx;
			font-size: 40rpx;
			line-height: 40rpx;
			border: 1rpx solid #f1f1f1;

			&:active {
				background-color: #f1f1f1;
			}
		}

		.minus {
			border-top-left-radius: 6rpx;
			border-bottom-left-radius: 6rpx;
		}

		input {
			width: 76rpx;
			height: 46rpx;
			font-size: 30rpx;
			font-weight: 400;
			line-height: 30rpx;
			border-top: 1rpx solid #f1f1f1;
			border-bottom: 1rpx solid #f1f1f1;
		}

		.plus {
			border-top-right-radius: 6rpx;
			border-bottom-right-radius: 6rpx;
		}
	}

	.labelSwiper {
		width: 100%;
		height: 220rpx;
	}

	.labelSwiper swiper-item {
		position: relative;
		box-sizing: border-box;
	}

	.labelSwiper swiper-item.cur .swiperItem {
		position: relative;
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.labelSwiper swiper-item .swiperItem {
		display: flex;
		flex-direction: column;
		height: 100%;
		transform: scale(0.88); //放大
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
	}

	.labelSwiper swiper-item image {
		height: 220rpx;
		border-radius: 12rpx;
	}

	.tips {
		font-size: 164rpx;
		transform: rotate(7deg);
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100vw;
	}
</style>
