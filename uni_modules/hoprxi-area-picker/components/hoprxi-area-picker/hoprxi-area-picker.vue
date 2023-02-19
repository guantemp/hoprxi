<template>
	<picker-view indicator-style="height:44px" :value="initialIndex" @change="change">
		<picker-view-column>
			<view v-for="(province,index) in provinces" :key="province.code">{{province.name}}</view>
		</picker-view-column>
		<picker-view-column>
			<view v-for="(city,index) in cities" :key="city.code">{{city.name}}</view>
		</picker-view-column>
		<picker-view-column v-if="level === 'county'">
			<view v-for="(county,index) in provinces" :key="index">{{county.name}}</view>
		</picker-view-column>
	</picker-view>
</template>
<script>
	import {
		ref,
		reactive,
		watch,
		computed,
		onBeforeMount,
		onMounted
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	export default {
		name: 'hoprxi-area-picker',
		props: {
			initialArea: [Array, String],
			level: {
				type: String,
				default: 'county',
				validator(value) {
					return value === 'county' || value === 'city'
				}
			},
		},
		setup(props, content) {
			const provinces = reactive([]);
			const cities = reactive([]);
			const initialIndex = reactive([]);
			const oldSelectedIndex = reactive([]);
			const jurisdictionQuery = (areas = [], code) => {
				ajax({
					url: 'https://hoprxi.tooo.top/area/v1/areas/:code/juri',
					params: {
						code: code
					},
				}).then(res => {
					for (const a of res.data.areas) {
						areas.push({
							code: a.code,
							name: a.name.name,
							parentName: a.parent.name
						})
					};
				}).catch(err => {})
			};
			const change = (e) => {
				let selected = [];
				let index = [...e.detail.value]
				if (index[0] != oldSelectedIndex[0]) {
					cities.length = 0;
					jurisdictionQuery(cities, provinces[index[0]].code);
					oldSelectedIndex[0] = index[0];
				}
				selected[0] = {
					code: provinces[index[0]].code,
					name: provinces[index[0]].name
				}
				selected[1] = {
					code: provinces[index[1]].code,
					name: provinces[index[1]].name
				}
				if (props.level === 'county') {
					selected[2] = {
						code: provinces[index[0]].children[index[1]].children[index[2]].code,
						name: provinces[index[0]].children[index[1]].children[index[2]].name
					}
				}
				content.emit('selected', selected);
				console.log(selected);
			};
			onBeforeMount(() => {
				jurisdictionQuery(provinces, 156);
				/*
				selectedIndex.push(areas.findIndex((a) => {
					return a.name === props.initialArea[0];
				}));
				let citys = jurisdictionQuery(areas[selectedIndex[0]].code);
				areas[selectedIndex[0]] = {
					...areas[selectedIndex[0]],
					children: citys
				};
				console.log(areas[selectedIndex[0]].children);
				*/
			});
			onMounted(() => {
				setTimeout(() => { //奇怪的写法，必须要延迟，picker-view中的value才起作用
					let cityIndex = cities.findIndex((c) => {
						return c.name === props.initialArea[1];
					})
					console.log('c'+cityIndex)
					initialIndex.splice(1,0,cityIndex);
				}, 0)
			});
			watch(provinces, () => {
				setTimeout(() => { //奇怪的写法，必须要延迟，picker-view中的value才起作用
					let provinceIndex = provinces.findIndex((p) => {
						return p.name === props.initialArea[0];
					})
					console.log(provinceIndex)
					initialIndex.splice(0,0,provinceIndex);
					jurisdictionQuery(cities, provinces[provinceIndex].code);
				}, 0)
			});
			return {
				provinces,
				cities,
				initialIndex,
				change
			}
		},
	}
</script>
<style lang="scss">
	picker-view {
		height: 476rpx;
		overflow: hidden;
		background-color: rgba(155, 255, 255, 1);
	}

	picker-view-column view {
		text-align: center;
		width: 100%;
		height: 44px;
		line-height: 44px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}
</style>
