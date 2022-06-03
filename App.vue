<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*导入colorUI */
	 @import "@/common/colorui/icon.css";
	 @import "@/common/colorui/main.css";
	// 导入阿里巴巴矢量图标库
	/*#ifdef MP*/
	@import '@/common/iconfont/iconfont.css';
	/*#endif*/
	/*#ifndef MP*/
	@import url('https://at.alicdn.com/t/font_2371605_4x5ftul051q.css');
	/*#endif*/
</style>

