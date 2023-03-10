<template>
	<view class="bg-gradual-green" style="height: 100vh;">
		<hoprxi-navigation title="办公自动化" :backgroundColor="[1, ['#39b54a', '#8dc63f', 135]]" :titleFont="['#FFF']"
			id="navBar" :surplusHeight="12">
		</hoprxi-navigation>
		<view class="work">
			<hoprxi-cell icon="/static/oa_icon/affair.png" :title="{name:'事务',weight:260}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border item_grid_list">
				<block v-for="(item, index) in affair" :key="index">
					<view class="cu-item" @tap.stop="$util.navTo('/pages/public/not_implemented')">
						<view>
							<image class="img" :src="item.icon"></image>
							<view class="cu-tag badge" v-if="item.new && item.new >0">
								<block>{{item.new}}</block>
							</view>
						</view>
						<text>{{ item.title }}</text>
					</view>
				</block>
			</view>
		</view>
		<view class="work">
			<hoprxi-cell icon="/static/oa_icon/logistics.png" :title="{name:'后勤',weight:260}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border item_grid_list">
				<view class="cu-item" v-for="(item, index) in logistics" :key="index"
					@tap.stop="$util.navTo('/pages/public/not_implemented')">
					<view class="text-red">
						<image class="img" :src="item.icon" />
						<view class="cu-tag badge" v-if="item.new && item.new > 0">
							<block>{{item.new}}</block>
						</view>
					</view>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
		<view class="work">
			<hoprxi-cell icon="/static/oa_icon/finance.png" :title="{name:'财务',weight:260}"
				:line="{pattern:'dashed',color:'#d4e7ed'}" />
			<view class="cu-list grid col-4 no-border item_grid_list">
				<view class="cu-item" v-for="(item, index) in finance" :key="index"
					@tap.stop="this.$util.navTo('/pages/public/not_implemented')">
					<view class="text-red">
						<image class="img" :src="item.icon" />
						<view class="cu-tag badge" v-if="item.new && item.new > 0">
							<block>{{item.new}}</block>
						</view>
					</view>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import catalog_test from '@/data/catalog_test_data.js'; //用例数据库
	export default {
		setup() {
			const affair = [{
				icon: '/static/oa_icon/notice.png',
				url: '/pages/oa/clock_in',
				title: '公告',
				new: 2,
				color: '#ff6b81'
			}, {
				icon: '/static/oa_icon/log.png',
				url: '/pages/oa/work_overtime',
				title: '工作日志',
				new: 4,
				color: '#ff6b81'
			}, {
				icon: '/static/oa_icon/clock.png',
				url: '/pages/oa/clock',
				title: '考勤',
				color: '#ff6b81'
			}, {
				icon: '/static/oa_icon/leave.png',
				url: '/pages/oa/leave',
				title: '请假',
				color: '#ff6b81'
			}, {
				icon: '/static/oa_icon/travel.png',
				url: '/pages/oa/warehouse',
				title: '出差',
				color: '#ff6b81'
			}, ];
			const logistics = [{
				icon: '/static/user_icon/repair.png',
				url: '/pages/oa/warehouse',
				title: '报修',
				color: '#ff6b81'
			}, {
				icon: '/static/user_icon/apply.png',
				url: '/pages/oa/warehouse',
				title: '申领',
				new: 15,
				color: '#ff6b81'
			}, {
				icon: '/static/user_icon/apply_for_car.png',
				url: '/pages/oa/warehouse',
				title: '用车',
				color: '#ff6b81'
			}];
			const finance = [{
				icon: '/static/user_icon/purchase.png',
				url: '/pages/oa/warehouse',
				title: '申购',
				new: 2,
				color: '#ff6b81'
			}, {
				icon: '/static/oa_icon/advance.png',
				url: '/pages/oa/warehouse',
				title: '预支',
				color: '#ff6b81'
			}, {
				icon: '/static/user_icon/reimbursement.png',
				url: '/pages/oa/go_out',
				title: '报销',
				new: 3,
				color: '#ff6b81'
			}];
			return {
				affair,
				logistics,
				finance
			}
		},
		data() {
			return {
				dataList: [],
				menus_filter: [],
				scanResult: '',
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

<style lang="scss">
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
			width: 64rpx;
			height: 64rpx;
		}

		.item_grid_list {
			padding: 20rpx 0rpx 0rpx 0rpx;
		}
	}
</style>
