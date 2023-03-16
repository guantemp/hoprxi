<template>
	<hoprxi-guide :elements="elements" @experience="experience" v-if="!isLaunched"></hoprxi-guide>
</template>

<script>
	import {
		ref,
	} from "vue";
	export default {
		setup(props, content) {
			let isLaunched = false;
			const elements = [
				[{
					label: 'HOPRXI协助工具，帮助改善应用',
					style: {
						paddingLeft: '24rpx',
						marginTop: "10vh",
						fontSize: "40rpx",
						fontWeight: 500,
						color: "#11B654",
						willChange: 'transform',
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateX(-800rpx) translateY(-800rpx)"
					}
				}, {
					label: '适配思迅、科脉、泰格、博优等多个管理软件',
					style: {
						marginTop: '16rpx',
						paddingLeft: '48rpx',
						fontSize: "26rpx",
						fontWeight: 300,
						color: "#11B654",
						willChange: 'transform',
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateX(-800rpx) translateY(800rpx)"
					}
				}, {
					img: {
						src: '/static/guide/guide02.png',
						mode: 'aspectFit'
					},
					style: {
						marginTop: '32rpx',
						height: '45vh',
						width: "100vw",
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateY(-300rpx)"
					}
				}],
				[{
					label: '学习成本低',
					style: {
						paddingLeft: '12px',
						marginTop: "10vh",
						fontSize: "20px",
						fontWeight: 500,
						color: "#11B654",
						willChange: 'transform',
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateX(-400px) translateY(-400px)"
					}
				}, {
					label: '基于通用前端技术，无额外学习成本！',
					style: {
						marginTop: '8px',
						paddingLeft: '24px',
						fontSize: "13px",
						fontWeight: 300,
						color: "#11B654",
						willChange: 'transform',
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateX(400px) translateY(-400px)"
					}
				}, {
					img: {
						src: '/static/guide/guide03.png',
						mode: 'aspectFit'
					},
					style: {
						marginTop: '16px',
						height: '45vh',
						width: "100vw",
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateY(-150px)"
					}
				}, {
					label: '立即体验',
					event: "experience",
					style: {
						position: "absolute",
						bottom: '19.5vh',
						left: '28.5%',
						padding: ' 11px 46px',
						background: '#FFFFFF',
						borderRadius: '22px',
						border: '1px solid #11B654',
						fontSize: '16px',
						fontWeight: 500,
						color: '#11B654',
						transition: 'transform .8s ease, opacity .8s ease'
					},
					animationStyle: {
						opacity: 0,
						transform: "translateY(100px)"
					},
				}]
			];
			const experience = (data) => {
				uni.setStorage({
					key: "launched",
					data: new Date().getTime() + 7200000,
					complete() {
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/workflow'
							})
						}, 50);
					}
				})
			};
			return {
				isLaunched,
				elements,
				experience
			}
		},
		onLoad() {
			let expire = uni.getStorageSync("launched") || 0;
			if (new Date().getTime() <= expire) {
				this.isLaunched = true;
				uni.switchTab({
					url: '/pages/tabBar/workflow'
				})
				//console.log(this.isLaunched);
			}
			/*
			const res = uni.getStorageInfoSync();
			console.log(res.keys);
			console.log(res.currentSize);
			console.log(res.limitSize);
			*/
		}
	}
</script>

<style lang="scss">

</style>
