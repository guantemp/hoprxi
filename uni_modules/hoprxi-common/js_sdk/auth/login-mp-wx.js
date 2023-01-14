export default {
	// #ifdef MP-WEIXIN
	data() {
		return {
			mpCodeTimer: 0,
			mpWxCode: '',
		}
	},
	computed: {
		timerIdent() {
			return this.$store.state.timerIdent;
		}
	},
	watch: {
		timerIdent() {
			this.mpCodeTimer++;
			if (this.mpCodeTimer % 30 === 0) {
				this.getMpWxCode();
			}
		}
	},
	onShow() {
		this.getMpWxCode();
	},
	methods: {
		//微信小程序登录
		mpWxGetUserInfo(userInfoData) {
			if (!userInfoData.detail.userInfo) {
				return;
			}
			if (!this.agreement) {
				this.$util.msg('请阅读并同意用户服务及隐私协议');
				return;
			}
			this.$util.throttle(async () => {
				const [err, userData] = await uni.getUserInfo();
				await this.$http
					.post('/auth/v1/login', {
						method: 'byShortcut'
					})
					.then(res => {
						console.log(res.data);
					})
					.catch(err => {
						this.$util.toast(`服务器离线，请稍后再试！`);
					});
				this.navTo('/pages/auth/bindMobile?data=' + JSON.stringify(res.data))
			})
		},
		//获取code
		getMpWxCode() {
			uni.login({
				provider: 'weixin',
				success: res => {
					this.mpWxCode = res.code;
				}
			})
		},

	}
	// #endif
}
