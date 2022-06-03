<template>
	<view class="bg-white">
		<hop-nav-bar id="navBar" :title="good?'商品编辑':'商品新增'" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]"
			:titleFont="['#FFF']">
		</hop-nav-bar>
		<view :style="[scrollContentStyle]" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<view class="flex flex-direction justify-center align-center padding-tb-sm" v-if="pullingDown">
				<view class="loading-animation"></view>
				<text class="pull-down-text">释放刷新~</text>
			</view>
			<view class="cu-form-group">
				<view class="title">
					<text v-if='good.plu'>PLU码</text>
					<text v-else>商品条码</text>
					<text class="text-red margin-left-xs">*</text>
				</view>
				<input v-model="scanResult" :placeholder="good.plu||good.barcode||''" @blur="scanResultBlur">
				<view class="cu-capsule radius align-center">
					<view class='cu-tag bg-blue text-lg' @tap.stop="scan">
						<text class='cuIcon-scan text-white'></text>
					</view>
					<view class="cu-tag line-blue text-df" @tap.stop="plu?generate('plu'):generate('barcode')">
						生成
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">商品名称<text class="text-red margin-left-xs">*</text></view>
				<input v-model="name" :placeholder="good.name||''">
				<text class="cuIcon-more" @tap.stop="showAliasModalDialog" :class="alias?'text-red':''"></text>
			</view>
			<view class="cu-form-group">
				<view class="title">商品规格<text class="text-red margin-left-xs">*</text></view>
				<input v-model="specs" :placeholder="good.specs||'未定义'">
			</view>
			<view class="cu-form-group">
				<view class="title">商品等级<text class="text-red margin-left-xs">*</text></view>
				<input v-model="grade" :placeholder="grade||good.grade||'合格品'" disabled>
				<text class="cuIcon-more" @tap.stop="showGradeRadioDialog"></text>
			</view>
			<view class="cu-form-group">
				<view class="title" @tap.stop="this.$util.toast('直辖定位到区级，其余定位到市！')">
					商品产地<text class="text-red margin-left-xs">*</text></view>
				<input v-model="placeOfOrigin" :placeholder="good.placeOfOrigin||''">
				<text class="cuIcon-right" @tap.stop="showOriginDialog"></text>
			</view>
			<view class="cu-form-group">
				<view class="title">商品类别<text class="text-red margin-left-xs">*</text></view>
				<input :placeholder="good.category.name||'未定义'" v-model="category">
				<text class="cuIcon-more" @tap.stop="navToCategory(good.category.id)"></text>
			</view>
			<view class="cu-form-group">
				<view class="title" @tap.stop="this.$util.toast('最近一次入库价，仅作为录入商品时计算（参考）毛利率，不影响库存成本和实际毛利率！')">
					参考进价<text class="cuIcon-info"></text>
				</view>
				<text class="text-price"></text>
				<input :placeholder="good.storage.lastPurchasePrice||'0.00/PCS'" :value="purchasePrice" type="digit"
					@blur="purchasePriceBlur">
			</view>
			<view class="cu-form-group">
				<view class="title" @tap.stop="this.$util.toast('0.00元为灵活定价商品，POS系统每次销售时会询问售价！')">
					零&nbsp;&nbsp;售&nbsp;&nbsp;价<text class="cuIcon-info text-sm test"></text></view>
				<text class="text-price"></text>
				<view class="flex flex-sub">
					<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
						<input :placeholder="good.retailPrice||'0.00/PCS'" :value="retailPrice" type="digit"
							@blur="retailPriceBlur">
					</badge>
					<input v-else placeholder="0.00/PCS" :value="retailPrice" type="digit"
						@blur="retailPriceBlur">
				</view>
				<text class="icon-unit text-blue" @tap.stop="showUnitDrawerModal"></text>
			</view>
			<view class="cu-form-group">
				<view class="title margin-right-sm">会&nbsp;&nbsp;员&nbsp;&nbsp;价</view>
				<text class="text-price"></text>
				<view class="flex flex-sub">
					<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
						<input :placeholder="good.memberPrice||'0.00/PCS'" :value="memberPrice" type="digit"
							@blur="memberPriceBlur">
					</badge>
					<input v-else placeholder="0.00/PCS" :value="memberPrice" type="digit"
						@blur="memberPriceBlur">
				</view>
				<text class="icon-unit text-blue" @tap.stop="showUnitDrawerModal"></text>
			</view>
			<view class="cu-form-group">
				<view class="title margin-right-sm">VIP&nbsp;&nbsp;&nbsp;价</view>
				<text class="text-price"></text>
				<view class="flex flex-sub">
					<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
						<input :placeholder="good.memberPrice||'0.00/PCS'" :value="memberPrice" type="digit"
							@blur="memberPriceBlur">
					</badge>
					<input v-else placeholder="0.00/PCS" :value="memberPrice" type="digit"
						@blur="memberPriceBlur">
				</view>
				<text class="icon-unit text-blue" @tap.stop="showUnitDrawerModal"></text>
			</view>
			<view class="cu-form-group solid-bottom">
				<view class="title">保&nbsp;&nbsp;质&nbsp;&nbsp;期</view>
				<input :placeholder="good.shelfLife||'0天'" :value="shelfLife" type="number"
					@blur="shelfLifeBlur">
			</view>
			<view class="cu-bar bg-white">
				<view class="action title">商品图片</view>
				<view class="action">{{imgList.length}}/4</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="viewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="delImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="chooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<template v-if="good">
				<button class="cu-btn radius shadow bg-gradual-blue basis-xs margin-right-sm"
					@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
					<text class="cuIcon-pullleft"></text></button>
				<button class="cu-btn radius shadow bg-gradual-blue basis-xs margin-right-sm"
					@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
					<text class="cuIcon-pullright text-xxl"></text></button>
				<button class="cu-btn radius shadow bg-gradual-blue basis-sm"
					@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
					<text class="icon-save margin-right-sm"></text>保存</button>
			</template>
			<template v-else>
				<button class="cu-btn radius shadow bg-gradual-green basis-sm"
					@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
					<text class="cuIcon-add margin-right-xs"></text>保存并新增</button>
				<button class="cu-btn radius shadow bg-gradual-green basis-sm margin-left-sm"
					@tap.stop="this.$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
					<text class="icon-save margin-right-sm"></text>保存</button>
			</template>
		</view>
		<!-- 别名对话框 -->
		<view class="cu-modal" :class="aliasModalDialog?'show':''">
			<view class="cu-dialog">
				<view class="flex align-center solid-bottom padding text-left">
					<view class="margin-right-sm">商品别名：</view>
					<input type="text" :placeholder="good.name.alias||'请输入商品的另外一个名称'" v-model="alias"
						class="flex-sub">
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub" @tap="aliasModalDialogConfirm">好</view>
				</view>
			</view>
		</view>
		<!--商品等级对话框-->
		<view class="cu-modal" :class="gradeRadioDialog?'show':''" @tap="hideGradeRadioDialog">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="gradeRadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in grades" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item}}</view>
								<radio class="round" :class="presetGrade === item?'checked':''"
									:checked="presetGrade === item?true:false" :value="item"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<!-- 产地选择对话框 -->
		<view class="cu-modal bottom-modal" :class="originDialog?'show':''" @tap="hideOriginDialog">
			<view class="cu-dialog" @tap.stop="">
				<view
					class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
					<text @tap.stop.prevent="hideOriginDialog">取消</text>
					<text class="text-orange" @tap.stop.prevent="originDialogConfirm">确定</text>
				</view>
				<hop-region-picker @change="handlerChange" :value="initPlaceOfOrigin"></hop-region-picker>
			</view>
		</view>
		<!-- 单位选择抽屉框 -->
		<view class="cu-modal drawer-modal justify-end" :class="unitDrawerModal?'show':''" @tap="hideUnitDrawerModal">
			<view class="cu-dialog basis-lg bg-white" @tap.stop=""
				:style="[{top:navBarHeight + 'px',height:'calc(100vh - ' + navBarHeight + 'px)'}]">
				<view class="padding-sm solid-bottom text-left">
					<text class="cuIcon-titles text-orange"></text>
					<text>选择价格单位</text>
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
		formatMoney
	} from '@/common/js/util.js';
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	const unitPattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
	export default {
		data() {
			return {
				navBarHeight: 0,
				good: null,
				id: '',
				plu: '',
				barcode: '',
				scanResult: '',
				name: '',
				alias: '',
				specs: '',
				grade: '',
				regionResult: null,
				placeOfOrigin: '',
				category: null,
				purchasePrice: '',
				retailPrice: '',
				imgList: [],
				aliasModalDialog: false,
				gradeRadioDialog: false,
				presetGrade: '合格品',
				grades: [],
				originDialog: false,
				initPlaceOfOrigin: [],
				unitDrawerModal: false,
				unit: null,
				units: [],
				shelfLife: '',
				pullingDown: false, // 是否正在下拉
				currentTouchStartY: 0,
				pullDownHeight: 0, // 下拉高度
				refresherThreshold: 60 //下拉刷新阈值80px
			}
		},
		onLoad(options) {
			this.id = options.id || '';
			this.plu = options.plu || '';
			if (this.id || this.plu) {
				for (const item of catalog.catalog) {
					if (item.id === this.id || item.plu == this.plu) {
						this.good = item;
						this.presetGrade = this.good.grade;
						break;
					}
				}
			}
			if (this.good) {
				this.unit = unitPattern.exec(this.good.retailPrice)[1];
			}
			this.units = catalog.units;
			this.grades = catalog.grades;
			//let pattern = new RegExp("^([\u4e00-\u9fa5]{1,}[省|市|自治区]?)\.([\u4e00-\u9fa5]{1,}[市|区|县|州|盟|地区]?)$", "i");
			//let pattern = new RegExp(/(^\d+)天$/i);
			//let result = pattern.exec("35") //"内蒙古.呼和浩特"
			//console.log(this.computedGrossProfitRate(null, 65));
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#navBar').boundingClientRect(res => {
				this.navBarHeight = res.height;
			}).exec();
		},
		watch: {
			unit() {
				if (this.retailPrice) {
					this.retailPrice = this.retailPrice.replace(unitPattern, '') + "/" + this.unit;
					return;
				}
				if (this.good && this.good.retailPrice) {
					this.good.retailPrice = this.good.retailPrice.replace(unitPattern, '') + "/" + this.unit;
				}
			}
		},
		computed: {
			retailGrossProfitRate() {
				let cost = this.purchasePrice ? this.purchasePrice.replace(unitPattern, '') : this.good ? this.good.storage
					.lastPurchasePrice.replace(unitPattern, '') : 0;
				if (this.retailPrice) return this.computedGrossProfitRate(cost, this.retailPrice.replace(unitPattern,
					'')) + '%';
				if (this.purchasePrice) {
					if (this.good && !this.retailPrice) return this.computedGrossProfitRate(cost, this.good.retailPrice
						.replace(unitPattern, '')) + '%';
					if (this.retailPrice) return this.computedGrossProfitRate(cost, this.retailPrice.replace(unitPattern,
						'')) + '%';
					return '0%';
				}
				if (this.good) return this.computedGrossProfitRate(cost, this.good.retailPrice.replace(unitPattern, '')) +
					'%';
			},
			scrollContentStyle() {
				let style = {};
				const {
					pullDownHeight,
					pullingDown
				} = this;
				style.transform = pullingDown ? `translateY(${pullDownHeight}px)` : `translateY(0px)`;
				style.transition = pullingDown ? `transform .1s linear` :
					`transform 0.3s cubic-bezier(0.19,1.64,0.42,0.72)`;
				return style;
			},
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
			generate(sign) {
				console.log(sign);
			},
			scanResultBlur(sign) {},
			showAliasModalDialog() {
				this.aliasModalDialog = true;
			},
			aliasModalDialogConfirm() {
				this.aliasModalDialog = false;
			},
			showGradeRadioDialog() {
				this.gradeRadioDialog = true;
			},
			hideGradeRadioDialog() {
				this.gradeRadioDialog = false;
			},
			gradeRadioChange(event) {
				this.gradeRadio = event.detail.value;
				this.grade = this.gradeRadio;
			},
			hideOriginDialog() {
				this.originDialog = false;
			},
			showOriginDialog() {
	
					let pattern = new RegExp(/^([\u4e00-\u9fa5]{1,}[省|市|自治区]?)\.([\u4e00-\u9fa5]{1,}[市|区|县|州|盟|地区]?)$/i);
					let result = pattern.exec(this.good.placeOfOrigin);
					if (this.placeOfOrigin)  result = pattern.exec(this.placeOfOrigin);
					if (result) {
						let province = ["北京市", "天津市", "上海市"];
						if (province.includes(result[1])) {
							this.initPlaceOfOrigin = [result[1], result[1], result[2]];
						} else if (result[1] === '重庆市') {
							let area = ["城口县", "丰都县", "垫江县", "忠县", "云阳县", "奉节县", "巫山县", "巫溪县", "石柱土家族自治县", "秀山土家族苗族自治县",
								"酉阳土家族苗族自治县", "彭水苗族土家族自治县"
							];
							if (area.includes(result[2])) //直辖县
								this.initPlaceOfOrigin = [result[1], '直辖县', result[2]];
							else this.initPlaceOfOrigin = [result[1], result[1], result[2]];
						} else if (result[1] === '新疆维吾尔自治区') {
							let area = ["石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "北屯市", "铁门关市", "双河市", "可克达拉市", "昆玉市", "胡杨河市"];
							if (area.includes(result[2])) //直辖县
								this.initPlaceOfOrigin = [result[1], '直辖县', result[2]];
						} else if (result[1] === '海南省') {
							let area = ["五指山市", "琼海市", "文昌市", "万宁市", "东方市", "定安县", "屯昌县", "澄迈县", "临高县", "白沙黎族自治县",
								"昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"
							];
							if (area.includes(result[2])) //直辖县
								this.initPlaceOfOrigin = [result[1], '直辖县', result[2]];
						} else if (result[1] === '湖北省') {
							let area = ["仙桃市", "潜江市", "天门市", "神农架林区"];
							if (area.includes(result[2])) //直辖县
								this.initPlaceOfOrigin = [result[1], '直辖县', result[2]];
						}
						if (this.initPlaceOfOrigin.length === 0) {
							this.initPlaceOfOrigin = [result[1], result[2]];
						}
					} else {
						this.initPlaceOfOrigin = [];

				}
				//console.log(this.initPlaceOfOrigin);
				this.originDialog = true;
			},
			handlerChange(res) {
				let _this = this;
				this.regionResult = {
					...res
				};
			},
			originDialogConfirm() {
				this.hideOriginDialog()
				let obj = this.regionResult.obj;
				let province = ['110000', '120000', '310000', '500000'];
				let city = ['429000', '469000']
				if (province.includes(obj.province.value) || city.includes(obj.city.value)) {
					this.placeOfOrigin = obj.province.label + "." + obj.area.label;
				} else {
					this.placeOfOrigin = obj.province.label + "." + obj.city.label;
				}
			},
			navToCategory(id) {
				this.$util.navTo('/pages/workflow/catalog/category?id=' + id);
			},
			hideUnitDrawerModal() {
				this.unitDrawerModal = false;
			},
			showUnitDrawerModal() {
				this.unitDrawerModal = true;
			},
			selectUnit(v) {
				this.unitDrawerModal = false;
				if (this.good) this.unit = v;
			},
			purchasePriceBlur(event) {
				this.purchasePrice = event.target.value;
				if (this.purchasePrice) {
					let temp = this.purchasePrice.replace(unitPattern, '');
					this.purchasePrice = formatMoney(temp) + "/" + (this.unit || 'pcs');
				}
			},
			retailPriceBlur(event) {
				this.retailPrice = event.target.value;
				if (this.retailPrice) {
					let temp = this.retailPrice.replace(unitPattern, '');
					this.retailPrice = formatMoney(temp) + "/" + (this.unit || 'pcs');
				}
			},
			computedGrossProfitRate(cost, price) {
				if (cost === null || cost === 0 || cost === '0') return '100';
				if (price === null || price === 0 || price === '0' || price === '0.00' || price === '0.0') return '0';
				let difference = price - cost;
				return (difference / price * 100).toFixed(2);
			},
			shelfLifeBlur(event) {
				this.shelfLife = event.target.value;
				if (this.shelfLife) {
					let pattern = new RegExp(/天$/);
					let temp = this.shelfLife.replace(pattern, '');
					this.shelfLife = temp + '天';
				}
			},
			chooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					//sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['camera'], //开相机  album 图册
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			viewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			delImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除这张图片？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			// 触摸按下处理
			touchStart(e) {
				this.currentTouchStartY = e.touches[0].clientY;
			},
			touchMove(e) {
				if (e.touches[0].clientY < this.currentTouchStartY) return;
				const currentTouchMoveY = e.touches[0].clientY;
				if ((currentTouchMoveY - this.currentTouchStartY) > 8) this.pullingDown = true;
				const movingDistance = (currentTouchMoveY - this.currentTouchStartY) * 0.65;
				const moreDistance = movingDistance > this.refresherThreshold ? (movingDistance - this
					.refresherThreshold) * 0.3 : 0;
				const computeDistance = movingDistance > this.refresherThreshold ? this.refresherThreshold + moreDistance :
					movingDistance + moreDistance;
				this.pullDownHeight = computeDistance;
			},
			// 触摸松开处理
			touchEnd(e) {
				if (this.pullDownHeight >= this.refresherThreshold) {
					this.pullingDown = false;
					this.pullDownHeight = 0;
					this.refreshData();
				} else {
					this.pullingDown = false;
					this.pullDownHeight = 0;
				}
			},
			refreshData() {
				uni.showLoading({
					title: '',
				});
				for (const item of catalog.catalog) {
					if (item.id === this.good.id || item.plu === this.good.plu) {
						this.good = item;
						this.unit = unitPattern.exec(this.good.retailPrice)[1];
						break;
					}
				}
				setTimeout(() => {
					// 服务端响应的 message 提示
					uni.showToast({
						title: "刷新成功",
						icon: "success",
						position: 'bottom'
					})
					//延时关闭  加载中的 loading框
					uni.hideLoading()
				}, 200)
			}
		}
	}
