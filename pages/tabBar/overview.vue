<template>
	<view class="padding text-center bg-white">
		<text class="text-lg text-red">HOPRXI协助工具 - Release Notes</text>
	</view>
	<view class="cu-timeline">
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-green">version 0.1.4</view>
					<view class="cu-tag line-green">2023-07-03</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、实现日期时间的单选组件</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-green">version 0.1.3</view>
					<view class="cu-tag line-green">2023-03-10</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、增加了guide组件（splash页面）</text>
					<text>2、完成了依据网络查询area-picker组件</text>
					<text>3、修改了自定义组件dropdown的开发工具运行报错</text>
					<text>4、修改了自定义组件cell的vue3改造</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.1.2</view>
					<view class="cu-tag line-cyan">2023-01-13</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、根据hoprxi.tooo.top网站数据更新</text>
					<text>2、自定义组件dropdown由父组件传递数据因为延迟，可以正常显示使用，但开发工具运行报错</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.1.1</view>
					<view class="cu-tag line-cyan">2022-11-17</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、reactive,要用es6中的Map才不会失去响应性</text>
					<text>2、tree组件中递归子组件可以显示了,在传递给子组件出现低级拼写错误</text>
					<text>3、tree组件递归checkbox点击可以传给最上层使用者了</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.1</view>
					<view class="cu-tag line-cyan">2022-06-19</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、使用vue3开始改写</text>
					<text>2、一个下拉菜单，完成度90%</text>
					<text>3、组件中使用v-for的solt现在不弹警告消息了</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.8</view>
					<view class="cu-tag line-cyan">2021-07-22</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、一个可以拖拽，自动靠边的悬浮球弹出菜单</text>
					<text>2、一个基础版本的树组件</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.7</view>
					<view class="cu-tag line-cyan">2021-06-17</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>呕！更新左滑删除组件，头大了</text>
					<text>改用vue3或者是uni修复了bug,似乎一切正常起来了</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.6</view>
					<view class="cu-tag line-cyan">2021-06-04</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、商品编辑、增加</text>
					<text>2、标签打印的列表显示</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.5</view>
					<view class="cu-tag line-cyan">2021-05-21</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、商品目录展示</text>
					<text>2、调价单据的bug修复及显示优化</text>
					<text>3、优化打印标签的设置</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.4</view>
					<view class="cu-tag line-cyan">2021-05-10</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、调价单据的优化及本地js实现</text>
					<text>2、hoprxi-navigation组件,增加额外部分高度可变</text>
					<text>3、打印标签展示</text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.3</view>
					<view class="cu-tag line-cyan">2021-03-31</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、实现门店定位或手动选择 </text>
					<text>2、调价单据的显示 </text>
					<text>3、hoprxi_cell组件，自定义字体颜色、大小、粗细，箭头图标并丢出点击事件 </text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.2</view>
					<view class="cu-tag line-cyan">2021-02-25</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、商品档案、调价、标价签、促销显示 </text>
					<text>2、采购菜单设计 </text>
					<text>3、实现自定义的导航栏组件 </text>
				</view>
			</view>
		</view>
		<view class="cu-item text-gray">
			<view class="bg-gray light content">
				<view class="cu-capsule radius">
					<view class="cu-tag bg-cyan">version 0.0.1</view>
					<view class="cu-tag line-cyan">2021-01-04</view>
				</view>
				<view class="margin-top flex flex-direction">
					<text>1、用户注册，登录，微信快捷登录功能 </text>
					<text>2、短信发送、验证码 </text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		setup(props, content) {
		
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
