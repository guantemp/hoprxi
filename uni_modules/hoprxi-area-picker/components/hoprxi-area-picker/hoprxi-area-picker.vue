<template>
	<picker-view class="picker-view" indicator-style="height:44px" :value="initialIndex" @change="change">
		<picker-view-column>
			<view class="view" v-for="(province,index) in provinces" :key="index">{{province.name}}</view>
		</picker-view-column>
		<picker-view-column>
			<view class="view" v-for="(city,index) in cities" :key="index">{{city.name}}</view>
		</picker-view-column>
		<picker-view-column v-if="showCounty">
			<view class="view" v-for="(county,index) in counties" :key="index">{{county.name}}</view>
		</picker-view-column>
	</picker-view>
</template>
<script>
	import {
		reactive,
		watch,
		watchEffect,
		onBeforeMount
	} from 'vue';
	import ajax from '@/uni_modules/u-ajax'
	export default {
		name: 'hoprxi-area-picker',
		props: {
			initialArea: {
				type: Array,
				default: []
			},
			showCounty: {
				type: Boolean,
				default: true
			}
		},
		setup(props, content) {
			const provinces = reactive([]);
			const cities = reactive([]);
			const counties = reactive([]);
			const initialIndex = reactive([]);
			const oldSelectedIndex = [];
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
			const _second = (index) => {
				initialIndex.splice(1, 1, index);
				oldSelectedIndex.splice(1, 1, index);
				selected.splice(1, 1, {
					code: cities[index].code,
					name: cities[index].name,
					parentName: cities[index].parentName,
				});
				if (props.showCounty) {
					query(cities[index].code).then((areas) => {
						counties.length = 0;
						for (const county of areas) counties.push(county);
						initialIndex.splice(2, 1, 0);
						oldSelectedIndex.splice(2, 1, 0);
						selected.splice(2, 1, {
							code: counties[0].code,
							name: counties[0].name,
							parentName: counties[0].parentName,
						});
					});
				}
			};
			const change = (e) => {
				let index = [...e.detail.value]
				if (index[0] != oldSelectedIndex[0]) {
					initialIndex.splice(0, 1, index[0]);
					oldSelectedIndex.splice(0, 1, index[0]);
					selected.splice(0, 1, {
						code: provinces[index[0]].code,
						name: provinces[index[0]].name,
						parentName: provinces[index[0]].parentName,
					});
					query(provinces[index[0]].code).then((areas) => {
						cities.length = 0;
						for (const city of areas) cities.push(city);
						_second(0);
					});
				}
				if (index[1] != oldSelectedIndex[1]) {
					_second(index[1]);
				}
				if (index[2] != oldSelectedIndex[2]) {
					selected.splice(2, 1, {
						code: counties[index[2]].code,
						name: counties[index[2]].name,
						parentName: counties[index[2]].parentName,
					});
					oldSelectedIndex.splice(2, 1, index[2]);
				}
				content.emit('selected', selected);
			};
			const init = () => {
				selected.length = 0;
				initialIndex.length = 0
				oldSelectedIndex.length = 0;
				if (props.showCounty) {
					_first().then((areas) => {
						counties.length = 0;
						for (const county of areas) counties.push(county);
						let countyIndex = counties.findIndex((c) => {
							return c.name === props.initialArea[2];
						});
						if (countyIndex === -1) countyIndex = 0;
						setTimeout(() => { //奇怪的写法，必须要延迟，picker-view中的value才起作用
							initialIndex.splice(2, 1, countyIndex);
						}, 0);
						oldSelectedIndex.splice(2, 1, countyIndex);
						selected.splice(2, 1, {
							code: counties[countyIndex].code,
							name: counties[countyIndex].name,
							parentName: counties[countyIndex].parentName,
						});
					})
				} else {
					_first();
				}
				content.emit('selected', selected);
			};
			const _first = () => {
				return new Promise(resolve => {
					query(156).then((areas) => {
						for (const province of areas) provinces.push(province);
						let provinceIndex = provinces.findIndex((p) => {
							return p.name === props.initialArea[0];
						})
						if (provinceIndex === -1) provinceIndex = 0;
						initialIndex.splice(0, 1, provinceIndex);
						oldSelectedIndex.splice(0, 1, provinceIndex)
						selected.splice(0, 1, {
							code: provinces[provinceIndex].code,
							name: provinces[provinceIndex].name,
							parentName: provinces[provinceIndex].parentName,
						});
						return query(provinces[provinceIndex]['code']) //[]取属性		
					}).then((areas) => {
						cities.length = 0;
						for (const city of areas) cities.push(city);
						let cityIndex = cities.findIndex((c) => {
							return c.name === props.initialArea[1];
						});
						if (cityIndex === -1) cityIndex = 0;
						setTimeout(() => { //奇怪的写法，initialIndex必须要延迟，在没有promise保证下picker-view中的value才起作用
							initialIndex.splice(1, 1, cityIndex);
						}, 0);
						oldSelectedIndex.splice(1, 1, cityIndex)
						selected.splice(1, 1, {
							code: cities[cityIndex].code,
							name: cities[cityIndex].name,
							parentName: cities[cityIndex].parentName,
						});
						if (props.showCounty) return resolve(query(cities[cityIndex]['code'])) //[]取属性
					});
				});
			};
			onBeforeMount(init);
			watch(() => props.initialArea, () => {
				init()
			}, {
				deep: true //非常重要，没有它area数组不会被watch到
			});
			//watch(props.initialArea,init) 会起作用，但服务端会报props.initialArea不是一个该监听的对象警告
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
	.picker-view {
		height: 238px;
		overflow: hidden;
		background-color: rgba(155, 255, 255, 1);
	}

	.view {
		text-align: center;
		width: 100%;
		height: 44px;
		line-height: 44px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 15px;
	}
</style>