</script>

<style scoped lang='scss'>
	.bottom {
		display: flex;
		justify-content: center;
		width: 100vw;
		position: fixed;
		bottom: 1.5vh;
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


	.loading-animation {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
		position: relative;

		&::after,
		&::before {
			left: 0;
			width: 100%;
			position: absolute;
			border: 0 solid currentColor;
			background-color: #b7b7b7;
		}

		&::after {
			content: '';
			top: -25%;
			z-index: 1;
			height: 100%;
			border-radius: 10%;
			animation: spin 0.6s -0.1s linear infinite;
		}

		&::before {
			content: '';
			bottom: -9%;
			height: 10%;
			background: #000;
			border-radius: 50%;
			opacity: 0.2;
			animation: shadow 0.6s -0.1s linear infinite;
		}

		@keyframes spin {
			17% {
				border-bottom-right-radius: 10%;
			}

			25% {
				transform: translateY(25%) rotate(22.5deg);
			}

			50% {
				border-bottom-right-radius: 100%;
				transform: translateY(50%) scale(1, 0.9) rotate(45deg);
			}

			75% {
				transform: translateY(25%) rotate(67.5deg);
			}

			100% {
				transform: translateY(0) rotate(90deg);
			}
		}

		@keyframes shadow {
			50% {
				transform: scale(1.25, 1);
			}
		}
	}
</style>
