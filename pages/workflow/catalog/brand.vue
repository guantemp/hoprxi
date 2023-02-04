<template>
	<hoprxi-navigation title="品牌" :backgroundColor="[1, ['#6B73FF', '#000DFF', 135]]" :titleFont="['#FFF']"
		:surplusHeight=43 id="navigation">
		<view slot="extendSlot" class="cu-bar search">
			<view class="search-form radius" style="height:76rpx">
				<text class="cuIcon-search text-bold text-xl"></text>
				<input v-model="scanResult" :adjust-position="false" type="text" placeholder="请输入品牌名称/拼音助记码"
					confirm-type="search" placeholder-class="text-df">
			</view>
		</view>
	</hoprxi-navigation>
</template>

<script>
</script>

<style>
</style>