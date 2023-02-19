<template>
	<picker-view indicator-style="height:44px" :value="initialIndex" @change="change">
		<picker-view-column>
			<view v-for="(province,index) in provinces" :key="province.code">{{province.name}}</view>
		</picker-view-column>
		<picker-view-column>
			<view v-for="(city,index) in cities" :key="city.code">{{city.name}}</view>
		</picker-view-column>
		<picker-view-column v-if="level === 'county'">
			<view v-for="(county,index) in counties" :key="county.code">{{county.name}}</view>
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
			let provinces = reactive([]);
			const cities = reactive([]);
			const counties = reactive([]);
			const initialIndex = reactive([]);
			const oldSelectedIndex = reactive([]);
			const query = (code) => {
				return new Promise(resolve => {
					let areas = [];
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
						return resolve(areas);
					}).catch(err => {})
				});
			};
			const change = (e) => {
				let selected = [];
				let index = [...e.detail.value]
				console.log(index);
				console.log('old')
				console.log(oldSelectedIndex);
				if (index[0] != oldSelectedIndex[0]) {
					new Promise(resolve => {
						resolve(query(provinces[index[0]].code))
					}).then(areas => {
						cities.length = 0;
						for (const area of areas) cities.push(area);
						initialIndex.splice(1, 1, 0);
						oldSelectedIndex.splice(1, 1, 0)
						return new Promise(resolve => {
							resolve(query(cities[index[0]].code))
						});
					}).then(areas => {
						counties.length = 0;
						for (const area of areas) counties.push(area);
						setTimeout(() => {
							initialIndex.splice(2, 1, 0);
							oldSelectedIndex.splice(2, 1, 0)
						}, 0)
						console.log(initialIndex);
					});
					oldSelectedIndex[0] = index[0];
				}
				if (index[1] != oldSelectedIndex[1]) {
					oldSelectedIndex[1] = index[1];
				}
				if (index[2] != oldSelectedIndex[2]) {
					oldSelectedIndex[2] = index[2];
				}
				/*
				selected[0] = {
					code: provinces[index[0]].code,
					name: provinces[index[0]].name
				}
				selected[1] = {
					code: cities[index[1]].code,
					name: cities[index[1]].name
				}
				
				if (props.level === 'county') {
					selected[2] = {
						code: provinces[index[0]].children[index[1]].children[index[2]].code,
						name: provinces[index[0]].children[index[1]].children[index[2]].name
					}
				}
				*/
				content.emit('selected', selected);
			};
			onBeforeMount(() => {
				new Promise(resolve => {
					ajax({
						url: 'https://hoprxi.tooo.top/area/v1/areas/:code/juri',
						params: {
							code: 156
						},
					}).then(res => {
						for (const a of res.data.areas) {
							provinces.push({
								code: a.code,
								name: a.name.name,
								parentName: a.parent.name
							})
						};
						resolve(provinces);
					})
				}).then((provinces) => {
					let provinceIndex = provinces.findIndex((p) => {
						return p.name === props.initialArea[0];
					})
					initialIndex.push(provinceIndex);
					return new Promise(resolve => {
						resolve(query(provinces[provinceIndex].code))
					});
				}).then((areas) => {
					for (const area of areas) cities.push(area);
					let cityIndex = cities.findIndex((c) => {
						return c.name === props.initialArea[1];
					});
					initialIndex.push(cityIndex);
					return new Promise(resolve => {
						resolve(query(cities[cityIndex].code))
					});
				}).then((areas) => {
					for (const area of areas) counties.push(area);
					let countyIndex = counties.findIndex((c) => {
						return c.name === props.initialArea[2];
					});
					setTimeout(() => { //奇怪的写法，必须要延迟，picker-view中的value才起作用
						initialIndex.push(countyIndex);
						for (const index of initialIndex) oldSelectedIndex.push(index)
					}, 0)
				});
			});
			/*
			watch(provinces, () => {
				setTimeout(() => { 
					let provinceIndex = provinces.findIndex((p) => {
						return p.name === props.initialArea[0];
					})
					//console.log(provinceIndex)
					initialIndex.splice(0, 0, provinceIndex);
					jurisdictionQuery(cities, provinces[provinceIndex].code);
					let cityIndex = cities.findIndex((c) => {
						return c.name === props.initialArea[1];
					})
					initialIndex.splice(1, 0, cityIndex);
					console.log(initialIndex);
					counties.length = 0;
					jurisdictionQuery(counties, cities[cityIndex].code);
				}, 0)
			});
			*/
			return {
				provinces,
				cities,
				counties,
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
		font-size: 15px;
	}
</style>
