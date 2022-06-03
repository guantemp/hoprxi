<template>
	<view class="register">
		<view class="right-top-sign"></view>
		<view class="left-bottom-sign"></view>
		<text class="back-btn" :class="'cuIcon-close'" @click="navBack"></text>
		<view>
			<view class="left-top-sign">FORGET</view>
			<view class="welcome">当你老了</view>
			<view class="input-content">
				<view class="cu-form-group form-group">
					<text class="iconfont icon-mobile from-tit"></text>
					<input type="number" placeholder="请填写手机号码" name="input" v-model="mobile" maxlength="11" @input="check(mobile)">
				</view>
				<view class="cu-form-group form-group">
					<text class="iconfont icon-captcha from-tit"></text>
					<input placeholder="请填写手机验证码" name="input" type="number" v-model="smsCode" maxlength="6">
					<button class="cu-btn smsBtn" :class="sendCodeBtnDisable?'':'smsBtnEnable'" @click.self.stop="sendSmsCode"
					 :disabled="sendCodeBtnDisable">
						<text v-if="!sendCodeTitDisable">获取验证码</text>
						<text v-else>{{codeSeconds}}秒</text>
					</button>
				</view>
				<view class="cu-form-group form-group">
					<text class="iconfont icon-password from-tit"></text>
					<input placeholder="请填写密码(6-16位大，小写字母、数字)" name="input" password v-model="password">
				</view>
				<view class="cu-form-group form-group">
					<text class="iconfont icon-password from-tit"></text>
					<input placeholder="请再填写一次密码" name="input" password v-model="confirmPassword">
				</view>
				<view class="second_line" />
				<button class="cu-btn bg-yellow lg confirmBtn" :disabled="confirmBtnDisabled" @click.self.stop="restPassword">重置密码</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		checkMobile,
		checkPassword,
		checkSmsCode
	} from '@/common/js/util.js';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				confirmPassword: '',
				smsCode: '',
				sendCodeTitDisable: false,
				sendCodeBtnDisable: true,
				codeSeconds: 0,
				countDown: 59,
			}
		},

		methods: {
			async sendSmsCode() {
				await this.$http.get('/auth/v1/sms', {
					params: {
						mobile: this.mobile
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$util.toast(`验证码已发送`, 2000, false, 'success');
						this.handleSmsCodeTime(this.countDown);
					} else {
						this.$util.toast(res.data.message);
					}
				}).catch(err => {
					this.$util.toast(`服务器离线，请稍后再试！`);
				});
			},
			handleSmsCodeTime(time) {
				let timer = setInterval(() => {
					if (time === 0) {
						clearInterval(timer);
						this.sendCodeTitDisable = false;
					} else {
						this.codeSeconds = time;
						this.sendCodeTitDisable = true;
						time--;
					}
				}, 1000);
			},
			navBack() {
				uni.navigateBack();
			},
			async restPassword() {
				if (!checkSmsCode(this.smsCode)) {
					this.$util.toast('验证码格式不正确！');
					return;
				}
				if (!checkMobile(this.mobile)) {
					this.$util.toast('手机号码不正确！');
					return;
				}
				if (!checkPassword(this.password)) {
					this.$util.toast('密码不符合要求！');
					return;
				}
				if (this.password != this.confirmPassword) {
					this.$util.toast('2次输入密码不一致！');
					return;
				}
				await this.$http
					.put('/auth/v1/user', {
						username: this.mobile,
						password: this.password,
						confirmPassword: this.confirmPassword,
						code: this.smsCode,
						invitationCode: this.invitationCode,
					})
					.then(res => {
						console.log(res);
						if (!res.data.code) {
							this.$util.toast('注册成功,正在跳转登录...');
							setTimeout(() => {
								this.$util.navTo('/pages/user/login');;
							}, 1500)
						} else {
							this.$util.toast(res.data.message);
						}
					})
					.catch(err => {
						this.$util.toast(err);
					});
			},
		}
	}
</script>

<style scoped lang='scss'>
	.register {
		padding-top: 15vh;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.right-top-sign {
		position: absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-top-right-radius: 50px;
		}

		&:after {
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-top-left-radius: 50px;
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 80%;
		padding: 180rpx;
	}

	.back-btn {
		position: absolute;
		left: 20rpx;
		top: calc(var(--status-bar-height) + 20rpx);
		z-index: 90;
		padding: 20rpx;
		font-size: 32rpx;
		color: #606266;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: #f8f8f8;
		position: relative;
		left: -12rpx;
	}

	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0rpx 30rpx;

		.form-group {
			padding: 0rpx 10rpx;
			color: #2b85e4;
		}

		.smsBtn {
			background: transparent;
			border-width: 0px;
			outline: none;
		}

		.smsBtnEnable {
			color: #2b85e4;
		}

		.confirmBtn {
			width: 98%;
			margin-top: 40rpx;
		}

		.from-img {
			width: 54rpx;
			height: 54rpx;
			margin-right: 30rpx;
		}

		.from-tit {
			font-size: 60rpx;
			margin-right: 30rpx;
			color: #555555;
		}

		.second_line {
			vertical-align: middle;
			border-bottom: solid 2upx #e8e8e8;
			margin-bottom: 20rpx;
		}

		.agreement {
			position: absolute;
			left: 30rpx;
			z-index: 1;
			display: flex;
			align-items: center;
			width: 750rpx;
			height: 90rpx;
			font-size: 28rpx;
			text-align: center;

			.check {
				transform: scale(0.73);
			}

			.tit {
				color: #40a2ff;
			}

		}
	}
</style>
