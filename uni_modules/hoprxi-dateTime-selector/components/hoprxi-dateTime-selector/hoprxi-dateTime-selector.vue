<template>
	<view class="date_time" @touchmove.prevent.stop="">
		<view class="header">
			<view class="flex flex-sub justify-center align-center">
				<text class="cuIcon-back margin-right" @tap.stop="previousYear"><text class="cuIcon-back"></text></text>
				<text class="cuIcon-back" @tap="previousMonth"></text>
				<text class="margin-lr-sm">{{showTitle}}</text>
				<text class="cuIcon-right" @tap="nextMonth"></text>
				<text class="cuIcon-right margin-left" @tap="nextYear"> <text class="cuIcon-right"></text></text>
			</view>
			<view class="padding-right-xs">
				<text class="padding-xs text-sm bg-grey radius" @tap.stop="showTitle">回到今天</text>
			</view>
		</view>
		<view class="weeks text-grey text-sm">
			<block v-for="(week,index) in weeks" :key="index">
				<text>{{week}}</text>
			</block>
		</view>
		<!--
		<block v-for="row in 6">
			<view class="weeks text-grey text-sm">
				<block v-for="(day,index) in rows(row)" :key="index">
					<text>{{day.value}}</text>
				</block>
			</view>
		</block>
		-->
		<view class="calendars">
			<view class="bg">{{calendar.month < 10 ? "0"+calendar.month : calendar.month}}</view>
			<block v-for="(day,index) in calendar.days" :key="index">
				<view class="day" :class="{
							'other':day.status === 3 || day.status === 4 || day.status === 9,
							'has':day.status === 6,
							'active':day.status === 1,
							'equal':day.status === 8,
							'start':day.status === 5,
							'end':day.status === 7,
							'disabled':day.status === 'disable',
							'click':day.status !== 2 && day.status !== 9
						}" @click="selDate(day)">
					<view class="day-dot">
						<view v-if="current.getDate() === day.value" class="now"></view>
					</view>
					<view class="list">{{day.value}}</view>
					<view class="prompt" v-if="day.status === 'start'">{{startPrompt || "开始"}}</view>
					<view class="prompt" v-if="day.status === 'end'">{{endPrompt || "结束"}}</view>
					<view class="prompt" v-if="day.status === 'same'">
						{{(startPrompt || "开始") + "/" + (endPrompt || "结束")}}
					</view>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	import {
		reactive,
		computed,
		onBeforeMount
	} from 'vue';
	export default {
		name: 'hoprxi-dateTime-selector',
		props: {
			start: String,
			startPrompt: "开始",
			end: String,
			endPrompt: "结束",
		},
		setup(props, content) {
			const weeks = ['日', '一', '二', '三', '四', '五', '六'];
			const current = new Date();
			const calendar = reactive({
				year: 1970,
				month: 1,
				days: []
			});
			const showTitle = computed(() => {
				return calendar.year + '年' + calendar.month + "月";
			});
			const rows = computed(() => (row) => {
				return calendar.days.slice(row * 7, (row + 1) * 7);
			});
			const calculate = (date) => {
				const months = {
					1: 31,
					2: 28,
					3: 31,
					4: 30,
					5: 31,
					6: 30,
					7: 31,
					8: 31,
					9: 30,
					10: 31,
					11: 30,
					12: 30
				};
				const now = date ? new Date(date) : new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1;
				calendar.year = year;
				calendar.month = month;
				if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
					months[2] = 29;
				}
				let firstDay = new Date(`${year}/${month}/1 00:00:00`);
				const week = firstDay.getDay();
				if (week != 0) {
					for (let i = week - 1; i >= 0; i--) {
						calendar.days.push({
							value: months[month - 1] - i,
							status: 'disable'
						})
					}
				}
				for (let i = 1; i <= months[month]; i++) {
					calendar.days.push({
						value: i,
						status: setStatus()
					})
				}
				for (let i = 0, j = 42 - calendar.days.length; i < j; i++) {
					calendar.days.push({
						value: i + 1,
						status: "disable"
					})
				}
				console.log(calendar)
			};
			const setStatus = () => {
				return 'normal';
			};
			onBeforeMount(() => {
				calculate();
			});
			return {
				weeks,
				calendar,
				current,
				showTitle,
				rows
			}
		}
	}
</script>
<style lang="scss">
	.date_time {
		display: flex;
		flex-direction: column;
		width: 100vw;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border: 1px solid #aaaaaa;

		.header {
			display: flex;
			line-height: 44px;
			text-size: 16px
		}

		.weeks {
			width: 100%;
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-around;
			text-size: 13px;
			border-bottom: 1px solid #aaaaaa;
			padding-bottom: 10px;
		}

		.calendars {
			position: relative;
			width: 100%;
			height: 300px;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			box-sizing: border-box;

			.bg {
				position: absolute;
				left: 0;
				top: -90rpx;
				width: 100%;
				text-align: center;
				font-size: 200px;
				line-height: 345px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.1);
			}

			.day {
				position: relative;
				height: 50px;
				width: 53px;
				text-align: center;
				transition: all 0.3s;

				.day-dot {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					width: 47px;
					height: 17.5px;

					.now {
						width: 12rpx;
						height: 12rpx;
						border-radius: 6rpx;
						background: #181D2D;
					}
				}

				.list {
					color: #181D2D;
					line-height: 15px;
					font-size: 12px;
					font-weight: bold;
				}

				.prompt {
					width: 47px;
					height: 17.5px;
					line-height: 17.5px;
					text-align: center;
					font-size: 10px;
					color: #ffffff;
				}

				&.disabled {
					background: rgba(255, 0, 0, 0.1);
					font-weight: normal;
					color: #aaaaaa;
				}
			}
		}
	}
</style>