<template>
	<hoprxi-navigation :title="Object.keys(item).length>0?'商品编辑':'商品新增'"
		:backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']" id="navBar">
	</hoprxi-navigation>
	<view v-if="Object.keys(item).length>0" class="flex justify-between padding-lr-xs margin-top-xs">
		<view class="flex">
			<button class="cu-btn radius shadow bg-grey basis-xs margin-right-sm cuIcon-pullleft"
				:class="{'text-xxl': previous>0}" @tap.stop="previous">
			</button>
			<button class="cu-btn radius shadow bg-grey basis-xs cuIcon-pullright" :class="{'text-xxl': next>0}"
				@tap.stop="next">
			</button>
		</view>
		<button class="cu-btn radius shadow bg-gradual-blue basis-sm" @tap.stop="save">
			<text class="icon-save margin-right-sm text-xxl"></text>保存</button>
	</view>
	<view v-else class="flex margin-top-xs justify-end padding-lr-xs">
		<button class="cu-btn radius shadow bg-gray" @tap="save('draft')">
			存草稿</button>
		<button class="cu-btn radius shadow bg-gradual-blue margin-left-xl" @tap.stop="save('save_and_new')">
			保存&新增</button>
		<button class="cu-btn radius shadow bg-gradual-blue margin-left-xs" @tap.stop="save">
			保存</button>
	</view>
	<view :style="[scrollContentStyle]" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<view class="flex flex-direction justify-center align-center" v-if="pullingDown">
			<view class="loading-animation"></view>
			<text class="pull-down-text">释放刷新~~</text>
		</view>
		<view class="cu-bar bg-white">
			<view class="action title">商品图片</view>
			<view class="action">{{Object.keys(item).length===0?0:item.images.length}}/9</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-3 grid-square flex-sub">
				<view class="bg-img" v-for="(img,index) in item.images" :key="index" @tap="viewImage" :data-url="img">
					<image :src="img" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="delImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="chooseImage" v-if="Object.keys(item).length===0||item.images.length<9">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">
				<text v-if="sign === 'scale'">PLU码</text>
				<text v-else>商品条码</text>
				<text class="text-red margin-left-xs">*</text>
			</view>
			<input v-model="scanResult" :placeholder="item.plu||item.barcode||(sign==='good'?'请输入商品条码':'请输入PLU码')"
				@blur="scanResultBlur" type="number">
			<view class="cu-capsule radius align-center">
				<view class='cu-tag bg-blue text-lg' @tap.stop="scan"><text class='cuIcon-scan text-white'></text>
				</view>
				<view class="cu-tag line-blue text-df" @tap.stop="generate(sign)">生成</view>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">商品名称<text class="text-red margin-left-xs">*</text></view>
			<input v-model="name.name" :placeholder="item.name&&item.name.name||'请输入商品名称'" type="text">
			<text class="cuIcon-right" @tap="aliasModalDialog = true"
				:class="{'text-red':(item.name&&item.name.alias)||name.alias}"></text>
		</view>
		<view class="cu-form-group">
			<view class="title">商品规格<text class="text-red margin-left-xs">*</text></view>
			<input v-model="spec" :placeholder="item.spec||'未定义'">
		</view>
		<view class="cu-form-group">
			<view class="title">商品类别<text class="text-red margin-left-xs">*</text></view>
			<input :placeholder="item.category&&item.category.name||'未定义'" v-model="category" disabled>
			<text class="cuIcon-more" @tap.stop="navToCategory((item.category&&item.category.id)||-1)"></text>
		</view>
		<view class="cu-form-group">
			<view class="title">商品等级<text class="text-red margin-left-xs">*</text></view>
			<input v-model="grade" :placeholder="item.grade||'合格品'" disabled>
			<text class="cuIcon-right" @tap.stop="gradeDialog = true"></text>
		</view>
		<view class="cu-form-group">
			<view class="title" @tap.stop="$util.toast('层级要求到市，本市要求到区县！')">
				商品产地<text class="text-red margin-left-xs">*</text></view>
			<input v-model="madeIn" :placeholder="item.madeIn||''" disabled>
			<text class="cuIcon-right" @tap.stop="showMadeInDialog"></text>
		</view>
		<view class="flex justify-around padding-tb-sm bg-grey">
			<button class="cu-btn bg-blue radius shadow-lg basis-sm"
				@tap="pricingStrategyModalDialog=true">定价策略</button>
			<button class="cu-btn bg-blue radius shadow basis-sm" @tap="unitDrawerDialog = true">价格单位</button>
		</view>
		<view class="cu-form-group">
			<view class="title" @tap.stop="$util.toast('最近一次入库价，仅作为录入商品时计算（参考）毛利率，不影响库存成本和实际毛利率！')">
				预置进价<text class="cuIcon-info"></text>
			</view>
			<text class="text-price"></text>
			<input :placeholder="item.storage&&item.storage.lastPurchasePrice||'0.00/PCS'" :value="purchasePrice"
				type="digit" @blur="purchasePriceBlur">
		</view>
		<view class="cu-form-group">
			<view class="title" @tap.stop="$util.toast('0.00元表示为未定价商品，POS系统每次销售时都会询问售价！')">
				零&nbsp;&nbsp;售&nbsp;&nbsp;价<text class="cuIcon-info"></text></view>
			<text class="text-price"></text>
			<view class="flex flex-sub">
				<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
					<input
						:placeholder="item.retailPrice&&(item.retailPrice.amount+'/'+item.retailPrice.unit)||'0.00/PCS'"
						:value="retailPrice" type="digit" @blur="retailPriceBlur">
				</badge>
				<input v-else placeholder="0.00/PCS" :value="retailPrice" type="digit" @blur="retailPriceBlur">
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title margin-right-sm">会&nbsp;&nbsp;员&nbsp;&nbsp;价</view>
			<text class="text-price"></text>
			<view class="flex flex-sub">
				<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
					<input :placeholder="good&&good.memberPrice||'0.00/PCS'" :value="memberPrice" type="digit"
						@blur="memberPriceBlur">
				</badge>
				<input v-else placeholder="0.00/PCS" :value="memberPrice" type="digit" @blur="memberPriceBlur">
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title margin-right-sm">VIP&nbsp;&nbsp;&nbsp;价</view>
			<text class="text-price"></text>
			<view class="flex flex-sub">
				<badge v-if="retailGrossProfitRate" :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
					<input :placeholder="good&&good.memberPrice||'0.00/PCS'" :value="memberPrice" type="digit"
						@blur="memberPriceBlur">
				</badge>
				<input v-else placeholder="0.00/PCS" :value="memberPrice" type="digit" @blur="memberPriceBlur">
			</view>
		</view>
		<view class="cu-form-group solid-bottom">
			<view class="title">保&nbsp;&nbsp;质&nbsp;&nbsp;期</view>
			<input :placeholder="good&&good.shelfLife||'0 天'" :value="shelfLife" type="number" @blur="shelfLifeBlur">
		</view>
	</view>
	<!-- 别名对话框 -->
	<view class="cu-modal" :class="{'show':aliasModalDialog}">
		<view class="cu-dialog">
			<view class="flex align-center solid-bottom padding text-left bg-white">
				商品别名：
				<input type="text" :placeholder="(item.name&&item.name.alias)||'请输入商品的另外一个名称'" v-model="name.alias">
			</view>
			<view class="cu-bar" @tap="aliasModalDialog = false">
				<text class="action margin-0 flex-sub">好</text>
			</view>
		</view>
	</view>
	<!--商品等级对话框-->
	<view :class="['cu-modal',{'show':gradeDialog}]" @tap="gradeDialog = false">
		<view class="cu-dialog padding-lr-sm">
			<block v-for="(g,index) in grades" :key="g">
				<view class="flex justify-between solid-bottom align-center padding-tb padding-lr-sm"
					:class="{'text-green text-bold':grade === g}" @tap="grade_selected(g)">
					<text>{{g}}</text>
					<text class="cuIcon-check text-xl" v-if="grade === g"></text>
				</view>
			</block>
		</view>
	</view>
	<!-- 产地选择对话框 -->
	<view class="cu-modal bottom-modal" :class="{'show':madeInDialog}" @tap="madeInDialog=false">
		<view class="cu-dialog">
			<view class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
				<text @tap.stop.prevent="madeInDialog=false">取消</text>
				<text class="text-orange" @tap.stop.prevent="originDialogConfirm">确定</text>
			</view>
			<hoprxi-region-picker @change="handlerChange" :value="initPlaceOfOrigin" hideArea>
			</hoprxi-region-picker>
		</view>
	</view>
	<!-- 定价策略对话框 -->
	<view class="cu-modal" :class="{'show':pricingStrategyModalDialog}">
		<view class="cu-dialog">
			<image class="align-center margin-top-xs" style="width: 100%,height:136rpx;"
				:src="(item.images&&item.images[0])||'/static/workflow_icon/archives.png'" mode="scaleToFill" />
			<view class="text-bold text-left margin-top-xs padding-lr-xs">
				{{item.name&&item.name.name}}
			</view>
			<view class="flex justify-between text-olive text-sm padding-lr-xs">
				<text v-if="sign === 'scale'">PLU码：{{item.plu}}</text>
				<text v-else>条码：{{item.barcode}}</text>
				<text>规格：{{item.specs||'--'}}</text>
			</view>
			<view class="flex text-center nav bg-cyan margin-top-xs">
				<block v-for="(tab,index) in timeTab" :key="tab">
					<view class="cu-item flex-sub" :class="{' cur':index === timeTabCur}" @tap="timeTabCur = index">
						{{tab}}
					</view>
				</block>
			</view>
			<view class="grid col-3 bg-cyan light ">
				<view class="flex flex-direction cu-item solid-top solid-bottom padding-tb text-center">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域售价中位数</view>
					<text class="text-bold text-price padding-top-sm"
						style="font-size: 42rpx; color: orangered;">{{item.vip&&item.vip.referenceSalePrice||'134.58'}}</text>
				</view>
				<view class="flex flex-direction cu-item solid-left solid-bottom solid-top padding-tb text-center">
					<view class="text-center" style="font-size: 27rpx;">售价</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: brown;">{{item.retailPrice||'---'}}</text>
				</view>
				<view class="flex flex-direction cu-item solid-left solid-bottom solid-top padding-tb text-center">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域销售金额</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: red;">{{item.vip&&item.vip.referenceSalePrice||'96725.85'}}</text>
				</view>
				<view class="flex flex-direction cu-item solid-bottom padding-tb text-center">
					<view class="text-center" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">最近采购价</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: blueviolet;">{{item.vip&&item.vip.referenceSalePrice||'---'}}</text>
				</view>
				<view class="flex flex-direction cu-item solid-left solid-bottom solid-right padding-tb text-center">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域采购中位价</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: cyan;">{{item.vip&&item.vip.referenceSalePrice||'110.88'}}</text>
				</view>
			</view>
			<view class="flex flex-sub justify-center padding-lg bg-grey light"
				@tap="pricingStrategyModalDialog = false">知道了</view>
		</view>
	</view>
	<!-- 单位选择抽屉框遮罩-->
	<view :class="['mask',{'show':unitDrawerDialog}]" @tap.stop="unitDrawerDialog = false"></view>
	<!-- 单位选择抽屉框 -->
	<view class="unitsDrawer" :class="{'show':unitDrawerDialog}" @tap.stop="unitDrawerDialog = false"
		:style="{top:navBarHeight + 'px',height:'calc(100vh - ' + navBarHeight + 'px)'}">
		<view class="padding-sm solid-bottom text-left">
			<text class="cuIcon-titles text-orange"></text>
			<text>选择价格单位</text>
		</view>
		<view class="units">
			<block v-for="(unitItem, index) in units" :key="unitItem">
				<text class="padding-tb-xs padding-lr text-center margin-top-sm"
					:class="unitItem === unit?'unitSelected text-red light bg-orange':'unit bg-grey'"
					@tap.stop="selectUnit(unitItem)">{{unitItem}}</text>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		onBeforeMount,
		toRef
	} from 'vue';
	import {
		formatMoney
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	import ajax from '@/uni_modules/u-ajax'
	const unitPattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
	export default {
		setup(props, content) {
			let key = ref(0);
			let next = ref(133);
			let previous = ref(0);
			let sign = ref('');
			let action = ref('');
			let item = ref({});
			let navBarHeight = ref(0);
			let scanResult = null;
			let name = {
				name: null,
				alias: null
			};
			const aliasModalDialog = ref(false);
			let spec = null;
			let category = null;
			let grade = '合格品';
			let gradeDialog = ref(false);
			let madeIn = null;
			let madeInDialog = ref(false);

			const pricingStrategyModalDialog = ref(false);
			const timeTab = ['30天', '60天', '180天', '360天'];
			let timeTabCur = ref(0);
			let retailPrice = ref(0);

			const unitDrawerDialog = ref(false);
			const grades = [];
			const units = [];
			onBeforeMount(() => {
				for (const g of catalog.grades)
					grades.push(g);
				ajax({
					url: 'https://hoprxi.tooo.top/catalog/core/v1/units',
				}).then(res => {
					for (const u of res.data.units)
						units.push(u)
				}).catch(err => {
					console.log(err)
				});
			})
			return {
				previous,
				next,
				sign,
				action,
				item,
				navBarHeight,
				scanResult,
				name,
				aliasModalDialog,
				spec,
				category,
				grade,
				gradeDialog,
				madeIn,
				madeInDialog,
				pricingStrategyModalDialog,
				timeTab,
				timeTabCur,
				retailPrice,
				unitDrawerDialog,
				units,
				grades,
			}
		},
		data() {
			return {
				good: null,
				initMadeIn: [],
				regionResult: null,
				purchasePrice: '',
				memberPrice: '',
				originDialog: false,
				unit: null,
				shelfLife: '',
				pullingDown: false, // 是否正在下拉
				currentTouchStartY: 0,
				pullDownHeight: 0, // 下拉高度
				refresherThreshold: 60 //下拉刷新阈值60px
			}
		},
		onLoad(options) {
			this.sign = options.sign || 'good';
			this.action = options.action || 'new';
			let key = options.id || options.plu;
			if (key) {
				for (const good of catalog.catalog) {
					if (key == good.id || key == good.plu) {
						this.item = good;
						this.grade = good.grade;
						break;
					}
				}
			}
			for (const item of catalog.catalog) {
				if (item.id == options.id || item.plu == options.plu) {
					this.good = item;
					this.presetGrade = this.good.grade;
					break;
				}
			}
			if (this.good) {
				this.unit = unitPattern.exec(this.good.retailPrice)[1];
			}
			//let pattern = new RegExp("^([\u4e00-\u9fa5]{1,}[省|市|自治区]?)\.([\u4e00-\u9fa5]{1,}[市|区|县|州|盟|地区]?)$", "i");
			//let pattern = new RegExp(/(^\d+)天$/i);
			//let result = pattern.exec("35") //"内蒙古.呼和浩特"
			console.log(this.grade);
		},
		onReady() {
			let query = uni.createSelectorQuery().in(this);
			query.select('#navBar').boundingClientRect().exec(rect => {
				this.navBarHeight = rect[0].height;
			});
		},
		watch: {
			unit() {
				if (this.retailPrice) {
					this.retailPrice = this.retailPrice.replace(unitPattern, '') + "/" + this.unit;
					return;
				}
				if (this.good && this.good.retailPrice) {
					this.good.retailPrice = this.good.retailPrice.replace(unitPattern, '') + "/" + this
						.unit;
				}
			}
		},
		computed: {
			retailGrossProfitRate() {
				let cost = this.purchasePrice ? this.purchasePrice.replace(unitPattern, '') : this.good ?
					this.good.storage
					.lastPurchasePrice.replace(unitPattern, '') : 0;
				if (this.retailPrice) return this.computedGrossProfitRate(cost, this.retailPrice.replace(
					unitPattern,
					'')) + '%';
				if (this.purchasePrice) {
					if (this.good && !this.retailPrice) return this.computedGrossProfitRate(cost, this.good
						.retailPrice
						.replace(unitPattern, '')) + '%';
					if (this.retailPrice) return this.computedGrossProfitRate(cost, this.retailPrice
						.replace(unitPattern,
							'')) + '%';
					return '0%';
				}
				if (this.good) return this.computedGrossProfitRate(cost, this.good.retailPrice.replace(
						unitPattern, '')) +
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
			save() {
				console.log(this.scanResult);
			},
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
				switch (sign) {
					case 'plu':
						break;
					case 'barcode':
						break;
				}
			},
			scanResultBlur(sign) {
				switch (sign) {
					case 'plu':
						if (scanResult <= 0 || scanResult > 999999)
							this.$util.toast('Plu码仅支持整数，范围在1-999999之间！')
						break;
					case 'barcode':
						break;
				}
			},
			grade_selected(grade) {
				this.grade = grade;
				this.gradeDialog = false;
			},
			showMadeInDialog() {
				let pattern = new RegExp(
					/^([\u4e00-\u9fa5]{1,}[省|市|自治区]?)\.([\u4e00-\u9fa5]{1,}[市|区|县|州|盟|地区]?)$/i);
				let result = pattern.exec(this.item.madeIn);
				if (this.madeIn) result = pattern.exec(this.madeIn);
				if (result) {
					let province = ["北京市", "天津市", "上海市"];
					if (province.includes(result[1])) {
						this.initMadeIn = [result[1], result[1], result[2]];
					} else if (result[1] === '重庆市') {
						let area = ["城口县", "丰都县", "垫江县", "忠县", "云阳县", "奉节县", "巫山县", "巫溪县", "石柱土家族自治县",
							"秀山土家族苗族自治县",
							"酉阳土家族苗族自治县", "彭水苗族土家族自治县"
						];
						if (area.includes(result[2])) //直辖县
							this.initMadeIn = [result[1], '直辖县', result[2]];
						else this.initMadeIn = [result[1], result[1], result[2]];
					} else if (result[1] === '新疆维吾尔自治区') {
						let area = ["石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "北屯市", "铁门关市", "双河市", "可克达拉市", "昆玉市",
							"胡杨河市"
						];
						if (area.includes(result[2])) //直辖县
							this.initMadeIn = [result[1], '直辖县', result[2]];
					} else if (result[1] === '海南省') {
						let area = ["五指山市", "琼海市", "文昌市", "万宁市", "东方市", "定安县", "屯昌县", "澄迈县", "临高县",
							"白沙黎族自治县", "昌江黎族自治县",
							"乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"
						];
						if (area.includes(result[2])) //直辖县
							this.initMadeIn = [result[1], '直辖县', result[2]];
					} else if (result[1] === '湖北省') {
						let area = ["仙桃市", "潜江市", "天门市", "神农架林区"];
						if (area.includes(result[2])) //直辖县
							this.initMadeIn = [result[1], '直辖县', result[2]];
					}
					if (this.initMadeIn.length === 0) {
						this.initMadeIn = [result[1], result[2]];
					}
				} else {
					this.initMadeIn = [];
				}
				//console.log(this.initPlaceOfOrigin);
				this.madeInDialog = true;
			},
			handlerChange(res) {
				let _this = this;
				this.regionResult = {
					...res
				};
			},
			originDialogConfirm() {
				this.madeInDialog = false;
				let obj = this.regionResult.obj;
				let province = ['110000', '120000', '310000', '500000'];
				let city = ['429000', '469000']
				if (province.includes(obj.province.value) || city.includes(obj.city.value)) {
					this.madeIn = obj.province.label + "." + obj.area.label;
				} else {
					this.madeIn = obj.province.label + "." + obj.city.label;
				}
			},
			navToCategory(id) {
				this.$util.navTo('/pages/workflow/catalog/category?id=' + id);
			},

			selectUnit(v) {
				this.unitDrawerDialog = false;
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
				if (price === null || price === 0 || price === '0' || price === '0.00' || price === '0.0')
					return '0';
				let difference = price - cost;
				return (difference / price * 100).toFixed(2);
			},
			shelfLifeBlur(event) {
				this.shelfLife = event.target.value;
				if (this.shelfLife) {
					let pattern = new RegExp(/天$/);
					let temp = this.shelfLife.replace(pattern, '');
					this.shelfLife = temp + ' 天';
				}
			},
			chooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					//sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['camera'], //开相机  album 图册
					success: (res) => {
						if (this.item.images && this.item.images.length != 0) {
							this.item.images = this.item.images.concat(res.tempFilePaths)
						} else {
							this.item.images = res.tempFilePaths
						}
					}
				});
			},
			viewImage(e) {
				uni.previewImage({
					urls: this.item.images,
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
							this.item.images.splice(e.currentTarget.dataset.index, 1)
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
				const computeDistance = movingDistance > this.refresherThreshold ? this
					.refresherThreshold + moreDistance :
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

<style lang='scss'>
	.mask {
		display: flex;
		position: fixed;
		z-index: 7;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;

		&.show {
			opacity: 1;
			transition-duration: 0.3s;
			pointer-events: auto;
		}
	}

	.unitsDrawer {
		display: flex;
		position: fixed;
		flex-direction: column;
		width: 62vw;
		right: 0;
		bottom: 0;
		z-index: 7;
		transform: scale(0.9, 0.9) translateX(100%);
		background-color: #fff;
		border-top-left-radius: 24rpx;
		border-bottom-left-radius: 24rpx;
		opacity: 0;
		transition: all 0.4s;
		padding: 16rpx 0 0 16rpx;

		&.show {
			transform: scale(1, 1) translateX(0%);
			opacity: 1;
			pointer-events: all;
		}

		.units {
			display: flex;
			flex-wrap: wrap;
			font-size: 28rpx;
			padding: 12rpx 0 0 8rpx;

			.unit {
				border-radius: 8rpx;
				border: 1rpx solid #9b9b9b;
				margin-right: 14rpx;
			}

			.unitSelected {
				border-radius: 8rpx;
				border: 1rpx solid #fbbd08;
				margin-right: 14rpx;
			}
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
