<template>
	<view class="date_time" @touchmove.prevent.stop="">
		<view class="header">
			<view class="flex flex-sub justify-center align-center">
				<text class="icon-double-arrow margin-right" style="font-size: 14px;" @tap="previousYear"></text>
				<text class="cuIcon-back" @tap="previousMonth"></text>
				<text class="margin-lr-xl">{{showTitle}}</text>
				<text class="cuIcon-right" @tap="nextMonth"></text>
				<text class="icon-double-arrow margin-left" @tap="nextYear"
					style="transform:rotate(180deg);font-size: 14px;"> </text>
			</view>
			<view>
				<text class="padding-tb-xs padding-left-sm padding-right text-sm bg-orange radius"
					@tap.stop="toDay">今天</text>
			</view>
		</view>
		<view class="weeks text-sm padding-lr-xxl text-center">
			<block v-for="(week,index) in weeks" :key="week">
				<text class="flex-sub">{{week}}</text>
			</block>
		</view>
		<view class="calendars">
			<view class="background-month">{{calendar.month+1 < 10 ? "0"+(calendar.month+1) : (calendar.month+1)}}
			</view>
			<block v-for="row in 6" :key="row">
				<view class="flex text-bold padding-lr-xxl response" style="height:45px;">
					<block v-for="(day,index) in rows(row)" :key="row + ':' + index">
						<view class="flex flex-sub align-center flex-direction text-df " :class="{'section': day.status === 'withinTheInterval',
										'start':day.status === 'start',
										'end':day.status === 'end',
										'coincide':day.status === 'coincide',
										'bg-olive radius':day.status ==='current'
										}" @tap.stop="clickDate(day)">
							<text :class="{'text-grey': day.status === 'prepose'||day.status === 'next'}"
								class="value">{{day.day}}</text>
							<text :class="{'text-white text-xs': day.status === 'start'}" v-if="day.status === 'start'"
								class="prompt">{{startPrompt}}</text>
							<text :class="{'text-white text-xs': day.status === 'end'}" v-else-if="day.status === 'end'"
								class="prompt">{{endPrompt}}</text>
							<text :class="{'text-white text-xs': day.status === 'coincide'}"
								v-else-if="day.status === 'coincide'"
								class="prompt">{{startPrompt + "/" + endPrompt}}</text>
							<text v-else
								:class="{'text-grey': day.status === 'prepose'||day.status === 'next','text-red':day.lunar.lunarFestival||day.lunar.festival||day.lunar.Term}"
								class="prompt text-xs">{{day.lunar.lunarFestival||day.lunar.festival||day.lunar.Term||(day.lunar.IDayCn==='初一'?day.lunar.IMonthCn:day.lunar.IDayCn)}}</text>
						</view>
					</block>
				</view>
			</block>
		</view>
		<view class="response text-center flex padding solid-bottom text-df">
			<text>{{range.start.getFullYear()+'-'+formatNum(range.start.getMonth()+1)+'-'+formatNum(range.start.getDate())}}
				{{formatNum(range.start.getHours())+':'+formatNum(range.start.getMinutes())+':'+formatNum(range.start.getSeconds())}}</text><text
				class="flex-sub">——</text><text>{{range.end.getFullYear()+'-'+formatNum(range.end.getMonth()+1)+'-'+formatNum(range.end.getDate())}}
				{{formatNum(range.end.getHours())+':'+formatNum(range.end.getMinutes())+':'+formatNum(range.end.getSeconds())}}</text>
		</view>
		<view class="time" v-if="false">
			<picker-view class="d-picker-view" :indicator-style="itemHeight" :value="timeVal" @change="timeChange">
				<picker-view-column>
					<view class="dateItem" v-for="(item,index) in time.hours" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="dateItem" v-for="(item,index) in time.minutes " :key="index">{{item}}分</view>
				</picker-view-column>
				<picker-view-column>
					<view class="dateItem" v-for="(item,index) in time.seconds" :key="index">{{item}}秒</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="flex justify-center margin-tb-sm">
			<button class="cu-btn lg radius shadow bg-black basis-xl" @tap.stop="confirm">
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
	import lunar from '@/uni_modules/hoprxi-common/js_sdk/calendar.js';
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
			const current = new Date();
			const formatNum = (n) => {
				return (Number(n) < 10 ? '0' + Number(n) : Number(n) + '');
			};
			const setLastTime = (date) => {
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
				return date;
			}
			const time = computed(() => {
				let hours = [],
					minutes = [],
					seconds = [];
				for (let i = 0; i <= 23; i++) hours.push(formatNum(i));
				for (let j = 0; j <= 59; j++) {
					minutes.push(formatNum(j));
					seconds.push(formatNum(j));
				}
				return {
					hours,
					minutes,
					seconds
				}
			});
			const calendar = reactive({
				year: current.getFullYear(),
				month: current.getMonth(),
				days: []
			});
			const showTitle = computed(() => {
				return calendar.year + '年' + (calendar.month + 1) + "月";
			});
			const previousYear = () => {
				if (calendar.year > 1970) calculate(new Date(calendar.year - 1, calendar.month, 1));
			};
			const previousMonth = () => {
				if (calendar.year > 1970 && calendar.month >= 0) calculate(new Date(calendar.year, calendar.month - 1,
					1));
			};
			const nextMonth = () => {
				if (calendar.year < 2099)
					if (calendar.month === 11) calculate(new Date(calendar.year + 1, 0, 1));
					else calculate(new Date(calendar.year, calendar.month + 1, 1));
			};
			const nextYear = () => {
				if (calendar.year < 2099) calculate(new Date(calendar.year + 1, calendar.month, 1));
			};
			const toDay = () => {
				calculate(new Date(current.getFullYear(), current.getMonth(), current.getDate()));
			};
			const rows = computed(() => (row) => {
				return calendar.days.slice((row - 1) * 7, row * 7);
			});
			const timeVal = reactive([]);
			const timeChange = (e) => {
				let arr = [...e.detail.value];
				console.log(arr);
			}
			const range = reactive({
				start: props.start ? new Date(props.start) : current,
				end: props.end ? setLastTime(new Date(props.end)) : setLastTime(current)
			});
			const confirm = () => {
				console.log({
					start: range.start,
					end: range.end
				});
				content.emit("confirm", {
					start: range.start,
					end: range.end
				});
			};
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
					12: 31
				};
				const now = date ? date : current;
				const year = now.getFullYear();
				if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
					months[2] = 29;
				}
				calendar.year = year;
				const month = now.getMonth() + 1; //使用1-12月,用于匹配months对象
				calendar.month = now.getMonth(); //使用0-11月	
				calendar.days = [];
				//let firstDay = new Date(`${year}/${calendar.month}/1 00:00:00`);
				let firstDay = new Date(year, now.getMonth(), 1);
				const week = firstDay.getDay();
				if (week != 0) {
					for (let i = week - 1; i >= 0; i--) {
						//console.log("lunar")
						//console.log(year, month - 1, month - 1 == 0 ? months[12] - i : months[month - 1] - i)
						calendar.days.push({
							day: month - 1 == 0 ? months[12] - i : months[month - 1] - i,
							status: 'prepose',
							lunar: lunar.solar2lunar(year, month - 1, month - 1 == 0 ? months[12] - i : months[
								month - 1] - i) //使用1-12月
						})
					}
				}
				for (let i = 1; i <= months[month]; i++) {
					calendar.days.push({
						day: i,
						status: setStatus(year, month - 1, i),
						lunar: lunar.solar2lunar(year, month, i)
					})
				}
				for (let i = 1, j = 43 - calendar.days.length; i < j; i++) {
					calendar.days.push({
						day: i,
						status: 'next',
						lunar: lunar.solar2lunar(year, month + 1, i)
					})
				}
			};
			const setStatus = (year, month, day) => {
				const start = props.start ? new Date(props.start) : null;
				const end = props.end ? new Date(props.end) : null;
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
			const clickDate = (day) => {
				if (day.status === 'prepose') console.log(new Date(calendar.year, calendar.month - 1, day.day));
				else if (day.status === 'next') console.log(new Date(calendar.year, calendar.month + 1, day.day));
				else range.start = new Date(calendar.year + '-' + calendar.month + '-' + day.day)
				console.log(range);
			};
			onBeforeMount(() => {
				calculate();
			});
			return {
				weeks,
				time,
				formatNum,
				range,
				calendar,
				showTitle,
				previousYear,
				previousMonth,
				nextMonth,
				nextYear,
				toDay,
				rows,
				clickDate,
				timeVal,
				timeChange,
				confirm
			}
		}
	}
