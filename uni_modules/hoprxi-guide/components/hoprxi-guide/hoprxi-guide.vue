<template>
	<swiper class="swiper" @change="change">
		<swiper-item v-for="(element,index) in elements" :key="index">
			<view class="flex flex-direction">
				<block v-for="(item,i) in element" :key="i">
					<image v-if="item.img" :src="item.img.src" :mode="item.img.src.mode ||'aspectFit'"
						:style="[item.style,currentIndex!==index?item.animationStyle:'']" @click="(e)=>click(item)">
					</image>
					<view v-else :style="[item.style,currentIndex!==index?item.animationStyle:'']"
						@click="(e)=>click(item)">
						{{item.label}}
					</view>
				</block>
			</view>
		</swiper-item>
	</swiper>
	<view class="countDown" :style="{width:countDown.size+'rpx',height:countDown.size+'rpx'}">
		<text>{{countDown.seconds}}</text>
	</view>
	<view class="indicators">
		<view class="indicator" v-for="(element,index) in elements" :class="{'active':currentIndex===index}"
			:key="index" @click="currentIndex=index">
		</view>
	</view>
</template>
<script>
	import {
		ref,
	} from "vue";
	export default {
		name: 'hoprxi-guide',
		props: {
			elements: {
				type: Array,
				default: []
			},
			countDown: {
				type: Object,
				default: {
					size: 116,
					seconds: 10,
					lineWidth: 8,
				}
			}
		},
		setup(props, content) {
			let currentIndex = ref(0);
			let second = ref(10);
			const change = (e) => {
				currentIndex.value = e.detail.current; //value注意，不用这个赋值不是响应性的
			};
			const click = (data) => {
				content.emit(data.event, data);
			};
			return {
				currentIndex,
				change,
				click
			}
		}
	}
</script>
<style lang="scss">
	.swiper {
		height: 100vh;
		padding-top: var(--status-bar-height);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.countDown {
		position: absolute;
		left: 70vw;
		top: calc(var(--status-bar-height) + 78rpx);
		font-size: 28rpx;
		color: #11B654,
	}

	.indicators {
		position: absolute;
		bottom: 10vh;
		width: 100vw;
		display: flex;
		justify-content: center;


		.indicator {
			width: 12rpx;
			height: 10rpx;
			background: #C0C0C0;
			border-radius: 4rpx;
			transition: width .5s ease, background .5s ease;

			&.active {
				width: 42rpx;
				background: #11B654;
			}

			+.indicator {
				margin-left: 9rpx;
			}
		}
	}
</style>
