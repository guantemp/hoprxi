<template>
	<view class="date_time" @touchmove.prevent.stop="">
		<view class="cuIcon-close"></view>
		<view class="header">
			<view>
				<text class="padding-tb-xs padding-left-sm padding-right text-sm bg-orange radius"
					@tap.stop="toDay">今天</text>
			</view>
			<view class="flex flex-sub justify-center align-center">
				<text class="icon-double-arrow margin-right" style="font-size: 14px;" @tap="previousYear"></text>
				<text class="cuIcon-back" @tap="previousMonth"></text>
				<text class="margin-lr-xl">{{showTitle}}</text>
				<text class="cuIcon-right" @tap="nextMonth"></text>
				<text class="icon-double-arrow margin-left" @tap="nextYear"
					style="transform:rotate(180deg);font-size: 14px;"> </text>
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
								class="prompt">{{prompt.start}}</text>
							<text :class="{'text-white text-xs': day.status === 'end'}" v-else-if="day.status === 'end'"
								class="prompt">{{prompt.start}}</text>
							<text :class="{'text-white text-xs': day.status === 'coincide'}"
								v-else-if="day.status === 'coincide'"
								class="prompt">{{prompt.start + "/" + prompt.start}}</text>
							<text v-else
								:class="{'text-grey': day.status === 'prepose'||day.status === 'next','text-red':day.lunar.lunarFestival||day.lunar.festival||day.lunar.Term}"
								class="prompt text-xs">{{day.lunar.lunarFestival||day.lunar.festival||day.lunar.Term||(day.lunar.IDayCn==='初一'?day.lunar.IMonthCn:day.lunar.IDayCn)}}</text>
						</view>
					</block>
				</view>
			</block>
		</view>
		<view class="response flex padding-top padding-bottom-xs text-df" v-if="mode==='single'">
			<view class="flex flex-sub text-center"
				:class="{'padding-lr-lg':mode==='single','padding-lr':mode==='multiple'}">
				<text>{{rangeDateShow('start')}}</text>
				<text class="margin-left-xs" @tap.stop="clickTime('start')">{{rangeTimeShow('start')}}</text>
				<text class="flex-sub cuIcon-move"></text><text>{{rangeDateShow('end')}}</text>
				<text class="margin-left-xs" @tap.stop="clickTime('end')">{{rangeTimeShow('end')}}</text>
			</view>
			<text class="cuIcon-more padding-right-sm" style="transform:translateY(5px);"
				v-if="mode === 'multiple'"></text>
		</view>
		<view class="timeMask" v-if="timeShow" @tap="clickTime"></view>
		<view class="time" v-if="timeShow">
			<view class="text-center margin-bottom-xl">选择时间</view>
			<picker-view class="time-picker-view" indicator-style="height:50px" :value="timeVal" @change="timeChange">
				<picker-view-column>
					<view class="time-picker-Item" v-for="(item,index) in time.hours" :key="index">{{item}} 时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="time-picker-Item " v-for="(item,index) in time.minutes " :key="index">{{item}} 分
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="time-picker-Item " v-for="(item,index) in time.seconds" :key="index">{{item}} 秒</view>
				</picker-view-column>
			</picker-view>
			<view class="margin-top-xl flex justify-between text-blue">
				<view><text class="cuIcon-top" @tap.stop="timeVal=[0,0,0]"></text><text
						class="icon-time-restore margin-left" @tap=""></text><text class="cuIcon-down margin-left"
						@tap.stop="timeVal=[23,59,59];"></text></view>
				<view><text @tap="timeShow=false">取消</text><text class="margin-left" @tap="timeConfirm">确定</text></view>
			</view>
		</view>
		<view class="flex justify-center margin-tb-sm" v-if="mode=='single' || mode === 'multiple'">
			<button class="cu-btn lg radius shadow bg-black basis-lg" @tap.stop="confirm">
				确认选择</button>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		reactive,
		computed,
		onBeforeMount,
		watch
	} from 'vue';
	import lunar from '@/uni_modules/hoprxi-common/js_sdk/calendar.js';
	name: 'hoprxi-dateTime-selector';
	const props = defineProps({
		tempRange: {
			type: Array[Object],
			default: []
		},
		start: String,
		end: String,
		prompt: {
			type: Object,
			default: {
				start: '开始',
				end: '结束'
			}
		},
		mode: {
			type: String,
			default: 'nothing',
			validator(value) {
				return ['single', 'multiple', 'nothing'].includes(value);
			}
		}
	});
	const emits = defineEmits(["confirm"]);
	const weeks = ['日', '一', '二', '三', '四', '五', '六'];
	const current = new Date();
	const formatNum = (n) => {
		return (Number(n) < 10 ? '0' + Number(n) : Number(n) + '');
	};
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
		if (calendar.year > 1970 && calendar.month >= 0) calculate(new Date(calendar.year, calendar.month - 1, 1));
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
		calculate(new Date());
	};
	const rows = computed(() => (row) => {
		return calendar.days.slice((row - 1) * 7, row * 7);
	});
	const timeShow = ref(false);
	let timeFlag = 'start';
	let timeTemp = [0, 0, 0];
	const timeVal = ref([]);
	const timeChange = (e) => {
		timeTemp = [...e.detail.value];
	}
	const timeConfirm = (index) => {
		timeShow.value = false;
		switch (timeFlag) {
			case 'start':
				internalRange.start = setTime(internalRange.start, timeTemp[0], timeTemp[1], timeTemp[2])
				break;
			case 'end':
				internalRange.end = setTime(internalRange.end, timeTemp[0], timeTemp[1], timeTemp[2])
				break
		}
	};
	const setTime = (d, hour, minute, second) => {
		if (d instanceof Date) {
			d.setHours(hour);
			d.setMinutes(minute);
			d.setSeconds(second);
		}
		return new Date(d.getTime());
	}
	const clickTime = (flag) => {
		timeShow.value = !timeShow.value;
		timeFlag = flag;
		switch (timeFlag) {
			case 'start':
				timeVal.value = [internalRange.start.getHours(), internalRange.start.getMinutes(),
					internalRange.start.getSeconds()
				];
				break;
			case 'end':
				timeVal.value = [internalRange.end.getHours(), internalRange.end.getMinutes(), internalRange.end
					.getSeconds()
				];
				break
		}
	};
	const internalRange = reactive([]);
	const rangeDateShow = computed(() => (flag) => {
		switch (flag) {
			case 'start':
				if (internalRange.length != 0 && internalRange[0].start != null) return internalRange[0].start
					.getFullYear() + '-' + formatNum(internalRange[0].start.getMonth() + 1) + '-' + formatNum(
						internalRange[0].start.getDate());
				else return props.prompt.start + '日期';
				break;
			case 'end':
				if (internalRange.length != 0 && internalRange[0].end != null) return internalRange[0].end
					.getFullYear() + '-' + formatNum(internalRange[0].end.getMonth() + 1) + '-' + formatNum(
						internalRange[0].end.getDate());
				else return props.prompt.end + '日期';
				break;
		}
	});
	const rangeTimeShow = computed(() => (flag) => {
		switch (flag) {
			case 'start':
				if (internalRange.length === 0) {
					const temp = setTime(current, 0, 0, 0);
					return formatNum(temp.getHours()) + ':' + formatNum(temp.getMinutes()) + ':' + formatNum(temp
						.getSeconds());
				} else {
					return formatNum(internalRange[0].start.getHours()) + ':' + formatNum(internalRange[0].start
						.getMinutes()) + ':' + formatNum(internalRange[0].start.getSeconds())
				}
				break;
			case 'end':
				if (internalRange.length === 0 || internalRange[0].end == null) {
					const temp = setTime(current, 23, 59, 59);
					return formatNum(temp.getHours()) + ':' + formatNum(temp.getMinutes()) + ':' + formatNum(temp
						.getSeconds());
				} else {
					return formatNum(internalRange[0].end.getHours()) + ':' + formatNum(internalRange[0].end
						.getMinutes()) + ':' + formatNum(internalRange[0].end.getSeconds())
					break;
				}
		}
	});
	const confirm = () => {
		emits("confirm", internalRange);
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
					lunar: lunar.solar2lunar(year, month - 1, month - 1 == 0 ? months[12] - i : months[month -
						1] - i) //使用1-12月
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
		const value = new Date(year, month, day);
		const orientRange = orient(value)
		const start = orientRange.start ? new Date(orientRange.start) : null;
		const end = orientRange.end ? new Date(orientRange.end) : null;
		if (value.getFullYear() == current.getFullYear() && value.getMonth() == current.getMonth() && value
		.getDate() == current.getDate()) return 'current';
		if (start != null && end != null && value.getTime() == start.getTime() && value.getTime() == end.getTime())
			return 'coincide';
		if (start != null && start.getTime() == value.getTime()) return 'start';
		if (end != null && end.getTime() == value.getTime()) return 'end';
		if (start != null && end != null && value.getTime() > start.getTime() && value.getTime() < end.getTime())
			return 'withinTheInterval';
		return 'normal';
	};
	const orient = (d) => {
		if (d instanceof Date) {
			for (const r of internalRange) {
				if (r.start != null && d.getTime() >= r.start.getTime() && r.end != null && d.getTime() <= r.end
					.getTime()) return r;
			}
		}
		return {
			start: null,
			end: null
		}
	};
	const clickDate = (day) => {
		const signle = (date) => {
			if (internalRange.length == 0) {
				internalRange[0] = {
					start: date,
					end: null
				};
			} else {
				if (internalRange[0].start != null && internalRange[0].end == null) {}
			}
		};
		if (day.status === 'prepose') console.log(new Date(calendar.year, calendar.month - 1, day.day));
		else if (day.status === 'next') console.log(new Date(calendar.year, calendar.month + 1, day.day));
		else {
			switch (props.mode) {
				case 'single':
					signle(new Date(calendar.year, calendar.month, day.day));
					break;
			}
		}
		//calculate(new Date(calendar.year, calendar.month, day.day));
		//console.log(internalRange);
	};
	const init = () => {
		for (let i = 0; i < props.tempRange.length; i++) {
			internalRange[i] = {
				start: props.tempRange[i].start ? new Date(props.tempRange[i].start) : null,
				end: props.tempRange[i].end ? setTime(new Date(props.tempRange[i].end), 23, 59, 59) : null
			}
		}
	};
	onBeforeMount(() => {
		init();
		calculate();
		//console.log(internalRange)
	});
	watch(timeVal, () => {
		timeTemp = timeVal.value;
	});
	/*
	watch(() => props.tempRange, () => {
		
	}, {
		deep: true //非常重要，没有它area数组不会被watch到
	});
	*/
</script>
<style lang="scss">
	.date_time {
		width: 100vw;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-top: 1px solid #aaaaaa;
		position: fixed;
		//bottom: 1px;

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

		.timeMask {
			position: fixed;
			bottom: 0px;
			top: 0px;
			left: 0px;
			right: 0px;
			background-color: rgba(0, 0, 0, 0.4);
			transition-duration: 0.3s;
			z-index: 2;
		}

		.time {
			position: absolute;
			width: 85%;
			border-radius: 8px;
			padding: 15px 35px;
			background-color: #fff;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			transition-duration: 0.3s;
			z-index: 3;


			.time-picker-view {
				height: 130px;
			}

			.time-picker-Item {
				text-align: center;
				line-height: 50px;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 15px;
			}
		}
	}
</style>