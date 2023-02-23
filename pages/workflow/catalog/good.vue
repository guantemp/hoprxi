<template>
	<hoprxi-navigation :title="Object.keys(item).length>0?'商品编辑':'商品新增'"
		:backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']" id="navBar">
	</hoprxi-navigation>
	<view v-if="Object.keys(item).length>0" class="flex justify-between padding-lr-xs margin-top-xs">
		<view class="flex">
			<button class="cu-btn radius shadow bg-grey basis-xs margin-right-sm cuIcon-pullleft"
				:class="{'text-xxl': previous>0}" @tap.stop="load(previous)">
			</button>
			<button class="cu-btn radius shadow bg-grey basis-xs cuIcon-pullright" :class="{'text-xxl': next>0}"
				@tap.stop="load(next)">
			</button>
		</view>
		<button class="cu-btn radius shadow bg-blue basis-sm" @tap.stop="save">
			保存</button>
	</view>
	<view v-else class="flex margin-top-xs justify-end padding-lr-xs">
		<button class="cu-btn radius shadow bg-gray" @tap="save('draft')">
			存草稿</button>
		<button class="cu-btn radius shadow bg-blue margin-left-xl" @tap.stop="save('save_and_new')">
			保存&新增</button>
		<button class="cu-btn radius shadow bg-blue margin-left-xs" @tap.stop="save">
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
				@change="scanResultChange" type="number">
			<view class="cu-capsule radius">
				<view class="cu-tag bg-blue text-lg" @tap.stop="scan"><text class='cuIcon-scan text-white'></text>
				</view>
				<view class="cu-tag line-blue text-df" @tap.stop="generate">生成</view>
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
			<input v-model="grade" :placeholder="item.grade||'合格品'" disabled @click="gradeDialog = true">
		</view>
		<view class="cu-form-group">
			<view class="title" @tap.stop="$util.toast('要求精确到到市级！')">
				商品产地<text class="text-red margin-left-xs">*</text></view>
			<input v-model="madeIn.name" :placeholder="item.madeIn&&item.madeIn.name||''" @change="searchArea">
			<text class="cuIcon-right" @tap.stop="madeInSelect"></text>
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
			<input v-if="Object.keys(item).length>0"
				:placeholder="item.storage&&(item.storage.lastPurchasePrice.amount+'/'+item.storage.lastPurchasePrice.unit)||'0.00/PCS'"
				disabled>
			<input v-else
				:placeholder="item.storage&&(item.storage.lastPurchasePrice.amount+'/'+item.storage.lastPurchasePrice.unit)||'0.00/PCS'"
				:value="purchasePrice" type="digit" @blur="purchasePriceBlur">
		</view>
		<view class="cu-form-group">
			<view class="title" @tap.stop="$util.toast('0.00元表示为未定价商品，POS系统每次销售时都会询问售价！')">
				零&nbsp;&nbsp;售&nbsp;&nbsp;价<text class="cuIcon-info"></text></view>
			<view class="flex flex-sub">
				<input :placeholder="item.retailPrice&&(item.retailPrice.amount+'/'+item.retailPrice.unit)||'0.00/PCS'"
					:value="retailPrice" type="digit" @blur="retailPriceBlur">
				<hoprxi-badge :count="'毛利率：'+ retailGrossProfitRate">
				</hoprxi-badge>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title margin-right-sm">会&nbsp;&nbsp;员&nbsp;&nbsp;价</view>
			<view class="flex flex-sub">
				<hoprxi-badge :count="'毛利率：'+ retailGrossProfitRate" class="basis-df">
					<input
						:placeholder="item.memberPrice&&(item.memberPrice.amount+'/'+item.memberPrice.unit)||'0.00/PCS'"
						:value="memberPrice" type="digit" @blur="memberPriceBlur">
				</hoprxi-badge>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title margin-right-sm">VIP&nbsp;&nbsp;&nbsp;价</view>
			<view class="flex flex-sub">
				<input :placeholder="item.vipPrice&&(item.vipPrice.amount+'/'+item.vipPrice.unit)||'0.00/PCS'"
					:value="vipPrice" type="digit" @blur="vipPriceBlur">
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
				<input type="text" :placeholder="(item.name&&item.name.alias)||'请输入商品的另外一个名称'" v-model="name.alias"
					class="text-green">
			</view>
			<view class="cu-bar" @tap="aliasModalDialog = false">
				<text class="action flex-sub">好</text>
			</view>
		</view>
	</view>
	<!--商品等级对话框-->
	<view :class="['cu-modal',{'show':gradeDialog}]" @tap="gradeDialog = false">
		<view class="cu-dialog padding-lr-sm">
			<block v-for="(g,index) in grades" :key="g">
				<view class="flex justify-between solid-bottom align-center padding-tb padding-lr-sm"
					:class="{'text-green text-bold':grade === g}" @tap="grade = g">
					<text>{{g}}</text>
					<text class="cuIcon-check text-xl" v-if="grade === g"></text>
				</view>
			</block>
		</view>
	</view>
	<!-- 产地选择对话框 -->
	<view class="cu-modal bottom-modal" :class="{'show':madeInSelectDialog}" @tap="madeInSelectDialog=false">
		<view class="cu-dialog">
			<view class="flex align-center justify-between padding-lr-lg padding-tb-sm bg-white solid-bottom text-lg">
				<text @tap.stop.prevent="madeInSelectDialog=false">取消</text>
				<text class="text-orange" @tap.stop.prevent="madeInSelectConfirm">确定</text>
			</view>
			<hoprxi-area-picker @selected="madeInSelected" :initialArea="initialArea" :showCounty="false">
			</hoprxi-area-picker>
		</view>
	</view>
	<!--产地搜索对话框-->
	<view :class="['cu-modal',{'show':searchAreaDialog}]" @tap="searchAreaDialog = false">
		<view class="cu-dialog padding-lr-sm">
			<view class="solid-bottom line-blue padding-tb-sm text-left text-lg align-center">
				<text class="cuIcon-list margin-right-sm "></text>当前有多个可选地址
			</view>
			<block v-for="(area,index) in areasSearched" :key="index">
				<view v-if="index <=13"
					class="flex justify-between solid-bottom align-center padding-tb-sm padding-lr-sm"
					@tap="searchedAreaSelect(area)">
					<view><text>{{area.name}}</text>
						<text class="text-sm margin-left-xs text-gray">{{area.parentName}}</text>
					</view>
				</view>
			</block>
			<view v-if="areasSearched.length>13" class="solid-top line-green padding-tb-sm text-right text-brown">
				<text class="cuIcon-warn margin-right-sm"></text>候选地址太多，请缩小查询范围！
			</view>
		</view>
	</view>
	<!-- 定价策略对话框 -->
	<view class="cu-modal" :class="{'show':pricingStrategyModalDialog}">
		<view class="cu-dialog">
			<image class="align-center margin-top-xs" style="width: 100%,height:136rpx;"
				:src="(item.images&&item.images[0])||'/static/workflow_icon/archives.png'" mode="scaleToFill" />
			<view class="text-bold text-left padding-lr-xs">
				{{item.name&&item.name.name}}
			</view>
			<view class="flex justify-between text-olive text-sm padding-lr-xs">
				<text v-if="sign === 'scale'">PLU码：{{item.plu}}</text>
				<text v-else>条码：{{item.barcode}}</text>
				<text>规格：{{item.spec||'--'}}</text>
			</view>
			<view class="flex text-center nav bg-cyan margin-top-xs">
				<block v-for="(tab,index) in timeTab" :key="tab">
					<view class="cu-item flex-sub" :class="{' cur':index === timeTabCur}" @tap="timeTabCur = index">
						{{tab}}
					</view>
				</block>
			</view>
			<view class="grid col-3 bg-cyan light text-center">
				<view class="flex-direction cu-item solid-top solid-bottom padding-tb ">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域售价中位数</view>
					<text class="text-bold text-price padding-top-sm"
						style="font-size: 42rpx; color: orangered;">{{item.vip&&item.vip.referenceSalePrice||'134.58'}}</text>
				</view>
				<view class="flex-direction cu-item solid-left solid-bottom solid-top padding-tb">
					<view class="text-center" style="font-size: 27rpx;">售价</view>
					<text class="text-bold padding-top-sm text-orange"
						style="font-size: 42rpx; color: brown;">{{item.retailPrice&&item.retailPrice.amount||'---'}}</text>
				</view>
				<view class="flex-direction cu-item solid-left solid-bottom solid-top padding-tb">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域销售金额</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: red;">{{item.vip&&item.vip.referencePurchasePrice||'96725.85'}}</text>
				</view>
				<view class="flex-direction cu-item solid-bottom padding-tb">
					<view class="text-center" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">最近采购价</view>
					<text class="text-bold  padding-top-sm text-orange"
						style="font-size: 42rpx; color: blueviolet;">{{item.storage&&item.storage.lastPurchasePrice.amount||'---'}}</text>
				</view>
				<view class="flex-direction cu-item solid-left solid-bottom solid-right padding-tb">
					<view class="cuIcon-vip" style="font-size: 27rpx;"
						@click.stop="$util.toast('普通用户定位到省，vip用户定位到周边3-5KM')">区域采购中位价</view>
					<text class="text-bold text-price padding-top-sm text-orange"
						style="font-size: 42rpx; color: cyan;">{{item.vip&&item.vip.referenceSalePrice||'110.88'}}</text>
				</view>
			</view>
			<view class="flex flex-sub justify-center padding bg-grey light" @tap="pricingStrategyModalDialog = false">
				知道了</view>
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
					@tap="unit = unitItem">{{unitItem}}</text>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		computed,
		onBeforeMount,
		watch,
	} from 'vue';
	import {
		formatMoney,
		toast
	} from '@/uni_modules/hoprxi-common/js_sdk/util.js';
	import catalog from '@/data/catalog_test_data.js'; //用例数据库
	import ajax from '@/uni_modules/u-ajax'
	export default {
		setup(props, content) {
			let key = ref(0);
			let sign = ref('');
			let next = ref(133);
			let previous = ref(0);
			const load = (key) => {};
			const save = (action) => {
				switch (action) {
					case "save":
						break;
					default:
						console.log(name.name);
				}
			};
			let item = ref({});
			let navBarHeight = ref(0);
			const chooseImage = () => {
				uni.chooseImage({
					count: 4, //默认9
					//sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['camera'], //开相机  album 图册
					success: (res) => {
						if (item.value.images && item.value.images.length != 0) {
							item.value.images = item.value.images.concat(res.tempFilePaths)
						} else {
							item.value.images = res.tempFilePaths
						}
					}
				});
			};
			const viewImage = (e) => {
				uni.previewImage({
					urls: item.value.images,
					current: e.currentTarget.dataset.url
				});
			};
			const delImg = (e) => {
				uni.showModal({
					title: '警告',
					content: '确定要删除这张图片？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							item.value.images.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			};
			let scanResult = ref('');
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
			const generate = () => {
				switch (sign.value) {
					case "good":
						break;
					case "scale":
						break;
				}
			};
			const scanResultChange = () => {
				switch (sign.value) {
					case 'scale':
						if (scanResult.value <= 0 || scanResult.value > 999999) toast('Plu码仅支持整数，范围在1-999999之间！')
						break;
					case 'barcode':
						break;
				}
			};
			let name = {};
			const aliasModalDialog = ref(false);
			let spec = null;
			let category = null;
			const navToCategory = (id) => {
				uni.navigateTo({
					url: '/pages/workflow/catalog/category?id=' + id
				})
			};
			let grade = '合格品';
			const gradeDialog = ref(false); //如果使用tap并没有stop修饰，会冒泡到上级@tap事件并执行
			const grades = ['优等品', '一等品', '合格品', '不合格品'];
			let madeIn = {};
			const madeInSelectDialog = ref(false);
			let madeInSelectedResult = null;
			const madeInSelected = (data) => { //area-picker选择结果
				madeInSelectedResult = data;
			};
			const madeInSelectConfirm = () => {
				madeInSelectDialog.value = false;
				madeIn.name = madeInSelectedResult[1].name;
				madeIn.code = madeInSelectedResult[1].code;
				madeIn.parentName = madeInSelectedResult[1].parentName;
			};
			let searchAreaDialog = ref(false);
			const areasSearched = reactive([]);
			const searchArea = () => {
				ajax({
					url: 'https://hoprxi.tooo.top/area/v1/areas',
					data: {
						search: '^' + madeIn.name,
						filters: 'city,country'
					}
				}).then(res => {
					areasSearched.length = 0;
					for (const a of res.data.areas) {
						areasSearched.push({
							code: a.code,
							name: a.name.name,
							parentName: a.parent.name
						})
					};
					if (areasSearched.length === 1) {
						madeIn.name = areasSearched[0].name;
						madeIn.code = areasSearched[0].code;
						madeIn.parentName = areasSearched[0].parentName;
					}
					if (areasSearched.length > 1) {
						searchAreaDialog.value = true;
					}
				}).catch(err => {
					console.log(err)
				});
			};
			const searchedAreaSelect = (a) => {
				madeIn.name = a.name;
				madeIn.code = a.code;
				madeIn.parentName = a.parentName;
				searchAreaDialog.value = false;
			};
			const initialArea = reactive([]);
			const madeInSelect = () => {
				initialArea.length = 0;
				if (Object.values(madeIn).length > 0 && madeIn.name != "") {
					initialArea.push(madeIn.parentName);
					initialArea.push(madeIn.name);
				} else {
					//let pattern = new RegExp(
					///^([\u4e00-\u9fa5]{1,}[省|市|自治区]?)\.([\u4e00-\u9fa5]{1,}[市|区|县|州|盟|地区]?)$/i);
					ajax({
						url: 'https://hoprxi.tooo.top/area/v1/areas/:code',
						params: {
							code: item.value.madeIn.code
						},
					}).then((res) => {
						let area = res.data;
						initialArea.push(area.parent.name);
						initialArea.push(area.name.name);
					})
				}
				madeInSelectDialog.value = true;
			};
			const pricingStrategyModalDialog = ref(false);
			const timeTab = ['30天', '60天', '180天', '360天'];
			let timeTabCur = ref(0);
			const units = [];
			let unit = ref('');
			const unitDrawerDialog = ref(false);
			watch(unit, () => {
				const unitPattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
				//unit = unitPattern.exec(item.retailPrice)[1];
				if (retailPrice.value.length != 0) {
					retailPrice.value = retailPrice.value.replace(unitPattern, '') + "/" + unit;
				}
				if (item) {
					item.value.retailPrice.unit = unit;
					item.value.memberPrice.unit = unit;
					item.value.vipPrice.unit = unit;
				}
				if (item && item.value.storage) {
					item.value.storage.lastPurchasePrice.unit = unit;
				}
				//console.log(item.value)
			});
			let pricePattern = new RegExp(/\/?([\u4e00-\u9fa5]{1,2}|500g|kg|pcs)?$/);
			let purchasePrice = '';
			let retailPrice = ref('');
			const retailPriceBlur = (event) => {
				retailPrice.value = event.target.value;
				if (retailPrice) {
					let temp = retailPrice.value.replace(pricePattern, '');
					console.log(temp);
					retailPrice.value = '¥ ' + formatMoney(temp) + "/" + (unit.value || 'pcs');
					console.log(retailPrice.value);
				}
			};
			let memberPrice = '';
			let vipPrice = '';
			const profitRate = computed(() => {
				let cost = purchasePrice ? purchasePrice.replace(unitPattern, '') : good ? good.storage
					.lastPurchasePrice.replace(unitPattern, '') : 0;
				//console.log(cost);
				if (retailPrice) return this.computedProfitRate(cost, retailPrice.replace(unitPattern, '')) + '%';
				if (purchasePrice) {
					if (good && !retailPrice) return this.computedProfitRate(cost, good.retailPrice.replace(
						unitPattern, '')) + '%';
					if (retailPrice) return this.computedProfitRate(cost, retailPrice.replace(unitPattern, '')) +
						'%';
					return '0%';
				}
				if (good) return computedProfitRate(cost, good.retailPrice.replace(unitPattern, '')) + '%';
			});
			const computedprofitRate = (cost, price) => {
				if (cost === null || cost === 0 || cost === '0') return '100';
				if (price === null || price === 0 || price === '0' || price === '0.00' || price === '0.0') return '0';
				let difference = price - cost;
				return (difference / price * 100).toFixed(2);
			};
			onBeforeMount(() => {
				ajax({
					url: 'https://hoprxi.tooo.top/catalog/core/v1/units',
				}).then(res => {
					for (const u of res.data.units) units.push(u)
				});
			});
			return {
				previous,
				next,
				sign,
				item,
				load,
				save,
				generate,
				scanResultChange,
				navBarHeight,
				chooseImage,
				viewImage,
				delImg,
				scanResult,
				scan,
				name,
				aliasModalDialog,
				spec,
				category,
				navToCategory,
				grades,
				grade,
				gradeDialog,
				madeIn,
				madeInSelectDialog,
				madeInSelected,
				madeInSelectConfirm,
				searchArea,
				searchAreaDialog,
				areasSearched,
				searchedAreaSelect,
				madeInSelect,
				initialArea,
				pricingStrategyModalDialog,
				timeTab,
				timeTabCur,
				units,
				unit,
				unitDrawerDialog,
				purchasePrice,
				retailPrice,
				retailPriceBlur,
				memberPrice,
				vipPrice
			}
		},
		data() {
			return {
				good: null,
				shelfLife: '',
				pullingDown: false, // 是否正在下拉
				currentTouchStartY: 0,
				pullDownHeight: 0, // 下拉高度
				refresherThreshold: 60 //下拉刷新阈值60px
			}
		},
		onLoad(options) {
			this.sign = options.sign || 'good';
			let key = options.id || options.plu;
			if (key) {
				if (this.sign === 'good') {
					ajax({
						url: 'https://hoprxi.tooo.top/catalog/core/v1/items/:id',
						params: {
							id: key
						},
					}).then((res) => {})
				} else {
					ajax({
						url: 'https://hoprxi.tooo.top/catalog/scale/v1/items/:plu',
						params: {
							plu: key
						},
					}).then((res) => {
						console.log(res.data);
					})
				}
				for (const good of catalog.catalog) {
					if (key == good.id || key == good.plu) {
						this.item = good;
						this.grade = good.grade;
						this.unit = good.retailPrice.unit;
						break;
					}
				}
				console.log(this.item);
			}
			//console.log(this.grade);
		},
		onReady() {
			let query = uni.createSelectorQuery().in(this);
			query.select('#navBar').boundingClientRect().exec(rect => {
				this.navBarHeight = rect[0].height;
			});
			/*
			uni.createSelectorQuery().select('#navBar').boundingClientRect(res => {
				this.navBarHeight = res.height;
			}).exec();
			*/
		},
		computed: {
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
			purchasePriceBlur(event) {},
			shelfLifeBlur(event) {
				this.shelfLife = event.target.value;
				if (this.shelfLife) {
					let pattern = new RegExp(/天$/);
					let temp = this.shelfLife.replace(pattern, '');
					this.shelfLife = temp + ' 天';
				}
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
