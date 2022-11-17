<template>
	<view class="login">
		<view class="right-top-sign"></view>
		<view class="left-bottom-sign"></view>
		<text class="back-btn cuIcon-back"  @click="navBack"></text>
		<view>
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">欢迎回来！</view>
			<view class="input-content">
				<view class="cu-form-group form-group">
					<text class="icon-mobile from-tit"></text>
					<input type="number" placeholder="请填写手机号码" name="input" v-model="mobile" maxlength="11"
						@input="check(mobile,smsCode,password)">
				</view>
				<view v-if="verification" class="cu-form-group form-group">
					<text class="cuIcon-safe from-tit"></text>
					<input placeholder="请填写手机验证码" name="input" type="number" v-model="smsCode" maxlength="6"
						@input="check(mobile,smsCode,password)">
					<button class="cu-btn smsBtn" :class="sendCodeBtnDisable?'':'smsBtnEnable'"
						@click.self.stop="sendSmsCode" :disabled="sendCodeBtnDisable">
						<text v-if="!sendCodeTitDisable">获取验证码</text>
						<text v-else>{{codeSeconds}}秒</text>
					</button>
				</view>
				<view v-else class="cu-form-group form-group">
					<text class="icon-password from-tit"></text>
					<input placeholder="请填写密码(6-16位大，小写字母、数字)" name="input" :password='pass' v-model="password"
						maxlength="16" @input="check(mobile,smsCode,password)">
					<text style="font-size: 32rpx;" :class="pass?'icon-open-eye':'icon-close-eye'" @tap="this.pass=!this.pass"></text>
				</view>
				<view class="second_line" />
				<button class="cu-btn bg-cyan lg confirmBtn" :disabled="confirmBtnDisabled"
					@click.self.stop="login">登录</button>
			</view>
			<view class="other-wrapper">
				<view>快捷登录</view>
				<view class="line"> </view>
				<view class="shortcut">
					<image @click="convert" v-if="verification" class="img" src="/static/user_icon/password.png"></image>
					<image @click="convert" v-else class="img" src="/static/user_icon/tel.png"></image>
					<!-- #ifdef MP-WEIXIN -->
					<button class="btn" plain open-type="getUserInfo" @getuserinfo="getUserInfo">
						<image class="img" src="/static/user_icon/wx.png"></image>
					</button>
					<!--#endif-->
					<!--
					<image class="img" src="/static/user_icon/weibo.png"></image>
					<image class="img" src="/static/user_icon/GitHub.png"></image>
					-->
				</view>
			</view>
			<view class="appendix">
				<text @click="this.$util.navTo('/pages/user/password')">忘记密码</text>
				<text class="appendix-split">|</text>
				<text @click="this.$util.navTo('/pages/user/register')">注册账号</text>
			</view>
			<view class="agreement">
				<checkbox class='round red check' @checked="agreement" @click="checkAgreement"></checkbox>
				<view>
					<text>我已阅读并同意</text>
					<text class="tit" @click="this.$util.navTo('/pages/public/not_implemented')">《用户服务协议》</text>
					<text class="tit" @click="this.$util.navTo('/pages/public/not_implemented')">《隐私权政策》</text>
				</view>
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
	import wxAuth from '@/common/js/auth/wechatAuth.js'
	export default {
		mixins: [wxAuth],
		data() {
			return {
				agreement: true,
				mobile: '',
				password: '',
				smsCode: '',
				verification: false,
				sendCodeTitDisable: false,
				sendCodeBtnDisable: true,
				codeSeconds: 0,
				countDown: 59,
				confirmBtnDisabled: true,
				method: '',
				pass: true,
			}
		},
		methods: {
			check(mobile, smsCode, password) {
				if (checkMobile(mobile)) {
					this.sendCodeBtnDisable = false;
					if (this.verification && checkSmsCode(smsCode)) {
						this.confirmBtnDisabled = false;
					} else if (!this.verification && checkPassword(password)) {
						this.confirmBtnDisabled = false;
					} else {
						this.confirmBtnDisabled = true;
					}
				} else {
					this.sendCodeBtnDisable = true;
					this.confirmBtnDisabled = true;
				}
			},
			convert() {
				this.verification = !this.verification;
				if (this.verification) {
					this.method = 'byCode';
				} else {
					this.method = 'byPassword';
				}
				this.check(this.mobile, this.smsCode, this.password);
			},
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
					console.log(err);
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
			//登录
			async login() {
				if (!this.agreement) {
					this.$util.toast('请阅读并同意用户服务协议及隐私权协议');
					return;
				}
				await this.$http.post('/auth/v1/auth', {
					username: this.mobile,
					password: this.password,
					code: this.smsCode,
					method: this.method,
				}).then(res => {
					if (!res.data.code) {
						this.$util.toast('登录成功，欢迎回来！');
						this.$store.commit('login', res.data);
						setTimeout(() => {
							uni.navigateBack();
						}, 1500)
					} else {
						this.$util.toast(res.data.message);
					}
				}).catch(err => {
					this.$util.toast(`服务器离线，请稍后再试！`);
				});
			},
			navBack() {
				uni.navigateBack();
			},
			//同意协议
			checkAgreement() {
				this.agreement = !this.agreement;
			},
		}
	}
</script>

<style scoped lang='scss'>
	.login {
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
		padding: 0rpx 40rpx;

		.form-group {
			padding: 0rpx 10rpx;
		}

		.smsBtn {
			background: transparent;
			border-width: 0px;
			outline: none;
		}

		.smsBtnEnable {
			color: #2b85e4;
		}

		.from-img {
			width: 54rpx;
			height: 54rpx;
			margin-right: 30rpx;
		}

		.second_line {
			vertical-align: middle;
			border-bottom: solid 2upx #e8e8e8;
			margin-bottom: 46rpx;
		}

		.from-tit {
			font-size: 60rpx;
			margin-right: 30rpx;
			color: #1cbbb4;
		}

		.confirmBtn {
			width: 98%;
		}
	}

	.other-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 80rpx;

		.shortcut {
			display: flex;
			width: 300rpx;
			justify-content: space-around;
			margin-top: 25rpx;
		}

		.btn {
			border: 0;
			padding: 0rpx;
			margin: 0rpx;

			&:after {
				border: 0;
			}
		}

		.line {
			vertical-align: middle;
			width: 300rpx;
			margin-top: 20rpx;
			border-bottom: solid 2upx #e8e8e8;
		}

		.img {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.appendix {
		display: flex;
		justify-content: center;
		margin-top: 60rpx;

		.appendix-split {
			margin-right: 20rpx;
			margin-left: 20rpx;
		}
	}

	.agreement {
		position: absolute;
		left: 10rpx;
		bottom: 6vh;
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
</style>
