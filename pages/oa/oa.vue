<template>
	<view>
		<hoprxi-navigation title="OA" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']"
			id="navBar" :surplusHeight="43">
			<view slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品条码、名称、拼音助记码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white">
					<text class="cuIcon-close "></text>
					<text @click="computedScrollViewHeight">取消</text>
				</view>
			</view>
		</hoprxi-navigation>

		<!--<hop-filterDropdown :menus="menus_filter"></hop-filterDropdown>-->

		<!--工作流-->
		<view class="work">
			<hoprxi-cell decorateIcon="/static/user_icon/attendance.png" title="工作流" />
			<view class="cu-list grid col-5 no-border grid_list">
				<view class="cu-item" v-for="(item, index) in attendanceList" :key="index"
					@tap.stop="this.$util.navTo('/pages/public/not_implemented')">
					<view class="text-red">
						<image class="img" :src="item.icon" />
						<view class="cu-tag badge">
							<block>2</block>
						</view>
					</view>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
		<hoprxi-drag-fab :menus="menus" direction="vertical"></hoprxi-drag-fab>
		<!--<uni-fab :pattern="fabPattern" :content="menus" horizontal="left" vertical="bottom" direction="vertical"
			@trigger="trigger"></uni-fab>
		
		<hop-slides :items="dataList" radius @click="itemClick" @del="del" @edit="edit">
			<template v-slot="{data}">
				<view>{{data.content}}</view>
				<view>{{data.content}}</view>
			</template>
		</hop-slides>
	-->
		<block v-for="(item,index) in dataList" :key="index">
			<hop-slide :item="item" @edit="edit" @del="del" @item_click="slide_item_click" :position="index">
				<template v-slot:default="{data}">
					<view>{{data.content}}</view>
					<view>{{data.content}}</view>
				</template>
			</hop-slide>
		</block>

	</view>
</template>

<script>
	import catalog_test from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		data() {
			return {
				attendanceList: [{
					icon: '/static/user_icon/clock_in.png',
					url: '/pages/user/clock_in',
					title: '打卡',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/work_overtime.png',
					url: '/pages/user/work_overtime',
					title: '加班',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/leave.png',
					url: '/pages/user/leave',
					title: '请假',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/apply_for_car.png',
					url: '/pages/warehouse/warehouse',
					title: '用车',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/travel.png',
					url: '/pages/warehouse/warehouse',
					title: '出差',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/repair.png',
					url: '/pages/warehouse/warehouse',
					title: '报修',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/apply.png',
					url: '/pages/warehouse/warehouse',
					title: '申领',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/purchase.png',
					url: '/pages/warehouse/warehouse',
					title: '申购',
					color: '#ff6b81'
				}, {
					icon: '/static/user_icon/reimbursement.png',
					url: '/pages/user/go_out',
					title: '报销',
					color: '#ff6b81'
				}, ],
				dataList: [],
				fabPattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#027A6F',
				},
				menus: [{
					iconPath: '/static/workflow_icon/new.png',
					selectedIconPath: '/static/workflow_icon/new.png',
					text: '新增商品',
					event: 'addGood'
				}, {
					iconPath: '/static/workflow_icon/new_kg.png',
					selectedIconPath: '/static/workflow_icon/new_kg.png',
					text: '新增散秤',
					event: 'addScale'
				}, {
					iconPath: '/static/workflow_icon/count.png',
					selectedIconPath: '/static/workflow_icon/count.png',
					text: '商品类目',
					event: 'category'
				}, {
					iconPath: '/static/workflow_icon/new.png',
					selectedIconPath: '/static/workflow_icon/new.png',
					text: '新增服装',
					event: 'addGood'
				}, ],
				menus_filter: [],
				scanResult:'',
			}
		},
		created() {
			this.$nextTick(() => {
				for (var i = 0; i < 5; i++) {
					this.dataList.push({
						content: "瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半",
						id: i,
						img: [1, 2, 5].indexOf(i) == -1 ?
							'https://cdn.uviewui.com/uview/swiper/3.jpg' : '',
					})
				}
			})
			this.$nextTick(() => {
				//this.$refs.slide.assignment(this.dataList)
			})
			//拷贝：catalog_test.category.map((x) => x)
			this.menus_filter = catalog_test.category.map((x) => x);
			this.menus_filter.splice(0, 0, {
				id: "-9999",
				name: "全部",
			});
			//console.log(this.menus_filter);
		},
		methods: {
			//点击单行
			slide_item_click() {
				console.log('点击外面')
			},
			//删除
			del(data) {
				console.log('删除', data)
				uni.showToast({
					title: '删除ID--' + data.id,
					icon: 'none'
				})
			},
			//编辑
			edit(data) {
				console.log('编辑', data)
				uni.showToast({
					title: '编辑ID--' + data.id,
					icon: 'none'
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.hop-slide {
		margin: 15rpx;
		background: #fff;
	}

	.cont {
		display: flex;
		flex: 1;
		justify-content: space-between;
		//transform: translateX(300rpx);
		margin-left: -300rpx;


		.left {
			display: flex;
			flex: 1 1 auto;
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
		}

	}

	.top {
		position: absolute;
		top: calc(var(--status-bar-height) + 20rpx);
		z-index: 90;
		font-size: 32rpx;
		color: #606266;
	}

	.work {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 20rpx 0rpx 20rpx;

		.img {
			width: 48rpx;
			height: 48rpx;
		}

		.grid_list {
			padding: 20rpx 0rpx 0rpx 0rpx;
		}
	}

	.t-wrap {
		padding: 0 30rpx;
	}

	.t-conten {
		/*  #ifdef  APP-PLUS||H5||MP  */
		display: flex;
		/*  #endif  */
		flex-direction: row;
		padding: 10rpx 0;
	}

	.t-conten-image {
		flex: 1;
		height: 100rpx;
		margin-right: 10rpx;
	}

	.t-conten-text {
		flex: 2;
		font-size: 24rpx;
	}
</style>
