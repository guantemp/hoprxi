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
			<view>
				<text class="padding-tb-xs padding-left-sm padding-right text-sm bg-orange radius"
					@tap.stop="showTitle">今天</text>
			</view>
		</view>
		<view class="weeks text-sm padding-lr-xxl text-center">
			<block v-for="(week,index) in weeks" :key="week">
				<text class="flex-sub">{{week}}</text>
			</block>
		</view>
		<view class="calendars">
			<view class="background-month">{{calendar.month < 10 ? "0"+calendar.month : calendar.month}}</view>
			<block v-for="row in 6" :key="row">
				<view class="flex text-bold padding-lr-xxl response" style="height:45px;font-size: 14px;">
					<block v-for="(day,index) in rows(row)" :key="row + ':' + index">
						<view class="flex flex-sub align-center flex-direction " :class="{'section': day.status === 'withinTheInterval',
										'start':day.status === 'start',
										'end':day.status === 'end',
										'coincide':day.status === 'coincide',
										'bg-olive radius':day.status ==='current' && day.status !== 'disable'
										}" @tap.stop="clickDate">
							<text :class="{'text-grey': day.status === 'disable'}" class="value">{{day.value}}</text>
							<text style="font-size: 10px;" :class="{'text-white': day.status === 'start'}"
								v-if="day.status === 'start'" class="prompt">{{startPrompt}}</text>
							<text style="font-size: 10px;" :class="{'text-white': day.status === 'end'}"
								v-if="day.status === 'end'" class="prompt">{{endPrompt}}</text>
							<text style="font-size: 10px;" :class="{'text-white': day.status === 'coincide'}"
								v-if="day.status === 'coincide'" class="prompt">{{startPrompt + "/" + endPrompt}}</text>
						</view>
					</block>
				</view>
			</block>
		</view>
		<view class="response text-center flex padding solid-bottom" style="font-size: 14px;">
			<text>2023-04-01 11:59:59</text><text class="flex-sub cuIcon-back_android"></text><text>2023-04-30
				23:59:59</text>
		</view>
		<view class="flex justify-center margin-tb-sm">
			<button class="cu-btn lg radius shadow bg-black basis-xl"
				@tap.stop="$util.navTo('/pages/workflow/price/price_adjustment_add?sign=add')">
				确认选择</button>
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
			startPrompt: {
				type: String,
				default: '开始'
			},
			end: String,
			endPrompt: {
				type: String,
				default: '结束'
			}
		},
		setup(props, content) {
			const weeks = ['日', '一', '二', '三', '四', '五', '六'];
			const start = props.start ? new Date(props.start) : null;
			const end = props.end ? new Date(props.end) : null;
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
				return calendar.days.slice((row - 1) * 7, row * 7);
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
				const now = date ? new Date(date) : current;
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
							status: 'prepose',
						})
					}
				}
				for (let i = 1; i <= months[month]; i++) {
					calendar.days.push({
						value: i,
						status: setStatus(year, month - 1, i)
					})
				}
				for (let i = 0, j = 42 - calendar.days.length; i < j; i++) {
					calendar.days.push({
						value: i + 1,
						status: "next",
					})
				}
				console.log(calendar)
			};
			const setStatus = (year, month, day) => {
				const value = new Date(year, month, day);
				if (value.getFullYear() == current.getFullYear() && value.getMonth() == current.getMonth() && value
					.getDate() == current.getDate()) return 'current';
				if (start != null && end != null && value.getTime() == start.getTime() && value.getTime() == end
					.getTime()) return 'coincide';
				if (start != null && start.getTime() == value.getTime()) return 'start';
				if (end != null && end.getTime() == value.getTime()) return 'end';
				if (start != null && end != null && value.getTime() > start.getTime() && value.getTime() < end
					.getTime()) return 'withinTheInterval';
				return 'normal';
			};
			const clickDate = () => {};
			onBeforeMount(() => {
				calculate();
			});
			return {
				weeks,
				calendar,
				current,
				showTitle,
				rows,
				clickDate
			}
		}
	}
</script>
<style lang="scss">
	.date_time {
		display: flex;
		width: 100vw;
		flex-direction: column;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-top: 1px solid #aaaaaa;
		position: absolute;
		bottom: 2px;

		.header {
			display: flex;
			line-height: 44px;
			text-size: 16px
		}

		.weeks {
			display: flex;
			justify-content: center;
			padding: 0 10px 10px 10px;
			flex-wrap: nowrap;
			border-bottom: 1px solid #aaaaaa;
			margin-bottom: 2px;
		}

		.calendars {
			display: flex;
			position: relative;
			flex-direction: column;
			align-items: center;
			border-bottom: 1px solid #aaaaaa;
			padding: 0 10px;


			.background-month {
				position: absolute;
				text-align: center;
				font-size: 220px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.1);
			}

			.dot {
				display: inline-block;
				position: absolute;
				margin-top: 6px;
				text-align: center;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background: #0081ff;
			}

			.value {
				display: flex;
				position: relative;
				top: calc(50% - 12px);
			}

			.prompt {
				display: flex;
				position: relative;
				top: calc(50% - 13px);
			}

			.start {
				background: #444444;
				border-radius: 5px 0 0 5px;
				color: #ffffff;
			}

			.section {
				background: rgba(0, 0, 0, 0.2);
				color: #ffffff;
			}

			.end {
				background: #444444;
				border-radius: 0 5px 5px 0;
				color: #ffffff;
			}

			.coincide {
				background: #444444;
				border-radius: 5px;
				color: #ffffff;
			}
		}
	}
</style>