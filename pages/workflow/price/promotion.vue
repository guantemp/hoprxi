<template>
	<view>
		<hop-nav-bar title="促销" :backgroundColor="[1, ['#FDD819', '#E80505', 90]]" :titleFont="['#FFF']" surplusHeight=43>
			<view slot="extendSlot" class="cu-bar search">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入商品名称、条码、拼音助记码"
						confirm-type="search">
					<text class="cuIcon-scan text-blue text-bold" @tap="scan"></text>
				</view>
				<view class="action text-white">
					<text class="cuIcon-close "></text>
					<text @click="computedScrollViewHeight">取消</text>
				</view>
			</view>
		</hop-nav-bar>
	</view>
</template>

<script>
</script>

<style>
</style>