</script>
<style lang="scss">
	.date_time {
		width: 100vw;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-top: 1px solid #aaaaaa;
		position: absolute;
		bottom: 1px;

		.header {
			display: flex;
			line-height: 44px;
			text-size: 16px;
		}

		.weeks {
			display: flex;
			justify-content: center;
			padding: 0 8px 8px 8px;
			flex-wrap: nowrap;
			border-bottom: 1px solid #aaaaaa;
			margin-bottom: 2px;
		}

		.calendars {
			display: flex;
			flex-direction: column;
			align-items: center;
			border-bottom: 1px solid #aaaaaa;
			padding: 0 6px;

			.background-month {
				position: absolute;
				font-size: 220px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.1);
			}

			.value {
				display: flex;
				position: relative;
				top: calc(50% - 13.5px);
			}

			.prompt {
				display: flex;
				position: relative;
				top: calc(50% - 14px);
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

		.time {
			position: absolute;
			display: inline-block;
			vertical-align: middle;
			margin-left: auto;
			margin-right: auto;
			width: 95%;
			height: 238px;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 1);
			z-index: 3;

			.d-picker-view {
				height: 100%;
			}

			.dateItem {
				text-align: center;
				width: 100%;
				height: 44px;
				line-height: 44px;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 15px;
			}
		}
	}
</style>