<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登入图书商城</view>
			<view class="">
				<input class="u-border-bottom" v-model="email" placeholder="请输入邮箱" confirm-type="next" @confirm="nextFocus"/>
				<view class="tips" v-show="isShowTip">请输入正确的邮箱号</view>
			</view>
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" :focus="isFocus" confirm-type="done" @confirm="submit"/>
			<button :loading="submitBtn" :disabled="submitBtn" @click="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="issue" @click="jump('pages/auth/register')">注册</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password:'',
			isShowTip:false, //是否提示邮箱格式问题
			submitBtn:false, //按钮旁边的loading图标与按钮可用与否的控制
			isFocus:false // 密码框聚焦
		}
	},
	onLoad({email,password}) {
		this.email=email
		this.password=password
	},
	computed: {
		inputStyle() {
			let style = {};
			// 通过防抖控制错误信息提示的时间
			uni.$u.debounce(()=>{
				if(this.email){
					this.isShowTip=true
				}
				if(this.$u.test.email(this.email)){
					this.isShowTip=false
				}
			},1000)
			
			if(this.$u.test.email(this.email) && this.password) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['primary'];
			}
			return style;
		}
	},
	methods: {
		async login(){
			this.submitBtn=true
				// 处理登录参数
				try{
					// 
					const params={
						email:this.email,
						password:this.password
					}
					const loginRes=await this.$API.reqAuthLogin(params)
					// 关闭按钮旁的loading标识符
					this.submitBtn=false
					// 缓存token
					this.$u.vuex('user_token',loginRes.access_token)
					// 请求用户信息
					const userInfo = await this.$API.reqGetUserInfo()
					// 缓存用户信息
					this.$u.vuex('user_info',userInfo)
					// 登录之后，跳转到来源页面
					// 回源跳转
					const backUrl = uni.getStorageSync('back_url') || 'pages/index/index'
					const pathUrl = uni.getStorageSync('back_path')
					this.$u.route({
						type:'reLaunch',
						url:backUrl,
						params:pathUrl
					})
				}catch(e){
					this.submitBtn=false
				}
				
				
		},
		nextFocus(){
			// 当邮箱格式正确按回车跳转密码框
			if(this.$u.test.email(this.email)){
				this.$nextTick(()=>{
					this.isFocus=true
				})
			}
		},
		
		submit() {
			// 点击登录
			if(this.$u.test.email(this.email) && this.password) {
				this.login()
			}else{
				return false
			}
		},
		jump(path){
			// 页面的跳转
			this.$u.route(path)
		}
		
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	overflow: hidden;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;
		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			font-size: 20rpx;
			color: $u-error;
			margin-top: 4rpx;
		}
		.getCaptcha {
			background-color: #a2b8ff;
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 0 150rpx;
			justify-content:space-between;
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
	}
}
</style>
