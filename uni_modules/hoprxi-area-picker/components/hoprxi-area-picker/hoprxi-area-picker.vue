<template>
	<picker-view indicator-style="height:44px" :value="initialIndex" @change="change">
		<picker-view-column>
			<view v-for="(province,index) in provinces" :key="index">{{province.name}}</view>
		</picker-view-column>
		<picker-view-column>
			<view v-for="(city,index) in cities" :key="index">{{city.name}}</view>
		</picker-view-column>
		<picker-view-column v-if="showCounty">
			<view v-for="(county,index) in counties" :key="index">{{county.name}}</view>
		</picker-view-column>
	</picker-view>
</template>
<script>
	import {
		reactive,
		watch,
		onBeforeMount
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	export default {
		name: 'hoprxi-area-picker',
		props: {
			initialArea: {
				type: [Array, String],
				default: []
			},
			showCounty: {
				type: Boolean,
				default: true
			}
		},
		setup(props, content) {
			let provinces = reactive([]);
			const cities = reactive([]);
			const counties = reactive([]);
			const initialIndex = reactive([]);
			const oldSelectedIndex = reactive([]);
			const selected = [];
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
				let index = [...e.detail.value]
				selected.splice(0, 1, {
					code: provinces[index[0]].code,
					name: provinces[index[0]].name,
					parentName: provinces[index[0]].parentName,
				});
				selected.splice(1, 1, {
					code: cities[index[1]].code,
					name: cities[index[1]].name,
					parentName: cities[index[1]].parentName,
				});
				if (props.showCounty) {
					selected.splice(2, 1, {
						code: counties[index[2]].code,
						name: counties[index[2]].name,
						parentName: counties[index[2]].parentName,
					})
				}
				if (index[0] != oldSelectedIndex[0]) {
					new Promise(resolve => {
						initialIndex.splice(0, 1, index[0]);
						oldSelectedIndex.splice(0, 1, index[0]);
						resolve(query(provinces[index[0]].code))
					}).then(areas => {
						cities.length = 0;
						for (const area of areas) cities.push(area);
						initialIndex.splice(1, 1, 0);
						oldSelectedIndex.splice(1, 1, 0);
						selected.splice(1, 1, {
							code: cities[0].code,
							name: cities[0].name,
							parentName: cities[0].parentName,
						});
						return new Promise(resolve => {
							resolve(query(cities[0].code))
						});
					}).then(areas => {
						counties.length = 0;
						for (const area of areas) counties.push(area);
						setTimeout(() => { //奇怪的写法，没有promise,必须要延迟，picker-view中的value才起作用
							initialIndex.splice(2, 1, 0);
							oldSelectedIndex.splice(2, 1, 0);
						}, 0);
						if (props.showCounty) {
							selected.splice(2, 1, {
								code: counties[0].code,
								name: counties[0].name,
								parentName: counties[0].parentName,
							})
						}
					});
				}
				if (index[1] != oldSelectedIndex[1]) {
					new Promise(resolve => {
						initialIndex.splice(1, 1, index[1]);
						oldSelectedIndex.splice(1, 1, index[1]);
						resolve(query(cities[index[1]].code))
					}).then(areas => {
						counties.length = 0;
						for (const area of areas) counties.push(area);
						initialIndex.splice(2, 1, 0);
						oldSelectedIndex.splice(2, 1, 0);
						if (props.showCounty) {
							selected[2] = {
								code: counties[0].code,
								name: counties[0].name
							}
						}
					});
				}
				if (index[2] != oldSelectedIndex[2]) {
					oldSelectedIndex[2] = index[2];
				}
				content.emit('selected', selected);
			};
			const _first = () => {
				new Promise(resolve => {
					resolve(query(156));
				}).then((areas) => {
					for (const province of areas) provinces.push(province);
					let provinceIndex = provinces.findIndex((p) => {
						return p.name === props.initialArea[0];
					})
					if (provinceIndex === -1) provinceIndex = 0;
					initialIndex.push(provinceIndex);
					selected.push({
						code: provinces[provinceIndex].code,
						name: provinces[provinceIndex].name,
						parentName: provinces[provinceIndex].parentName,
					});
					return new Promise(resolve => {
						resolve(query(provinces[provinceIndex]['code'])) //[]取属性
					});
				}).then((areas) => {
					cities.length = 0;
					for (const city of areas) cities.push(city);
					let cityIndex = cities.findIndex((c) => {
						return c.name === props.initialArea[1];
					});
					if (cityIndex === -1) cityIndex = 0;
					setTimeout(() => {
						initialIndex.push(cityIndex);
						selected.push({
							code: cities[cityIndex].code,
							name: cities[cityIndex].name,
							parentName: cities[cityIndex].parentName,
						});
					}, 0);
				})
			};
			const init = () => {
				selected.length = 0;
				initialIndex.length = 0
				_first();
				/*
				new Promise(resolve => {
					resolve(query(156));
				}).then((areas) => {
					for (const province of areas) provinces.push(province);
					let provinceIndex = provinces.findIndex((p) => {
						return p.name === props.initialArea[0];
					})
					if (provinceIndex === -1) provinceIndex = 0;
					initialIndex.push(provinceIndex);
					selected.push({
						code: provinces[provinceIndex].code,
						name: provinces[provinceIndex].name,
						parentName: provinces[provinceIndex].parentName,
					});
					return new Promise(resolve => {
						resolve(query(provinces[provinceIndex]['code'])) //[]取属性
					});
				}).then((areas) => {
					cities.length = 0;
					for (const city of areas) cities.push(city);
					let cityIndex = cities.findIndex((c) => {
						return c.name === props.initialArea[1];
					});
					if (cityIndex === -1) cityIndex = 0;
					initialIndex.push(cityIndex);
					selected.push({
						code: cities[cityIndex].code,
						name: cities[cityIndex].name,
						parentName: cities[cityIndex].parentName,
					});
					return new Promise((resolve, reject) => {
						if (props.showCounty) resolve(query(cities[cityIndex].code)) //.取属性
						else reject();
					});
				}).then((areas) => {
					counties.length = 0;
					for (const county of areas) counties.push(county);
					let countyIndex = counties.findIndex((c) => {
						return c.name === props.initialArea[2];
					});
					if (countyIndex === -1) countyIndex = 0;
					setTimeout(() => { //奇怪的写法，必须要延迟，picker-view中的value才起作用
						initialIndex.push(countyIndex);
						for (const index of initialIndex) oldSelectedIndex.push(index)
					}, 0);
					selected.push({
						code: counties[countyIndex].code,
						name: counties[countyIndex].name,
						parentName: counties[countyIndex].parentName,
					});
				}).catch(error => {});
				*/
				console.log(selected);
				content.emit('selected', selected);
			};
			onBeforeMount(init);
			watch(props.initialArea, init);
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
