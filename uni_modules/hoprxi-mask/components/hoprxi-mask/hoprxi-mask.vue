<template>
	<view @longpress="onLongPress" @longTap="onLongPress"  style="position: relative;">
		<view @tap.stop="itemClick(item)" >
			<slot></slot>
		</view>
		<view v-if="popup" :class="{'mask_buttons':popup}" @tap="popup = false">
			<view @tap.stop="buttonClick(button.event,item)" v-for="(button,num) in buttons" :key="num"
				class="flex flex-direction margin-lr-lg">
				<text :style="{color:button.fontColor}" :class="button.icon" class="margin-bottom-xs"
					style="font-size: 28px;" v-if="button.icon"></text>
				<text :style="{color:button.fontColor}" class="text-sm">{{button.name}}</text>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		computed,
		ref,
		watch
	} from 'vue';
	const props = defineProps({
		item: {
			type: Object,
			default: {}
		},
		buttons: {
			type: Array,
			default: [{
				name: '删除',
				background: '#ff5500',
				icon: 'cuIcon-delete',
				fontColor: '#fff',
				event: 'del'
			}]
		},
	});
	const emits = defineEmits(['del', 'itemClick']);
	let popup = ref(false);
	const onLongPress = (e) => {
		popup.value = true;
	};
	//单击按钮
	const buttonClick = (name, item) => {
		console.log(item)
		popup.value = false;
		//emits(name, item)
	};
	const itemClick = (item) => {
		emits('itemClick', item);
		console.log(item)
	};
	/*
	watch(() => props.item, (n,o) => {
		console.log(n)
	}, {
		deep: true //非常重要，没有它area数组不会被watch到
	});
	*/
</script>
<style lang="scss">
	.mask_buttons {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease-in-out 0s;
		justify-content: center;
		align-items: center;
		padding: 0 24px;
		border-bottom: 1px solid #fff;
	}
</style>