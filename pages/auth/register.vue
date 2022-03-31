<template>
	<view>
		<u-form labelPosition="left" labelWidth="150rpx" :model="regForm" :rules="rules" ref="uForm">
			<u-form-item label="昵称" prop="name" borderBottom>
				<u-input v-model="regForm.name" placeholder="请输入昵称" border="none" focus></u-input>
			</u-form-item>
			<u-form-item label="邮箱" prop="email" borderBottom>
				<u-input v-model="regForm.email" placeholder="请输入邮箱" border="none"></u-input>
			</u-form-item>
			<u-form-item label="密码" prop="password" borderBottom>
				<u-input type="password" v-model="regForm.password" placeholder="请输入密码" border="none"></u-input>
			</u-form-item>
			<u-form-item label="确认密码" prop="password_confirmation" borderBottom>
				<u-input type="password" v-model="regForm.password_confirmation" placeholder="请确认密码" border="none">
				</u-input>
			</u-form-item>
		</u-form>
		<button @click="submit" :loading="submitBtn" :disabled="submitBtn" type="primary" class="getCaptcha">注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			var regEmail = (rule, value, callback) => uni.$u.test.email(value)
			var confirmPsw = (rule, value, callback) => value === this.regForm.password
			return {
				// 用户注册参数
				regForm: {
					name: "",
					email: "",
					password: "",
					password_confirmation: "",
				},
				submitBtn: false,
				rules: {
					name: {
						type: 'string',
						required: true,
						message: '请输入昵称',
						trigger: ['blur']
					},
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['blur']
						},
						{
							validator: regEmail,
							message: '请输入正确的邮箱格式',
							trigger: ['blur']
						},
					],
					password: {
						type: 'string',
						required: true,
						message: '请输入密码',
						trigger: ['blur']
					},
					password_confirmation: [{
							required: true,
							message: '请输入确认密码',
							trigger: ['blur']
						},
						{
							validator: confirmPsw,
							message: '两次输入密码不一致',
							trigger: ['blur']
						}
					]
				},
			};
		},
		methods: {
			async toRegister() {
				try {
					//注册btn样式
					this.submitBtn = true
					// 注册接口
					const regRes = await this.$API.reqRegister(this.regForm)
					this.submitBtn = false
					// 注册成功，重定向到登录（关闭注册页面）
					this.$u.toast('注册成功!')
					// 延时跳转
					setTimeout(() => {
						this.$u.route({
							type: "redirect",
							url: "/pages/auth/login",
							params: {
								email: this.regForm.email,
								password: this.regForm.password
							}
						})
					}, 1500)
				} catch (e) {
					this.submitBtn = false
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					this.toRegister()
				}).catch(errors => {
					uni.$u.toast('请检查输入是否正确')
				})
			}
		}
	}
</script>

<style lang="less">
	.u-form-item {
		margin-left: 5px;
	}
</style>
